from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app) # Enable CORS for all routes

# API endpoint for the contact form
@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    if not request.is_json:
        return jsonify({"message": "Fehler: Anfrage muss JSON sein"}), 400

    data = request.get_json()

    # Simple validation
    required_fields = ['name', 'email', 'message']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Fehler: Name, E-Mail und Nachricht sind Pflichtfelder."}), 400

    # For now, just print the data to the console
    print("Received contact form data:")
    print(f"  Name: {data.get('name')}")
    print(f"  Email: {data.get('email')}")
    print(f"  Company: {data.get('company', 'N/A')}")
    print(f"  Phone: {data.get('phone', 'N/A')}")
    print(f"  Message: {data.get('message')}")

    return jsonify({"message": "Nachricht erfolgreich erhalten!"}), 200

# Serve the main index.html file
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

# Serve other static files from the frontend directory (js, css, pages, etc.)
@app.route('/<path:path>')
def serve_static_files(path):
    # Construct the full path
    full_path = os.path.join('../frontend', path)

    # Check if the path is a directory, if so, try serving index.html from it
    # This is not typically needed for this project structure but is good practice.
    if os.path.isdir(full_path):
        return send_from_directory(full_path, 'index.html')

    return send_from_directory('../frontend', path)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
