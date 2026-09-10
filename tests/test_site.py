from html.parser import HTMLParser
from pathlib import Path
import filecmp
import json
import re
import shutil
import struct
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
DESIGN_SYSTEM = ROOT / "design-system"
PREVIEW_SCRIPT = DESIGN_SYSTEM / "scripts" / "build-site-preview.mjs"

# The five pages behind the five dots, in dot order: slug, title, path, token.
PAGES = (
    ("about", "About", "/about/", "gold"),
    ("portfolio", "Portfolio", "/portfolio/", "vermilion"),
    ("blog", "Blog", "/blog/", "terracotta"),
    ("ben", "About Ben", "/ben/", "steel"),
    ("contact", "Get in touch", "/contact/", "cream"),
)


# The React Bits scene behind each page and the extra effect on it, as
# site/README.md and design-system/src/site/scenes.ts list them. Portfolio and
# About Ben carry no effect: the cursor effects are off by Ben's request of
# 2026-09-10. They stay in the registry and in Storybook.
SCENES = {
    "about": ("liquid-ether", "split-text"),
    "portfolio": ("galaxy", None),
    "blog": ("threads", "scrambled-text"),
    "ben": ("iridescence", None),
    "contact": ("plasma", "shiny-text"),
}
SCENE_NAMES = (
    "liquid-ether",
    "galaxy",
    "threads",
    "iridescence",
    "plasma",
    "splash-cursor",
    "ribbons",
    "split-text",
    "scrambled-text",
    "shiny-text",
)


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
        self.scenes = []
        self.effects = []
        self.h1_count = 0
        self.menu_list_links = []
        self.current_page_links = []
        self._script_type = None
        self._script_chunks = []
        self._in_menu_list = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        self.tags.append(tag)
        if tag == "html":
            self.html_lang = attributes.get("lang")
        if tag == "h1":
            self.h1_count += 1
        if "data-scene" in attributes:
            self.scenes.append(attributes["data-scene"])
        if "data-effect" in attributes:
            self.effects.append(attributes["data-effect"])
        if tag == "a":
            self.links.append(attributes.get("href", ""))
            if self._in_menu_list:
                self.menu_list_links.append(attributes.get("href", ""))
            if attributes.get("aria-current") == "page":
                self.current_page_links.append(attributes.get("href", ""))
        if tag == "nav" and "menu-list" in attributes.get("class", "").split():
            self._in_menu_list = True
        if tag == "link":
            self.link_tags.append(attributes)
        if tag == "meta" and attributes.get("name"):
            self.meta_names.add(attributes["name"])
            self.meta_name_values[attributes["name"]] = attributes.get("content", "")
        if tag == "meta" and attributes.get("property"):
            self.meta_properties[attributes["property"]] = attributes.get("content", "")
        if tag == "script":
            self._script_type = attributes.get("type") or ""
            self._script_src = attributes.get("src")
            self._script_chunks = []

    def handle_data(self, data):
        if self._script_type is not None:
            self._script_chunks.append(data)
        else:
            self.text.append(data)

    def handle_endtag(self, tag):
        if tag == "nav":
            self._in_menu_list = False
        if tag == "script" and self._script_type is not None:
            self.scripts.append(
                {
                    "type": self._script_type,
                    "src": self._script_src,
                    "data": "".join(self._script_chunks),
                }
            )
            self._script_type = None
            self._script_chunks = []


def parse(path):
    parser = SiteParser()
    parser.feed(path.read_text())
    return parser


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (SITE / "index.html").read_text()
        cls.css = (SITE / "styles.css").read_text()
        cls.nginx = (ROOT / "nginx.conf").read_text()
        cls.parser = parse(SITE / "index.html")
        cls.page_text = " ".join(cls.parser.text)

    def test_company_identity_is_present_on_the_home_page(self):
        self.assertIn("Decent Technology Group", self.page_text)
        self.assertIn("decent.", self.page_text)

    def test_home_page_loads_the_site_bundle(self):
        module_scripts = [
            script for script in self.parser.scripts if script["src"] == "/assets/site.js"
        ]
        self.assertEqual(len(module_scripts), 1)
        self.assertEqual(module_scripts[0]["type"], "module")
        stylesheets = [
            item.get("href") for item in self.parser.link_tags if item.get("rel") == "stylesheet"
        ]
        self.assertIn("/assets/site.css", stylesheets)
        self.assertIn("/styles.css", stylesheets)

    def test_home_page_holds_the_menu_stage_and_the_link_list(self):
        self.assertIn('id="menu-stage"', self.html)
        self.assertIn('data-webgl="pending"', self.html)
        self.assertIn('id="menu-title"', self.html)
        self.assertEqual(self.parser.menu_list_links, [path for _, _, path, _ in PAGES])
        for _, _, _, token in PAGES:
            self.assertIn(f'data-dot="{token}"', self.html)

    def test_home_page_has_no_hero_services_or_contact_plate(self):
        for selector in ('class="hero"', 'class="services"', 'class="contact"'):
            self.assertNotIn(selector, self.html)

    def test_no_inline_script_or_style_anywhere_in_site(self):
        for page in SITE.rglob("*.html"):
            html = page.read_text()
            parser = parse(page)
            for script in parser.scripts:
                if script["src"] is None:
                    self.assertEqual(
                        script["type"],
                        "application/ld+json",
                        f"{page.relative_to(ROOT)} has an inline script",
                    )
            self.assertNotRegex(html, r"\sstyle=", f"{page.relative_to(ROOT)} has a style attribute")
            self.assertNotIn("<style", html, f"{page.relative_to(ROOT)} has a style element")
        for svg in SITE.rglob("*.svg"):
            self.assertNotRegex(
                svg.read_text(), r"\sstyle=", f"{svg.relative_to(ROOT)} has a style attribute"
            )

    def test_page_uses_semantic_landmarks(self):
        for tag in ("header", "nav", "main", "section"):
            self.assertIn(tag, self.parser.tags)
        # The home page is immersive: the stage fills the viewport, no footer.
        self.assertNotIn("footer", self.parser.tags)
        for slug, _, path, _ in PAGES:
            tags = parse(SITE / slug / "index.html").tags
            for tag in ("header", "nav", "main", "section", "footer"):
                self.assertIn(tag, tags, f"{path} lacks a {tag} landmark")

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
        self.assertIn(".visually-hidden", self.css)

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

    def test_stage_tokens_are_the_same_in_both_schemes(self):
        root = re.search(r":root\s*\{([^}]+)\}", self.css)
        dark = re.search(
            r"@media \(prefers-color-scheme: dark\)\s*\{\s*:root\s*\{([^}]+)\}",
            self.css,
        )
        light_tokens = css_variables(root.group(1))
        dark_tokens = css_variables(dark.group(1))
        for name in ("stage", "stage-ink", *(f"dot-{token}" for _, _, _, token in PAGES)):
            self.assertIn(name, light_tokens, f"light theme is missing --{name}")
            self.assertEqual(light_tokens[name], dark_tokens.get(name), f"--{name} differs in dark")
        self.assertEqual(light_tokens["stage"], "#182534")
        self.assertGreaterEqual(
            contrast_ratio(light_tokens["stage-ink"], light_tokens["stage"]),
            4.5,
            "stage text fails AA on the stage plate",
        )

    def test_menu_textures_match_the_dot_tokens(self):
        root = re.search(r":root\s*\{([^}]+)\}", self.css)
        tokens = css_variables(root.group(1))
        for slug, _, _, token in PAGES:
            svg = SITE / "menu" / f"{slug}.svg"
            self.assertTrue(svg.is_file(), f"{svg.relative_to(ROOT)} is missing")
            text = svg.read_text()
            self.assertIn('width="256"', text)
            self.assertIn('height="256"', text)
            fills = re.findall(r'fill="(#[0-9a-fA-F]{6})"', text)
            self.assertEqual(len(fills), 1, f"{slug}.svg must hold one filled rect")
            self.assertEqual(fills[0].lower(), tokens[f"dot-{token}"].lower(), f"{slug}.svg fill differs from --dot-{token}")

    def test_each_page_exists_with_one_heading_and_a_way_home(self):
        home_links = ("/", "https://decent.tech/")
        for slug, title, path, _ in PAGES:
            page = SITE / slug / "index.html"
            self.assertTrue(page.is_file(), f"{path} is missing")
            parser = parse(page)
            html = page.read_text()
            self.assertEqual(parser.html_lang, "en", f"{path} lang")
            self.assertEqual(parser.h1_count, 1, f"{path} must have one h1")
            self.assertIn('class="skip-link"', html, f"{path} skip link")
            self.assertIn('href="#main-content"', html, f"{path} skip link target")
            self.assertIn('id="main-content"', html, f"{path} main id")
            self.assertTrue(
                any(link in home_links for link in parser.links), f"{path} does not link home"
            )
            self.assertEqual(parser.current_page_links, [path], f"{path} aria-current")
            self.assertIn(f"{title} · Decent Technology Group", html)
            self.assertIn(f'<link rel="canonical" href="https://decent.tech{path}">', html)
            for _, _, other_path, _ in PAGES:
                self.assertIn(other_path, parser.links, f"{path} nav lacks {other_path}")

    def test_about_page_carries_the_services_copy(self):
        parser = parse(SITE / "about" / "index.html")
        text = " ".join(parser.text)
        self.assertIn("Technology that earns its place.", text)
        for service in ("Technology strategy", "Software delivery", "Infrastructure and operations"):
            self.assertIn(service, text)

    def test_contact_page_uses_company_email(self):
        parser = parse(SITE / "contact" / "index.html")
        self.assertIn("mailto:hello@decent.tech", parser.links)
        self.assertIn("hello@decent.tech", " ".join(parser.text))

    def test_each_page_mounts_one_named_scene(self):
        for slug, _, path, _ in PAGES:
            parser = parse(SITE / slug / "index.html")
            scene, effect = SCENES[slug]
            self.assertEqual(parser.scenes, [scene], f"{path} must hold exactly one data-scene")
            self.assertIn(scene, SCENE_NAMES, f"{path} scene {scene} is not in the registry")
            self.assertEqual(parser.effects, [effect] if effect else [], f"{path} data-effect")
            if effect:
                self.assertIn(effect, SCENE_NAMES, f"{path} effect {effect} is not in the registry")
            html = (SITE / slug / "index.html").read_text()
            self.assertIn('class="scene" data-scene=', html, f"{path} scene element lacks class scene")
            self.assertIn('href="/assets/site.css"', html, f"{path} must load the bundle stylesheet")
            self.assertIn('src="/assets/site.js"', html, f"{path} must load the bundle")
            self.assertIn(' plate"', html, f"{path} copy must sit on a plate")

    def test_home_page_holds_the_menu_and_no_scene_or_effect(self):
        self.assertIn('id="menu-stage"', self.html)
        self.assertEqual(self.parser.scenes, [])
        self.assertEqual(self.parser.effects, [])
        self.assertNotIn("menu-stage-frame", self.html)
        self.assertNotIn("scene--cursor", self.html)

    def test_no_page_mounts_a_cursor_effect(self):
        # Ben asked on 2026-09-10 for no cursor features. The two cursor
        # scenes stay in the registry, but no page mounts them.
        for slug in ("portfolio", "ben"):
            parser = parse(SITE / slug / "index.html")
            self.assertEqual(parser.effects, [], f"/{slug}/ must hold no data-effect")
        for slug, _, path, _ in PAGES:
            html = (SITE / slug / "index.html").read_text()
            for name in ("splash-cursor", "ribbons"):
                self.assertNotIn(
                    f'data-effect="{name}"', html, f"{path} must not mount {name}"
                )

    def test_readme_says_the_cursor_effects_are_off(self):
        text = (SITE / "README.md").read_text()
        self.assertIn("Cursor effects off by Ben's request 2026-09-10", text)

    def test_the_stage_does_not_scroll_with_the_wheel(self):
        # The wheel turns the sphere, so the stage keeps the viewport height
        # and stops the scroll chain.
        self.assertRegex(self.css, r"\.menu-stage \{[^}]*overscroll-behavior: none")

    def test_home_page_is_immersive(self):
        # The stage fills the viewport; the wordmark and the link row sit over
        # it; there is no header band, no hero, and no footer.
        self.assertIn('<body class="home">', self.html)
        self.assertIn('class="site-header"', self.html)
        self.assertIn('class="wordmark"', self.html)
        self.assertNotIn("<footer", self.html)
        self.assertIn(".home main {", self.css)
        self.assertRegex(self.css, r"\.home main \{[^}]*min-height: 100svh")
        self.assertRegex(self.css, r"\.home \.site-header \{[^}]*position: absolute")
        self.assertRegex(self.css, r"\.menu-stage \{[^}]*min-height: 100svh")
        self.assertRegex(self.css, r"\.menu-list \{[^}]*position: absolute")
        self.assertRegex(self.css, r"\.menu-list \{[^}]*bottom: 0")
        self.assertEqual(len(self.parser.menu_list_links), len(PAGES))

    def test_site_menu_shows_many_discs_at_rest(self):
        menu = (DESIGN_SYSTEM / "src" / "site" / "SiteMenu.tsx").read_text()
        scale = re.search(r"const MENU_SCALE = ([0-9.]+);", menu)
        self.assertIsNotNone(scale, "SiteMenu.tsx must set MENU_SCALE")
        self.assertGreaterEqual(float(scale.group(1)), 2.0)
        self.assertIn("scale={MENU_SCALE}", menu)
        vendored = (
            DESIGN_SYSTEM / "src" / "motion-examples" / "vendor" / "react-bits" / "infinite-menu" / "InfiniteMenu.tsx"
        ).read_text()
        self.assertIn("this.SPHERE_RADIUS * 0.35 * this.scaleFactor", vendored)
        self.assertIn("10. `updateProjectionMatrix()`", vendored)

    def test_ben_page_names_ben_davies(self):
        page = SITE / "ben" / "index.html"
        html = page.read_text()
        self.assertIn("Ben Davies", " ".join(parse(page).text))
        # Every "Ben <Surname>" on the page is the one correct name.
        surnames = set(re.findall(r"Ben [A-Z][a-z]+", html))
        self.assertEqual(surnames, {"Ben Davies"})

    def test_scene_registry_names_every_scene_the_pages_use(self):
        registry = (DESIGN_SYSTEM / "src" / "site" / "scenes.ts").read_text()
        for name in SCENE_NAMES:
            self.assertRegex(registry, rf"['\"]?{name}['\"]?:\s*\{{ load:", f"scenes.ts lacks {name}")
        for slug, (scene, effect) in SCENES.items():
            self.assertIn(scene, SCENE_NAMES, slug)
            if effect:
                self.assertIn(effect, SCENE_NAMES, slug)

    def test_scene_readme_names_every_scene(self):
        readme = SITE / "README.md"
        self.assertTrue(readme.is_file(), "site/README.md is missing")
        text = readme.read_text()
        for name in SCENE_NAMES:
            self.assertIn(f"`{name}`", text, f"site/README.md does not name {name}")
        for _, _, path, _ in PAGES:
            self.assertIn(f"`{path}`", text, f"site/README.md does not list {path}")

    def test_scene_and_plate_styles_use_brand_tokens(self):
        for selector in (".scene {", ".scene--cursor {", ".plate {"):
            self.assertIn(selector, self.css)
        root = re.search(r":root\s*\{([^}]+)\}", self.css)
        tokens = css_variables(root.group(1))
        expected = {
            "brand-cream": "#f2f1e8",
            "brand-navy": "#182534",
            "brand-vermilion": "#e34234",
            "brand-gold": "#ffcb73",
            "brand-terracotta": "#d97757",
            "brand-charcoal": "#2c2c2c",
            "brand-steel": "#5b8fa3",
        }
        for name, value in expected.items():
            self.assertEqual(tokens.get(name), value, f"--{name}")
        for slug, _, _, _ in PAGES:
            self.assertIn(f".page--{slug} {{", self.css, f"no page tokens for {slug}")
        # Plate text keeps AA against its plate: cream on navy or charcoal, charcoal on cream.
        self.assertGreaterEqual(contrast_ratio("#f2f1e8", "#182534"), 4.5)
        self.assertGreaterEqual(contrast_ratio("#f2f1e8", "#2c2c2c"), 4.5)
        self.assertGreaterEqual(contrast_ratio("#2c2c2c", "#f2f1e8"), 4.5)

    def test_favicon_and_open_graph_image_exist(self):
        favicon = SITE / "favicon.svg"
        og_image = SITE / "og.png"
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

    def test_robots_and_sitemap_are_published(self):
        robots = (SITE / "robots.txt").read_text()
        sitemap = (SITE / "sitemap.xml").read_text()
        self.assertIn("User-agent: *", robots)
        self.assertIn("Sitemap: https://decent.tech/sitemap.xml", robots)
        self.assertIn("<loc>https://decent.tech/</loc>", sitemap)
        for _, _, path, _ in PAGES:
            self.assertIn(f"<loc>https://decent.tech{path}</loc>", sitemap)

    def test_nginx_sends_security_headers(self):
        self.assertIn('X-Content-Type-Options "nosniff"', self.nginx)
        self.assertIn('Referrer-Policy "strict-origin-when-cross-origin"', self.nginx)
        self.assertIn("Content-Security-Policy", self.nginx)
        self.assertIn("default-src 'self'", self.nginx)
        self.assertIn("style-src 'self'", self.nginx)
        self.assertIn("img-src 'self'", self.nginx)
        self.assertIn("script-src 'self'", self.nginx)
        self.assertNotIn("unsafe-inline", self.nginx)
        self.assertNotIn("unsafe-eval", self.nginx)
        self.assertNotIn("data:", self.nginx)

    def test_nginx_leaves_transport_security_to_the_ingress(self):
        """TLS terminates at the Traefik ingress, not in this container.

        The container listens on plain HTTP on port 8080, so a
        Strict-Transport-Security header set here would be both ineffective and
        misleading. The ingress owns that header.
        """
        self.assertNotIn("Strict-Transport-Security", self.nginx)

    def test_container_is_unprivileged_and_has_healthcheck(self):
        dockerfile = (ROOT / "Dockerfile").read_text()
        self.assertIn("nginx-unprivileged", dockerfile)
        self.assertIn("USER 101", dockerfile)
        self.assertIn("EXPOSE 8080", dockerfile)
        self.assertIn("HEALTHCHECK", dockerfile)

    def test_container_builds_and_copies_the_site_bundle(self):
        dockerfile = (ROOT / "Dockerfile").read_text()
        self.assertIn("npm run build:site", dockerfile)
        self.assertIn("dist-site/assets", dockerfile)
        self.assertIn("/usr/share/nginx/html/assets/", dockerfile)

    def test_site_bundle_config_names_the_site_entry_and_outputs(self):
        config = (DESIGN_SYSTEM / "vite.site.config.ts").read_text()
        self.assertIn("src/site/site-entry.tsx", config)
        self.assertIn("'assets/site.js'", config)
        self.assertIn("'assets/site.css'", config)
        self.assertIn("'assets/site-[name].js'", config)
        self.assertIn("SITE_BASE_PATH", config)
        self.assertTrue((DESIGN_SYSTEM / "src" / "site" / "site-entry.tsx").is_file())

    def test_pages_workflow_publishes_the_site_preview(self):
        workflow = (ROOT / ".github" / "workflows" / "pages.yml").read_text()
        self.assertIn("site/**", workflow)
        self.assertIn("SITE_BASE_PATH: /decent-tech-site/site-preview/", workflow)
        self.assertIn(
            "node scripts/build-site-preview.mjs --base /decent-tech-site/site-preview/"
            " --out storybook-static/site-preview",
            workflow,
        )


class SitePreviewBuildTests(unittest.TestCase):
    """build-site-preview.mjs with base / must reproduce site/ byte for byte."""

    def setUp(self):
        if shutil.which("node") is None:
            self.skipTest("node is not installed; build-site-preview.mjs cannot run")
        self.temp = Path(tempfile.mkdtemp(prefix="site-preview-"))
        self.addCleanup(shutil.rmtree, self.temp, ignore_errors=True)
        # An empty bundle folder stands in for dist-site/assets so the check
        # does not need `npm run build:site`.
        self.assets = self.temp / "assets"
        self.assets.mkdir()

    def run_preview(self, base):
        out = self.temp / "out"
        result = subprocess.run(
            [
                "node",
                str(PREVIEW_SCRIPT),
                "--base",
                base,
                "--out",
                str(out),
                "--assets",
                str(self.assets),
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        return out

    def test_base_root_output_equals_the_checked_in_site(self):
        out = self.run_preview("/")
        site_files = sorted(path.relative_to(SITE) for path in SITE.rglob("*") if path.is_file())
        out_files = sorted(
            path.relative_to(out)
            for path in out.rglob("*")
            if path.is_file() and path.relative_to(out).parts[0] != "assets"
        )
        self.assertEqual(site_files, out_files)
        for relative in site_files:
            self.assertTrue(
                filecmp.cmp(SITE / relative, out / relative, shallow=False),
                f"{relative} differs from site/",
            )
        self.assertTrue((out / "assets").is_dir())

    def test_subpath_base_rewrites_site_absolute_references(self):
        base = "/decent-tech-site/site-preview/"
        out = self.run_preview(base)
        home = (out / "index.html").read_text()
        self.assertIn(f'href="{base}styles.css"', home)
        self.assertIn(f'src="{base}assets/site.js"', home)
        self.assertIn(f'href="{base}about/"', home)
        self.assertIn(f'content="{base}og.png"', home)
        self.assertNotRegex(home, r'(href|src)="/(?!decent-tech-site/)')
        self.assertNotRegex(home, r'(href|src|content)="https://decent\.tech/')
        # The JSON-LD describes the organisation, not the preview; it keeps
        # the production origin.
        self.assertIn('"url":"https://decent.tech"', home)
        about = (out / "about" / "index.html").read_text()
        self.assertIn(f'<link rel="canonical" href="{base}about/">', about)
        self.assertIn('href="#main-content"', about)
        self.assertIn("mailto:", (out / "contact" / "index.html").read_text())
        sitemap = (out / "sitemap.xml").read_text()
        self.assertIn(f"<loc>{base}</loc>", sitemap)
        self.assertIn(f"<loc>{base}about/</loc>", sitemap)
        self.assertNotIn("https://decent.tech/", sitemap)


if __name__ == "__main__":
    unittest.main()
