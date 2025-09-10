import unittest
import json
from app import app

class ContactFormTest(unittest.TestCase):

    def setUp(self):
        """Set up a test client for the app."""
        self.app = app.test_client()
        self.app.testing = True

    def test_contact_form_success(self):
        """Test the contact form with valid data."""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Inc.",
            "phone": "1234567890",
            "message": "This is a test message."
        }
        response = self.app.post('/api/contact',
                                 data=json.dumps(payload),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], "Nachricht erfolgreich erhalten!")

    def test_contact_form_missing_fields(self):
        """Test the contact form with missing required fields."""
        payload = {
            "name": "Test User",
            "email": "test@example.com"
            # Missing 'message'
        }
        response = self.app.post('/api/contact',
                                 data=json.dumps(payload),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.data)
        self.assertIn("Pflichtfelder", response_data['message'])

    def test_contact_form_not_json(self):
        """Test sending data that is not JSON."""
        response = self.app.post('/api/contact',
                                 data="this is not json",
                                 content_type='text/plain')

        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.data)
        self.assertEqual(response_data['message'], "Fehler: Anfrage muss JSON sein")

if __name__ == '__main__':
    unittest.main()
