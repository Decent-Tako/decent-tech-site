from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.links = []
        self.text = []
        self.html_lang = None
        self.meta_names = set()

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        self.tags.append(tag)
        if tag == "html":
            self.html_lang = attributes.get("lang")
        if tag == "a":
            self.links.append(attributes.get("href", ""))
        if tag == "meta" and attributes.get("name"):
            self.meta_names.add(attributes["name"])

    def handle_data(self, data):
        self.text.append(data)


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "site" / "index.html").read_text()
        cls.css = (ROOT / "site" / "styles.css").read_text()
        cls.parser = SiteParser()
        cls.parser.feed(cls.html)
        cls.page_text = " ".join(cls.parser.text)

    def test_company_identity_and_services_are_present(self):
        self.assertIn("Decent Technology Group", self.page_text)
        for service in ("Technology strategy", "Software delivery", "Infrastructure and operations"):
            self.assertIn(service, self.page_text)

    def test_inquiry_path_uses_company_email(self):
        self.assertIn("mailto:hello@decent.tech", self.parser.links)
        self.assertIn("hello@decent.tech", self.page_text)

    def test_page_uses_semantic_landmarks(self):
        for tag in ("header", "nav", "main", "section", "footer"):
            self.assertIn(tag, self.parser.tags)

    def test_accessibility_basics_are_present(self):
        self.assertEqual(self.parser.html_lang, "en")
        self.assertIn("viewport", self.parser.meta_names)
        self.assertIn(":focus-visible", self.css)
        self.assertIn("prefers-reduced-motion", self.css)

    def test_container_is_unprivileged_and_has_healthcheck(self):
        dockerfile = (ROOT / "Dockerfile").read_text()
        self.assertIn("nginx-unprivileged", dockerfile)
        self.assertIn("USER 101", dockerfile)
        self.assertIn("EXPOSE 8080", dockerfile)
        self.assertIn("HEALTHCHECK", dockerfile)


if __name__ == "__main__":
    unittest.main()
