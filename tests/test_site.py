from html.parser import HTMLParser
from pathlib import Path
import filecmp
import json
import math
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

# The wordmark phrase and the disc label of each page, as Ben wrote them on
# 2026-09-10. design-system/src/site/pages.ts is the one source; these values
# keep the markup and the SVG textures equal to it.
PHRASES = {
    "about": ("Hey, we're decent.", "hey."),
    "portfolio": ("decent. work", "work."),
    "blog": ("decent. read", "read."),
    "ben": ("decent. people", "people."),
    "contact": ("decent. contact", "contact."),
}

# The navy ink of every disc label. It passes 4.5:1 on all five disc colours.
LABEL_INK = "#182534"

# Every page is the inside of its dot: slug to field token, and the colour of
# the full stop of the wordmark on that field. The word itself is navy on
# every field; the full stop takes the contrasting brand colour.
FIELDS = {
    "about": ("gold", "#ffcb73"),
    "portfolio": ("vermilion", "#e34234"),
    "blog": ("terracotta", "#d97757"),
    "ben": ("steel", "#5b8fa3"),
    "contact": ("cream", "#f2f1e8"),
}

# The navy ink of the wordmark word and the running head on every field.
FIELD_INK = "#182534"

# The wordmark word and the running head are display type, so the WCAG
# large-text threshold applies: 3:1, for text at least 24 pixels, or bold and
# at least 19 pixels. The running head is set at 1.5rem bold, 24 pixels, and
# 1.35rem bold on a phone, 21.6 pixels and over the 19 pixel bold floor.
LARGE_TEXT_CONTRAST = 3.0

# The small type of the right-hand list needs the full 4.5:1, so the list
# keeps the navy scrim and the cream type it has on the home page.
SMALL_TEXT_CONTRAST = 4.5
LIST_SCRIM_INK = "#f2f1e8"
LIST_SCRIM = "#182534"


# The React Bits scene behind each page and the extra effects on it, in the
# order the markup mounts them, as site/README.md and
# design-system/src/site/scenes.ts list them. Portfolio and About Ben carry no
# effect: the cursor effects are off by Ben's request of 2026-09-10. They stay
# in the registry and in Storybook. Get in touch carries two: the shine on the
# email link, and the magnet that moves the contact form.
SCENES = {
    "about": ("liquid-ether", ("split-text",)),
    "portfolio": ("galaxy", ()),
    "blog": ("threads", ("scrambled-text",)),
    "ben": ("iridescence", ()),
    "contact": ("plasma", ("shiny-text", "magnetic-form")),
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
    "magnetic-form",
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


def wordmark_markup(phrase):
    """The phrase as the markup writes it, with the full stop in its own span.

    Ben's rule: the full stop of `decent.` is always a contrasting colour, so
    every wordmark wraps it. The phrase holds exactly one full stop.
    """
    before, _, after = phrase.partition(".")
    return f'{before}<span class="wordmark-dot">.</span>{after}'


def css_rule(css, selector):
    """The body of the first rule with this exact selector, or None."""
    match = re.search(re.escape(selector) + r"\s*\{([^}]*)\}", css)
    return match.group(1) if match else None


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


class ContactFormParser(HTMLParser):
    """Reads the forms, the fields, the labels, and the buttons of a page."""

    def __init__(self):
        super().__init__()
        self.forms = []
        self.controls = []
        self.buttons = []
        self.label_targets = []
        self._button_text = None

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "form":
            self.forms.append(attributes)
        if tag in ("input", "textarea"):
            self.controls.append({"tag": tag, **attributes})
        if tag == "label" and "for" in attributes:
            self.label_targets.append(attributes["for"])
        if tag == "button":
            self.buttons.append({"type": attributes.get("type", "submit"), "text": ""})
            self._button_text = []

    def handle_data(self, data):
        if self._button_text is not None:
            self._button_text.append(data)

    def handle_endtag(self, tag):
        if tag == "button" and self._button_text is not None:
            self.buttons[-1]["text"] = "".join(self._button_text)
            self._button_text = None


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
        # The full stop of the wordmark sits in its own span, so the markup
        # carries `decent.` as two nodes. A reader still reads one word.
        self.assertIn(wordmark_markup("decent."), self.html)

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
        # Ben, 2026-09-10: no header band and no footer on any page. Every
        # page is the inside of its dot, so the wordmark and the list of pages
        # overlay the field as they do on the home page. `main`, `nav`, and
        # `section` stay.
        for slug, _, path, _ in PAGES:
            tags = parse(SITE / slug / "index.html").tags
            for tag in ("nav", "main", "section"):
                self.assertIn(tag, tags, f"{path} lacks a {tag} landmark")
            for tag in ("header", "footer"):
                self.assertNotIn(tag, tags, f"{path} still has a {tag} landmark")

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
            # One filled rect, the disc colour. The label text carries the
            # navy ink and is checked by its own test below.
            fills = re.findall(r'<rect[^>]*\sfill="(#[0-9a-fA-F]{6})"', text)
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

    def test_contact_page_holds_one_magnetic_mailto_form(self):
        html = (SITE / "contact" / "index.html").read_text()
        form = ContactFormParser()
        form.feed(html)

        self.assertEqual(len(form.forms), 1, "/contact/ must hold exactly one form")
        attributes = form.forms[0]
        self.assertEqual(attributes.get("method"), "post")
        self.assertEqual(attributes.get("action"), "mailto:hello@decent.tech")
        self.assertEqual(attributes.get("enctype"), "text/plain")

        # The three fields, each with the name the mail body carries.
        self.assertEqual(
            [(control["tag"], control.get("name")) for control in form.controls],
            [("input", "name"), ("input", "email"), ("textarea", "message")],
        )
        for control in form.controls:
            self.assertIn("required", control, f"the {control['name']} field must be required")
            self.assertIn("autocomplete", control, f"the {control['name']} field needs autocomplete")

        # One submit button, labelled Send.
        self.assertEqual(len(form.buttons), 1, "/contact/ must hold exactly one button")
        self.assertEqual(form.buttons[0]["type"], "submit")
        self.assertEqual(form.buttons[0]["text"].strip(), "Send")

        # Every label is bound to its field by for, and every field has an id.
        field_ids = {control["id"] for control in form.controls}
        self.assertEqual(len(field_ids), 3, "every field needs its own id")
        self.assertEqual(set(form.label_targets), field_ids, "labels must bind by for")

        # No inline handler anywhere in the form block. The scene does the
        # motion; the form works with no script at all.
        self.assertNotRegex(html, r"\son[a-z]+=", "/contact/ has an inline handler")

        # The magnet host names the wrapper it moves and holds no content.
        self.assertIn('data-effect="magnetic-form" data-target=".contact-form"', html)

    def test_magnetic_form_scene_holds_still_for_every_reason(self):
        scene = (
            DESIGN_SYSTEM / "src" / "site" / "scenes" / "MagneticFormScene.tsx"
        ).read_text()
        # The six reasons the form must hold still, and the transform-only rule.
        for token in (
            "prefers-reduced-motion: reduce",
            "HOLD_MARGIN_PX = 24",
            "NARROW_VIEWPORT_PX = 720",
            "TRAVEL_FRACTION = 0.4",
            "FOLLOW_PER_FRAME = 0.08",
            "RETURN_MS = 300",
            "pointerType !== 'mouse'",
            "translate3d(",
        ):
            self.assertIn(token, scene, f"MagneticFormScene.tsx lacks {token}")
        # It never moves the focus and never changes the layout.
        self.assertNotIn(".focus()", scene)
        self.assertNotRegex(scene, r"style\.(top|left|width|height|margin|position)\b")

    def test_contact_form_styles_stay_under_the_contact_form_prefix(self):
        rules = re.findall(r"^\.contact-form[^{]*\{", self.css, flags=re.MULTILINE)
        self.assertGreater(len(rules), 5, "the contact form has no styles")
        # Navy type on a cream card passes AA.
        self.assertGreaterEqual(contrast_ratio("#182534", "#f2f1e8"), 4.5)

    def test_each_page_mounts_one_named_scene(self):
        for slug, _, path, _ in PAGES:
            parser = parse(SITE / slug / "index.html")
            scene, effects = SCENES[slug]
            self.assertEqual(parser.scenes, [scene], f"{path} must hold exactly one data-scene")
            self.assertIn(scene, SCENE_NAMES, f"{path} scene {scene} is not in the registry")
            self.assertEqual(parser.effects, list(effects), f"{path} data-effect")
            for effect in effects:
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
        # The stage fills the viewport; the wordmark and the list of pages sit
        # over it; there is no header band, no hero, and no footer.
        self.assertIn('<body class="home">', self.html)
        self.assertIn('class="site-header"', self.html)
        self.assertIn('class="wordmark"', self.html)
        self.assertNotIn("<footer", self.html)
        self.assertIn(".home main {", self.css)
        self.assertRegex(self.css, r"\.home main \{[^}]*min-height: 100svh")
        self.assertRegex(self.css, r"\.home \.site-header \{[^}]*position: absolute")
        self.assertRegex(self.css, r"\.menu-stage \{[^}]*min-height: 100svh")
        self.assertRegex(self.css, r"\.menu-list \{[^}]*position: absolute")
        # The list sits on the right, vertically centred, not at the bottom.
        self.assertRegex(self.css, r"\.menu-list \{[^}]*right: 0")
        self.assertRegex(self.css, r"\.menu-list \{[^}]*top: 50%")
        self.assertEqual(len(self.parser.menu_list_links), len(PAGES))

    def test_home_page_holds_one_wordmark_link_and_no_pill_or_bottom_row(self):
        # The wordmark is the only text on the sphere: one link, the phrase of
        # the dot the sphere starts on. The overlay pill and the bottom link
        # row are gone, in the markup and in the styles.
        self.assertEqual(self.html.count('class="wordmark"'), 1)
        self.assertIn('<span class="wordmark-phrase">', self.html)
        self.assertIn(wordmark_markup(PHRASES["about"][0]), self.html)
        self.assertNotIn("menu-overlay", self.html)
        menu_css = (DESIGN_SYSTEM / "src" / "site" / "menu.css").read_text()
        self.assertNotIn("menu-overlay", menu_css)
        self.assertNotIn("--menu-overlay-bottom", self.css)
        # The home wordmark is large and drops the company line.
        self.assertRegex(
            self.css, r"\.home \.wordmark \{[^}]*font-size: clamp\(2\.4rem, 6vw, 5\.5rem\)"
        )
        self.assertRegex(self.css, r"\.home \.wordmark-company \{[^}]*display: none")

    def test_home_page_list_holds_the_five_phrases(self):
        # The list on the right is the keyboard path and the no-WebGL path, so
        # every page is a real link and every entry reads its phrase.
        self.assertEqual(self.parser.menu_list_links, [path for _, _, path, _ in PAGES])
        for slug, _, _, _ in PAGES:
            phrase = PHRASES[slug][0]
            self.assertIn(
                wordmark_markup(phrase),
                self.html,
                f"the list lacks the phrase {phrase!r} with its coloured full stop",
            )
        # The sphere starts on the gold About dot, so About is the active one.
        self.assertEqual(self.parser.current_page_links, ["/about/"])

    def test_pages_ts_carries_every_phrase_and_label(self):
        source = (DESIGN_SYSTEM / "src" / "site" / "pages.ts").read_text()
        # Every phrase and every label, whatever quote the file uses.
        found_phrases = re.findall(r"phrase: ['\"](.+?)['\"],", source)
        found_labels = re.findall(r"label: ['\"](.+?)['\"],", source)
        self.assertEqual(found_phrases, [PHRASES[slug][0] for slug, _, _, _ in PAGES])
        self.assertEqual(found_labels, [PHRASES[slug][1] for slug, _, _, _ in PAGES])

    def test_each_disc_texture_holds_its_label(self):
        for slug, _, _, _ in PAGES:
            label = PHRASES[slug][1]
            text = (SITE / "menu" / f"{slug}.svg").read_text()
            elements = re.findall(r"<text\b[^>]*>(.*?)</text>", text, re.S)
            self.assertEqual(len(elements), 1, f"{slug}.svg must hold one text element")
            self.assertEqual(elements[0], label, f"{slug}.svg label differs from {label!r}")
            # Navy ink, the serif stack, centred on the disc.
            self.assertRegex(text, rf'<text[^>]*\sfill="{LABEL_INK}"')
            self.assertRegex(text, r'<text[^>]*font-family="Iowan Old Style,')
            self.assertRegex(text, r'<text[^>]*text-anchor="middle"')
            self.assertRegex(text, r'<text[^>]*dominant-baseline="central"')
            # The navy ink must read on the disc colour. The label is 22
            # percent of a 256 pixel texture and the discs draw far larger
            # than 24 pixels on screen, so the AA threshold is the large-text
            # one, 3:1. Navy on vermilion is 3.77:1 and navy on steel blue is
            # 4.36:1; both clear 3:1 but not 4.5:1.
            root = re.search(r":root\s*\{([^}]+)\}", self.css)
            token = dict((slug_, token_) for slug_, _, _, token_ in PAGES)[slug]
            disc = css_variables(root.group(1))[f"dot-{token}"]
            self.assertGreaterEqual(
                contrast_ratio(LABEL_INK, disc),
                3.0,
                f"the {slug} label fails large-text AA on the disc colour",
            )

    def test_the_sphere_bleeds_off_the_screen(self):
        # The projected sphere diameter over the shorter viewport side is
        # about 2.857 / scale with local change 10. A ratio above 1 keeps the
        # sphere cut by the screen edges at every size.
        menu = (DESIGN_SYSTEM / "src" / "site" / "SiteMenu.tsx").read_text()
        ratio = re.search(r"const BLEED_RATIO = ([0-9.]+);", menu)
        self.assertIsNotNone(ratio, "SiteMenu.tsx must set BLEED_RATIO")
        self.assertGreaterEqual(float(ratio.group(1)), 1.3)
        self.assertLessEqual(float(ratio.group(1)), 1.4)
        self.assertIn("setScale(scaleForViewport())", menu)

    def test_a_wheel_step_walks_the_pages_in_order(self):
        # Ben asked for the wheel to move through the five pages in the order
        # of SITE_PAGES, wrapping at the ends. The vendored step() walks the
        # vertex order of the sphere, which is arbitrary, so the site turns to
        # the next page by index instead.
        menu = (DESIGN_SYSTEM / "src" / "site" / "SiteMenu.tsx").read_text()
        self.assertIn("const from = SITE_PAGES.indexOf(activeRef.current);", menu)
        self.assertIn("const next = (((from + direction) % count) + count) % count;", menu)
        self.assertIn("menuRef.current?.turnToItem(next);", menu)
        self.assertNotIn("menuRef.current?.step(", menu)
        # The throttle and the step counter stay.
        self.assertIn("STEP_THROTTLE_MS", menu)
        self.assertIn("'data-steps'", menu)

    def test_one_trackpad_gesture_is_one_step(self):
        # Ben said on 2026-09-10 that the wheel motion was too intense. Events
        # inside the throttle window are one step, and the small events at the
        # tail of a trackpad gesture are ignored, so one gesture is one disc.
        menu = (DESIGN_SYSTEM / "src" / "site" / "SiteMenu.tsx").read_text()
        throttle = re.search(r"const STEP_THROTTLE_MS = ([0-9]+);", menu)
        self.assertIsNotNone(throttle, "SiteMenu.tsx must set STEP_THROTTLE_MS")
        self.assertEqual(int(throttle.group(1)), 250)
        floor = re.search(r"const WHEEL_DELTA_FLOOR = ([0-9]+);", menu)
        self.assertIsNotNone(floor, "SiteMenu.tsx must set WHEEL_DELTA_FLOOR")
        self.assertEqual(int(floor.group(1)), 4)
        self.assertIn("if (Math.abs(event.deltaY) < WHEEL_DELTA_FLOOR) return;", menu)
        # The page must still not scroll or bounce, whatever the event does.
        self.assertRegex(menu, r"const onWheel[^}]*event\.preventDefault\(\);")
        # The step counter stays, so the Chromium check can still tell a wheel
        # that never arrived from a sphere that did not move.
        self.assertIn("'data-steps'", menu)

    def test_the_turn_glides_instead_of_snapping(self):
        # Ben asked for a gentler arrival. While a turn target is held, the
        # snap covers a constant fraction of the angle that is left, which is
        # an ease-out that cannot overshoot.
        vendored = (
            DESIGN_SYSTEM / "src" / "motion-examples" / "vendor" / "react-bits" / "infinite-menu" / "InfiniteMenu.tsx"
        ).read_text()
        self.assertIn("public gentleSnap = false;", vendored)
        glide = re.search(r"const GLIDE_INTENSITY = ([0-9.]+);", vendored)
        self.assertIsNotNone(glide, "InfiniteMenu.tsx must set GLIDE_INTENSITY")
        fraction = float(glide.group(1))
        # A constant fraction per frame reaches 99 per cent in this many
        # frames. At 60 Hz the issue asks for about 600 ms.
        frames = math.log(0.01) / math.log(1 - fraction)
        self.assertGreaterEqual(frames * 1000 / 60, 500)
        self.assertLessEqual(frames * 1000 / 60, 700)
        # The glide runs for the whole turn, not only until the wanted vertex
        # becomes the nearest one.
        self.assertIn("this.control.gentleSnap = true;", vendored)
        self.assertIn("TURN_ARRIVED_SQR", vendored)
        # A drag and a reset drop the glide with the turn.
        self.assertEqual(vendored.count("this.control.gentleSnap = false;"), 3)

    def test_the_stage_markup_carries_no_inline_handlers(self):
        # The stage is driven from the bundle, never from the markup. An
        # inline handler would also be blocked by the Content Security Policy
        # in nginx.conf, which allows scripts from the site's own origin only.
        for page in SITE.rglob("*.html"):
            html = page.read_text()
            self.assertNotRegex(
                html,
                r"""\son[a-z]+\s*=\s*["']""",
                f"{page.relative_to(ROOT)} has an inline event handler",
            )

    def test_only_a_direct_disc_press_opens_a_page(self):
        # Ben asked on 2026-09-10 that a press open a page only when it lands
        # on the centred disc. Any other disc turns the sphere; empty stage
        # does nothing.
        menu = (DESIGN_SYSTEM / "src" / "site" / "SiteMenu.tsx").read_text()
        self.assertIn("vertexIndex === menu.getCentredVertex()", menu)
        self.assertIn("menu?.turnToVertex(vertexIndex);", menu)
        # Every outcome of a press is named on the stage.
        for what in ("open", "turn", "miss", "drag"):
            self.assertIn(f"markClick('{what}')", menu, f"the stage never reports {what!r}")
        self.assertIn("'data-last-click'", menu)
        self.assertIn("'data-hit-points'", menu)
        self.assertIn("'data-centred-vertex'", menu)
        # The cursor follows the same hit test, once a frame.
        self.assertIn("requestAnimationFrame(test)", menu)
        self.assertIn("overDisc", menu)
        css = (DESIGN_SYSTEM / "src" / "site" / "menu.css").read_text()
        self.assertRegex(css, r"\.menu-sphere \{[^}]*cursor: grab")
        self.assertRegex(css, r'\.menu-sphere\[data-over-disc="true"\] \{[^}]*cursor: pointer')

    def test_the_stage_recovers_from_a_left_over_circle(self):
        # The back-forward cache restores this page with its DOM as it was, so
        # the circle and the opening guard survived the back button and every
        # later press was ignored. The stage now clears itself.
        menu = (DESIGN_SYSTEM / "src" / "site" / "SiteMenu.tsx").read_text()
        self.assertIn("if (event.persisted) cancelOpen();", menu)
        self.assertIn("'pageshow'", menu)
        self.assertIn("'pagehide'", menu)
        self.assertIn("'visibilitychange'", menu)
        self.assertIn("NAVIGATION_GRACE_MS", menu)
        # Clearing must cancel the timer as well, or the page opens later.
        self.assertIn("window.clearTimeout(openTimerRef.current);", menu)

    def test_a_deliberate_press_is_not_thrown_away_as_a_drag(self):
        # The old rule threw away a press that lasted over 350 ms, which a
        # deliberate press on a small disc often does. The move limit is also
        # in canvas pixels now, so a scaled display gets the same tolerance.
        vendored = (
            DESIGN_SYSTEM / "src" / "motion-examples" / "vendor" / "react-bits" / "infinite-menu" / "InfiniteMenu.tsx"
        ).read_text()
        limit = re.search(r"private readonly CLICK_TIME_LIMIT = ([0-9]+);", vendored)
        self.assertIsNotNone(limit, "InfiniteMenu.tsx must set CLICK_TIME_LIMIT")
        self.assertEqual(int(limit.group(1)), 500)
        self.assertIn("window.devicePixelRatio", vendored)
        self.assertIn("this.CLICK_MOVE_LIMIT * dpr", vendored)

    def test_a_press_that_leaves_the_canvas_is_not_left_behind(self):
        # The third cause of a press that did nothing. Upstream the pointerup
        # of a press that wandered off the canvas went elsewhere, so the down
        # was left set and the next press paired with it: an elapsed time of
        # seconds that the drag rule threw away. The canvas now captures the
        # pointer, and a press that ends outside is cleared.
        vendored = (
            DESIGN_SYSTEM / "src" / "motion-examples" / "vendor" / "react-bits" / "infinite-menu" / "InfiniteMenu.tsx"
        ).read_text()
        self.assertIn("this.canvas.setPointerCapture?.(e.pointerId);", vendored)
        self.assertIn("this.canvas.releasePointerCapture(e.pointerId);", vendored)
        # With capture, pointerleave no longer ends a drag, so the arcball
        # needs pointercancel or a drag stays down for ever. The four places
        # that end a press are pointerup, pointerleave, pointercancel, and
        # reset().
        self.assertEqual(vendored.count("this.isPointerDown = false;"), 4)
        self.assertRegex(
            vendored,
            r"canvas\.addEventListener\('pointercancel', \(\) => \{\s*this\.isPointerDown = false;",
        )

    def test_the_vendored_menu_carries_local_change_16(self):
        vendored = (
            DESIGN_SYSTEM / "src" / "motion-examples" / "vendor" / "react-bits" / "infinite-menu" / "InfiniteMenu.tsx"
        ).read_text()
        self.assertIn("16. The click became a hit test.", vendored)
        self.assertIn("public hitTestVertex(x: number, y: number): number", vendored)
        self.assertIn("public turnToVertex(vertexIndex: number): void", vendored)
        self.assertIn("public getHitPoints(): HitPoint[]", vendored)
        self.assertIn("public getCentredVertex(): number", vendored)
        # animate() moves each disc a sphere radius along its own axis, so the
        # discs the camera sees are the ones whose world z is negative. That
        # is also why snapDirection is (0, 0, -1): the vertex at the centre of
        # the view is the one most aligned with it, and it must be one of the
        # discs the hit test can reach.
        self.assertIn("if (world[2] >= 0) continue;", vendored)
        self.assertIn("if (this.getVertexWorldPosition(i)[2] >= 0) continue;", vendored)
        self.assertIn("public snapDirection = vec3.fromValues(0, 0, -1);", vendored)

    def test_the_vendored_menu_carries_local_changes_14_and_15(self):
        vendored = (
            DESIGN_SYSTEM / "src" / "motion-examples" / "vendor" / "react-bits" / "infinite-menu" / "InfiniteMenu.tsx"
        ).read_text()
        self.assertIn("14. `InfiniteGridMenu` got `turnToItem(itemIndex)`", vendored)
        self.assertIn("15. `InfiniteGridMenu` got `setScale(scale)`", vendored)
        self.assertIn("public turnToItem(itemIndex: number): void", vendored)
        self.assertIn("public setScale(scale: number): void", vendored)

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
        for slug, (scene, effects) in SCENES.items():
            self.assertIn(scene, SCENE_NAMES, slug)
            for effect in effects:
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

    def test_every_page_paints_in_the_colour_of_its_dot(self):
        # The field colour sits on <html> as a class, so the page paints in
        # the dot colour before any script or scene loads. That first paint is
        # what the cross-document view transition lands on.
        root = re.search(r":root\s*\{([^}]+)\}", self.css)
        tokens = css_variables(root.group(1))
        for slug, _, path, token in PAGES:
            field_token, field_hex = FIELDS[slug]
            self.assertEqual(field_token, token, f"{path} field token")
            html = (SITE / slug / "index.html").read_text()
            self.assertIn(
                f'<html lang="en" class="field--{field_token}">',
                html,
                f"{path} does not carry its field class on <html>",
            )
            # The field class and the dot token hold the same colour.
            body = css_rule(self.css, f".field--{field_token}")
            self.assertIsNotNone(body, f"styles.css lacks .field--{field_token}")
            self.assertIn(f"var(--dot-{field_token})", body)
            self.assertEqual(
                tokens[f"dot-{field_token}"].lower(),
                field_hex.lower(),
                f"--dot-{field_token} differs from the field of {path}",
            )
            # The theme colour of the page follows the field, one value in
            # both colour schemes.
            self.assertIn(
                f'<meta name="theme-color" content="{field_hex}">',
                html,
                f"{path} theme colour does not follow its field",
            )
            # The body must not paint over the field. `body` carries the paper
            # colour for the rest of the site, so every field page clears it;
            # otherwise the flat dot colour would never be seen and the view
            # transition would land on the paper colour instead.
            self.assertRegex(
                self.css,
                rf"\.field--{field_token} > body[^{{]*\{{[^}}]*background: transparent",
                f"the body paints over the {field_token} field",
            )

    def test_the_stylesheet_opts_into_cross_document_view_transitions(self):
        # The circle on the home page and the field of the page it opens carry
        # the same view-transition-name, so the circle morphs into the field.
        self.assertRegex(self.css, r"@view-transition\s*\{\s*navigation: auto;")
        self.assertRegex(self.css, r"\.scene \{[^}]*view-transition-name: field")
        self.assertRegex(
            self.css, r"\.home \.site-header \{[^}]*view-transition-name: wordmark"
        )
        self.assertRegex(
            self.css, r"\.page-wordmark \{[^}]*view-transition-name: wordmark"
        )
        self.assertRegex(self.css, r"\.home \.menu-list \{[^}]*view-transition-name: pages")
        self.assertRegex(self.css, r"\.page \.menu-list \{[^}]*view-transition-name: pages")
        # The home circle is the other end of the shared element.
        menu_css = (DESIGN_SYSTEM / "src" / "site" / "menu.css").read_text()
        self.assertRegex(menu_css, r"\.menu-expand \{[^}]*view-transition-name: field")
        # About 500 ms with an ease-out, and zero under reduced motion.
        self.assertIn("animation-duration: 500ms", self.css)
        self.assertIn("animation-timing-function: ease-out", self.css)
        reduced = re.search(
            r"@media \(prefers-reduced-motion: reduce\)\s*\{(.+)\n\}", self.css, re.S
        )
        self.assertIsNotNone(reduced)
        self.assertIn("animation-duration: 0s", reduced.group(1))
        # The site runs the circle or the shared element, never both. The
        # bundle picks by feature detection.
        menu = (DESIGN_SYSTEM / "src" / "site" / "SiteMenu.tsx").read_text()
        # The value, not the key. `'startViewTransition' in document` stays
        # true when the property is present but set to undefined, so the site
        # would take the shared-element path in a browser that cannot run it.
        self.assertIn(".startViewTransition === 'function'", menu)
        self.assertNotIn("'startViewTransition' in document", menu)
        self.assertIn("CSS.supports('view-transition-name: x')", menu)
        self.assertIn("if (reduceRef.current || supportsViewTransition()) {", menu)

    def test_the_scene_fades_in_from_the_flat_field(self):
        # Where the browser lacks cross-document view transitions, the page
        # still opens on its flat field colour and the scene fades in over it.
        self.assertRegex(self.css, r"\.scene > \* \{[^}]*opacity: 0")
        self.assertRegex(self.css, r"\.scene > \* \{[^}]*transition: opacity 400ms ease-out")
        self.assertRegex(self.css, r'\.scene\[data-webgl="ready"\] > \* \{[^}]*opacity: 1')

    def test_every_page_carries_the_wordmark_with_its_coloured_full_stop(self):
        for slug, _, path, _ in PAGES:
            html = (SITE / slug / "index.html").read_text()
            phrase = PHRASES[slug][0]
            self.assertIn('class="page-wordmark"', html, f"{path} lacks the wordmark")
            self.assertIn(
                f'<span class="wordmark-phrase">{wordmark_markup(phrase)}</span>',
                html,
                f"{path} wordmark does not read its phrase with a coloured full stop",
            )
            # One wordmark on the page, and it links home.
            self.assertEqual(html.count('class="wordmark"'), 1, f"{path} wordmark count")
        # The full stop takes its colour by rule, never inline.
        self.assertRegex(self.css, r"\.wordmark-dot \{[^}]*color: var\(--wordmark-dot")
        for slug, _, path, _ in PAGES:
            body = css_rule(self.css, f".page--{slug}")
            self.assertIsNotNone(body, f"styles.css lacks .page--{slug}")
            self.assertIn("--wordmark-dot:", body, f"{path} sets no full-stop colour")

    def test_the_wordmark_word_and_the_running_head_read_on_every_field(self):
        # Both are navy on the field at display size, so the WCAG large-text
        # threshold of 3:1 applies. Navy clears it on all five fields.
        for slug, _, path, _ in PAGES:
            _, field_hex = FIELDS[slug]
            self.assertGreaterEqual(
                contrast_ratio(FIELD_INK, field_hex),
                LARGE_TEXT_CONTRAST,
                f"the {path} wordmark and running head fail large-text AA on the field",
            )
        self.assertRegex(self.css, r"\.running-head \{[^}]*color: var\(--running-ink\)")
        self.assertRegex(self.css, r"\.page-wordmark \.wordmark \{[^}]*color: var\(--running-ink\)")
        self.assertRegex(self.css, r"\.page \{[^}]*--running-ink: var\(--brand-navy\)")
        # The running head must be large text: 1.5rem bold is 24 pixels, and
        # the phone size of 1.35rem bold is 21.6 pixels, over the 19 pixel
        # bold floor the threshold allows.
        head = css_rule(self.css, ".running-head")
        size = re.search(r"font-size:\s*([0-9.]+)rem", head)
        weight = re.search(r"font-weight:\s*([0-9]+)", head)
        self.assertIsNotNone(size, ".running-head must set a font size")
        self.assertIsNotNone(weight, ".running-head must set a font weight")
        self.assertGreaterEqual(int(weight.group(1)), 700)
        self.assertGreaterEqual(float(size.group(1)) * 16, 24)
        phone = re.search(
            r"@media \(max-width: 40rem\)\s*\{.*?\.running-head \{([^}]*)\}", self.css, re.S
        )
        self.assertIsNotNone(phone, "the phone breakpoint must size the running head")
        phone_size = re.search(r"font-size:\s*([0-9.]+)rem", phone.group(1))
        self.assertGreaterEqual(float(phone_size.group(1)) * 16, 19)

    def test_every_page_shows_its_disc_label_as_a_running_head(self):
        for slug, _, path, _ in PAGES:
            html = (SITE / slug / "index.html").read_text()
            label = PHRASES[slug][1]
            self.assertIn(
                f'<p class="running-head">{label}</p>',
                html,
                f"{path} lacks the running head {label!r}",
            )

    def test_every_page_carries_the_five_link_list_with_the_current_page_marked(self):
        # The list is the site navigation on every page. The visible five-link
        # markup stays in the HTML, so it works with no script.
        for slug, _, path, _ in PAGES:
            parser = parse(SITE / slug / "index.html")
            self.assertEqual(
                parser.menu_list_links,
                [other for _, _, other, _ in PAGES],
                f"{path} list does not hold the five pages in order",
            )
            self.assertEqual(parser.current_page_links, [path], f"{path} aria-current")
        # The small type of the list needs the full 4.5:1, so it keeps the
        # navy scrim and the cream type of the home page.
        self.assertGreaterEqual(
            contrast_ratio(LIST_SCRIM_INK, LIST_SCRIM), SMALL_TEXT_CONTRAST
        )
        self.assertRegex(self.css, r"\.page \.menu-list a \{[^}]*color: var\(--stage-ink\)")
        self.assertRegex(self.css, r"\.menu-list \{[^}]*background: rgba\(24, 37, 52, 0\.88\)")

    def test_plate_text_and_plate_pairs_keep_aa(self):
        # Four pages take the navy plate with cream type. Get in touch is read
        # as navy straight on the cream field, with no plate.
        page_block = css_rule(self.css, ".page")
        self.assertIn("--plate: var(--brand-navy)", page_block)
        self.assertIn("--plate-ink: var(--brand-cream)", page_block)
        contact = css_rule(self.css, ".page--contact")
        self.assertIn("--plate: none", contact)
        self.assertIn("--plate-ink: var(--brand-navy)", contact)
        root = re.search(r":root\s*\{([^}]+)\}", self.css)
        tokens = css_variables(root.group(1))
        pairs = (
            ("the navy plate", tokens["brand-cream"], tokens["brand-navy"]),
            ("the cream Contact field", tokens["brand-navy"], tokens["brand-cream"]),
            ("the navy plate accent", tokens["brand-gold"], tokens["brand-navy"]),
        )
        for label, ink, plate in pairs:
            self.assertGreaterEqual(
                contrast_ratio(ink, plate), 4.5, f"{label} fails AA"
            )
        # The muted and accent colours of both plate types keep AA too.
        for name, ink, plate in (
            ("navy plate muted", "#c9d1d8", tokens["brand-navy"]),
            ("Contact muted", "#3d4a57", tokens["brand-cream"]),
            ("Contact accent", "#8a4a1f", tokens["brand-cream"]),
        ):
            self.assertGreaterEqual(contrast_ratio(ink, plate), 4.5, f"{name} fails AA")

    def test_no_page_keeps_a_header_band_or_a_footer(self):
        # Ben, 2026-09-10: no header and no footer on any page for now.
        for slug, _, path, _ in PAGES:
            html = (SITE / slug / "index.html").read_text()
            self.assertNotIn("<header", html, f"{path} still has a header band")
            self.assertNotIn("<footer", html, f"{path} still has a footer")
        self.assertNotIn("--header-height", self.css)

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
