import unittest

from app.mailer import normalize_smtp_password


class MailerTests(unittest.TestCase):
    def test_normalize_smtp_password_removes_whitespace(self):
        self.assertEqual(normalize_smtp_password("xypr tbqg tgne logn"), "xyprtbqgtgnelogn")
        self.assertEqual(normalize_smtp_password("  abcd efgh ijkl mnop  "), "abcdefghijklmnop")


if __name__ == "__main__":
    unittest.main()
