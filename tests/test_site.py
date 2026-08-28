from html.parser import HTMLParser
from pathlib import Path
import base64
import hashlib
import json
import re
import struct
import unittest


ROOT = Path(__file__).resolve().parents[1]


def relative_luminance(hex_color):
    hex_color = hex_color.lstrip("#")
    channels = [int(hex_color[i : i + 2], 16) / 255 for i in (0, 2, 4)]

    def linear(channel):
        return channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4

    red, green, blue = (linear(channel) for channel in channels)
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue


def contrast_ratio(first, second):
    lighter, darker = sorted((relative_luminance(first), relative_luminance(second)), reverse=True)
    return (lighter + 0.05) / (darker + 0.05)


def css_variables(block):
    return dict(re.findall(r"--([a-z-]+):\s*(#[0-9a-fA-F]{6})", block))


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.links = []
        self.link_tags = []
        self.text = []
        self.html_lang = None
        self.meta_names = set()
        self.meta_name_values = {}
        self.meta_properties = {}
        self.scripts = []
        self._script_type = None
        self._script_chunks = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        self.tags.append(tag)
        if tag == "html":
            self.html_lang = attributes.get("lang")
        if tag == "a":
            self.links.append(attributes.get("href", ""))
        if tag == "link":
            self.link_tags.append(attributes)
        if tag == "meta" and attributes.get("name"):
            self.meta_names.add(attributes["name"])
            self.meta_name_values[attributes["name"]] = attributes.get("content", "")
        if tag == "meta" and attributes.get("property"):
            self.meta_properties[attributes["property"]] = attributes.get("content", "")
        if tag == "script":
            self._script_type = attributes.get("type")
            self._script_chunks = []

    def handle_data(self, data):
        if self._script_type is not None:
            self._script_chunks.append(data)
        else:
            self.text.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._script_type is not None:
            self.scripts.append(
                {"type": self._script_type, "data": "".join(self._script_chunks)}
            )
            self._script_type = None
            self._script_chunks = []


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "site" / "index.html").read_text()
        cls.css = (ROOT / "site" / "styles.css").read_text()
        cls.nginx = (ROOT / "nginx.conf").read_text()
        cls.parser = SiteParser()
        cls.parser.feed(cls.html)
        cls.page_text = " ".join(cls.parser.text)

    def test_company_identity_and_services_are_present(self):
        self.assertIn("Decent Technology Group", self.page_text)
        self.assertIn("decent.", self.page_text)
        for service in ("Technology strategy", "Software delivery", "Infrastructure and operations"):
            self.assertIn(service, self.page_text)

    def test_inquiry_path_uses_company_email(self):
        self.assertIn("mailto:hello@decent.tech", self.parser.links)
        self.assertIn("hello@decent.tech", self.page_text)

    def test_page_uses_semantic_landmarks(self):
        for tag in ("header", "nav", "main", "section", "footer"):
            self.assertIn(tag, self.parser.tags)

    def test_skip_link_targets_main_content(self):
        self.assertIn('class="skip-link"', self.html)
        self.assertIn('href="#main-content"', self.html)
        self.assertIn('id="main-content"', self.html)

    def test_accessibility_basics_are_present(self):
        self.assertEqual(self.parser.html_lang, "en")
        self.assertIn("viewport", self.parser.meta_names)
        self.assertIn(":focus-visible", self.css)
        self.assertIn("prefers-reduced-motion", self.css)
        self.assertIn("prefers-color-scheme: dark", self.css)
        self.assertIn("color-scheme: light dark", self.css)

    def test_phone_layout_uses_a_narrow_breakpoint(self):
        self.assertRegex(self.css, r"@media \(max-width: 40rem\)")
        heading_size = re.search(r"h1\s*\{[^}]*font-size:\s*clamp\(([^,]+),", self.css)
        self.assertIsNotNone(heading_size)
        minimum = heading_size.group(1).strip()
        self.assertLessEqual(float(minimum.removesuffix("rem")), 2.6)

    def test_theme_contrast_meets_wcag_aa(self):
        root = re.search(r":root\s*\{([^}]+)\}", self.css)
        dark = re.search(
            r"@media \(prefers-color-scheme: dark\)\s*\{\s*:root\s*\{([^}]+)\}",
            self.css,
        )
        self.assertIsNotNone(root)
        self.assertIsNotNone(dark)
        for label, block in (("light", root.group(1)), ("dark", dark.group(1))):
            tokens = css_variables(block)
            for name in ("ink", "muted", "accent", "accent-on-ink", "paper"):
                self.assertIn(name, tokens, f"{label} theme is missing --{name}")
            self.assertGreaterEqual(
                contrast_ratio(tokens["ink"], tokens["paper"]),
                7.0,
                f"{label} body text fails AAA-capable contrast",
            )
            self.assertGreaterEqual(
                contrast_ratio(tokens["muted"], tokens["paper"]),
                4.5,
                f"{label} muted text fails AA",
            )
            self.assertGreaterEqual(
                contrast_ratio(tokens["accent"], tokens["paper"]),
                4.5,
                f"{label} accent fails AA",
            )
            self.assertGreaterEqual(
                contrast_ratio(tokens["accent-on-ink"], tokens["ink"]),
                4.5,
                f"{label} accent on inverted surfaces fails AA",
            )

    def test_favicon_and_open_graph_image_exist(self):
        favicon = ROOT / "site" / "favicon.svg"
        og_image = ROOT / "site" / "og.png"
        self.assertTrue(favicon.is_file())
        self.assertIn("<svg", favicon.read_text())
        self.assertTrue(og_image.is_file())
        with og_image.open("rb") as handle:
            signature = handle.read(8)
            self.assertEqual(signature, b"\x89PNG\r\n\x1a\n")
            length, chunk_type = struct.unpack(">I4s", handle.read(8))
            self.assertEqual(chunk_type, b"IHDR")
            width, height = struct.unpack(">II", handle.read(8))
        self.assertEqual((width, height), (1200, 630))
        icon_links = [item.get("href") for item in self.parser.link_tags if item.get("rel") == "icon"]
        self.assertIn("/favicon.svg", icon_links)

    def test_open_graph_and_twitter_meta_are_present(self):
        self.assertEqual(self.parser.meta_properties.get("og:type"), "website")
        self.assertEqual(self.parser.meta_properties.get("og:url"), "https://decent.tech/")
        self.assertEqual(
            self.parser.meta_properties.get("og:image"),
            "https://decent.tech/og.png",
        )
        self.assertIn("Decent Technology Group", self.parser.meta_properties.get("og:title", ""))
        self.assertTrue(self.parser.meta_properties.get("og:description"))
        self.assertEqual(self.parser.meta_name_values.get("twitter:card"), "summary_large_image")
        self.assertEqual(
            self.parser.meta_name_values.get("twitter:image"),
            "https://decent.tech/og.png",
        )

    def test_json_ld_describes_the_organization(self):
        json_ld = next(
            (script for script in self.parser.scripts if script["type"] == "application/ld+json"),
            None,
        )
        self.assertIsNotNone(json_ld)
        data = json.loads(json_ld["data"])
        self.assertEqual(data["@type"], "Organization")
        self.assertEqual(data["name"], "Decent Technology Group")
        self.assertEqual(data["url"], "https://decent.tech")
        self.assertEqual(data["email"], "hello@decent.tech")
        digest = hashlib.sha256(json_ld["data"].encode("utf-8")).digest()
        csp_hash = "sha256-" + base64.b64encode(digest).decode("ascii")
        self.assertIn(csp_hash, self.nginx)

    def test_robots_and_sitemap_are_published(self):
        robots = (ROOT / "site" / "robots.txt").read_text()
        sitemap = (ROOT / "site" / "sitemap.xml").read_text()
        self.assertIn("User-agent: *", robots)
        self.assertIn("Sitemap: https://decent.tech/sitemap.xml", robots)
        self.assertIn("https://decent.tech/", sitemap)

    def test_nginx_sends_security_headers(self):
        self.assertIn('X-Content-Type-Options "nosniff"', self.nginx)
        self.assertIn('Referrer-Policy "strict-origin-when-cross-origin"', self.nginx)
        self.assertIn("Strict-Transport-Security", self.nginx)
        self.assertIn("max-age=31536000", self.nginx)
        self.assertIn("Content-Security-Policy", self.nginx)
        self.assertIn("default-src 'self'", self.nginx)
        self.assertIn("style-src 'self'", self.nginx)
        self.assertIn("img-src 'self'", self.nginx)
        self.assertNotIn("unsafe-inline", self.nginx)

    def test_container_is_unprivileged_and_has_healthcheck(self):
        dockerfile = (ROOT / "Dockerfile").read_text()
        self.assertIn("nginx-unprivileged", dockerfile)
        self.assertIn("USER 101", dockerfile)
        self.assertIn("EXPOSE 8080", dockerfile)
        self.assertIn("HEALTHCHECK", dockerfile)


if __name__ == "__main__":
    unittest.main()
