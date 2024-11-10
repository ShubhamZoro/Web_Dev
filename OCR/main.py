import os
from flask import Flask, request, jsonify, render_template
from google.cloud import vision
from datetime import datetime
import re
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy



# Initialize Flask app
app = Flask(__name__)


os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'vision.json'

# Compile regex patterns
DATE_PATTERN = re.compile(r'(\d{2}[/-]\d{2}[/-]\d{4})')
DL_PATTERN = re.compile(r'^(?:[A-Z]{2}\d{2}|[A-Z0-9]{4}) \d{11}$')


# Function to perform OCR using Google Vision API
# Initialize the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # SQLite database
db = SQLAlchemy(app)
cors=CORS(app,origins='*')
class LicenseData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    birth_date = db.Column(db.String(10))
    issue_date = db.Column(db.String(10))
    validity_date = db.Column(db.String(10))
    dl_number = db.Column(db.String(20))

    def __repr__(self):
        return f'<LicenseData {self.name}>'
def detect_text(path):
    client = vision.ImageAnnotatorClient()

    with open(path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # for non-dense text
    # response = client.text_detection(image=image)
    # for dense text
    response = client.document_text_detection(image=image)
    texts = response.text_annotations
    ocr_text = []

    for text in texts:
        ocr_text.append(f"\r\n{text.description}")

    print(ocr_text[0])
    return ocr_text[0].split('\n')


# Extract dates from OCR text
def extract_dates(data):
    found_dates = {match for item in data for match in DATE_PATTERN.findall(item)}
    date_objects = [
        datetime.strptime(date, '%d/%m/%Y') if '/' in date else datetime.strptime(date, '%d-%m-%Y')
        for date in found_dates
    ]
    date_objects.sort()
    return {
        "Validity Date": date_objects[-1].strftime('%d/%m/%Y') if len(date_objects) >= 1 else None,
        "Issue Date": date_objects[-2].strftime('%d/%m/%Y') if len(date_objects) >= 2 else None,
        "Birth Date": date_objects[-3].strftime('%d/%m/%Y') if len(date_objects) >= 3 else None,
    }


# Extract name from OCR text
# Extract name from OCR text
def extract_names(data):
    license_info = {}  # Initialize the dictionary to store names

    for i, item in enumerate(data):
        # Check for 'Name' or 'नाम' in the current item
        if 'Name' in item or 'नाम' in item:
            # Attempt to split and extract the name
            Name = item.split('Name')[1].strip() if 'Name' in item else item.split('नाम')[1].strip()

            if len(Name) > 0:
                # Only assign if Name is valid
                license_info['Name'] = Name
            else:
                # If Name is empty, check the next item
                if i + 1 < len(data):
                    next_name = data[i + 1].strip()
                    if len(next_name) > 0:  # Ensure the next name is also valid
                        license_info['Name'] = next_name
                    else:
                        license_info['Name'] = None
                else:
                    license_info['Name'] = None
    print(license_info)
    return license_info['Name']

# The rest of your code remains unchanged...


# Extract license number from OCR text
def extract_dl(data):
    for item in data:
        if DL_PATTERN.match(item.strip()):
            return item.strip()
    return None


# Route to render the front-end page
@app.route('/')
def index():
    return render_template('index.html')


# Route to handle image upload and information extraction
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    # Perform OCR and extract data
    ocr_text = detect_text(file_path)
    dates = extract_dates(ocr_text)
    name = extract_names(ocr_text)
    dl_number = extract_dl(ocr_text)

    return jsonify({
        "Validity Date": dates["Validity Date"],
        "Issue Date": dates["Issue Date"],
        "Birth Date": dates["Birth Date"],
        "Name": name,
        "DL Number": dl_number
    })

@app.route('/save', methods=['POST'])
def save_data():
    data = request.json
    new_license_data = LicenseData(
        name=data.get('name'),
        birth_date=data.get('birthDate'),
        issue_date=data.get('issueDate'),
        validity_date=data.get('validityDate'),
        dl_number=data.get('dlNumber')
    )

    db.session.add(new_license_data)
    db.session.commit()

    return jsonify({"message": "Data saved successfully!"}), 201

if __name__ == '__main__':
    with app.app_context():  # Create an application context
        db.create_all()
    app.run(debug=True)
