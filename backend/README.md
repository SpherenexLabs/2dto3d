# 2D to 3D Room Converter - Backend

Python Flask backend for the 2D to 3D room conversion application.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python app.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### GET /api/health
Health check endpoint

### GET /api/templates
Get all available 3D templates

### POST /api/upload
Upload 2D image and get matched 3D template
- Body: FormData with 'file' field
- Returns: Template configuration

### GET /api/template/<template_id>
Get specific template configuration

### GET /api/inventory
Get available furniture inventory

### POST /api/scene/save
Save user-edited scene configuration

### GET /api/scene/<scene_id>
Retrieve saved scene

### GET /api/scenes
List all saved scenes

## Templates

The backend includes 10 predefined room templates:
1. Modern Living Room
2. Classic Living Room
3. Minimal Bedroom
4. Dining Room
5. Modern Office
6. Modern Kitchen
7. Outdoor Patio
8. Kids Room
9. Luxury Bathroom
10. Studio Apartment
