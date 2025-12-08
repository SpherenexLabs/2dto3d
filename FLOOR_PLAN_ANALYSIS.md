# 2D to 3D Floor Plan Converter - Rule-Based System

## Overview
This project converts 2D floor plan images into interactive 3D scenes using a rule-based approach.

## How It Works

### Rule-Based Analysis Pipeline

1. **Image Processing**
   - Upload a 2D floor plan image (PNG, JPG, JPEG, SVG)
   - Image is analyzed using OpenCV computer vision

2. **Wall Detection**
   - Uses Canny edge detection to find edges
   - Hough Line Transform detects straight lines
   - Filters lines by length to identify significant walls
   - Converts 2D coordinates to 3D world space

3. **Room Detection**
   - Binary thresholding segments the image
   - Contour detection finds enclosed spaces
   - Calculates room dimensions and areas
   - Classifies rooms by size:
     - < 8 m² → Bathroom
     - 8-12 m² → Bedroom
     - 12-20 m² → Living Room
     - > 20 m² → Large Living Room
     - 15-20 m² → Kitchen

4. **Furniture Placement**
   - **Living Room**: Sofa (back wall), coffee table (center), chairs (sides), pendant light
   - **Bedroom**: Bed (centered), nightstands (both sides), ceiling light
   - **Kitchen**: Dining table (center), chairs (around table), pendant light
   - **Bathroom**: Minimal furniture, ceiling light

5. **3D Scene Generation**
   - Creates walls with 2.8m height and 0.2m thickness
   - Adds floors with appropriate materials
   - Places furniture based on room dimensions
   - Generates proper 3D coordinates and rotations

## API Endpoints

### Upload Floor Plan
```bash
POST http://localhost:5000/api/upload
Content-Type: multipart/form-data

Parameters:
- file: floor plan image
- use_analysis: "true" (rule-based) or "false" (template matching)
```

**Response (Rule-Based)**:
```json
{
  "success": true,
  "uploaded_file": "timestamp_filename.png",
  "analysis_type": "rule_based",
  "scene": {
    "walls": [...],
    "floors": [...],
    "rooms": [...],
    "furniture": [...]
  }
}
```

### Get Available Templates
```bash
GET http://localhost:5000/api/templates
```

### Get Furniture Inventory
```bash
GET http://localhost:5000/api/inventory
```

### Save Custom Scene
```bash
POST http://localhost:5000/api/scene/save
Content-Type: application/json

{
  "template_id": "custom",
  "objects": {...},
  "camera": {...}
}
```

## Running the Project

### Frontend (React + Three.js)
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend (Flask + OpenCV)
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs at http://localhost:5000
```

## Features

✅ **Automatic wall detection** from floor plans
✅ **Room classification** by size
✅ **Smart furniture placement** based on room type
✅ **3D coordinate conversion** from 2D images
✅ **Interactive 3D viewer** with drag-and-drop
✅ **Furniture replacement** from inventory
✅ **Scene saving and sharing**
✅ **Template fallback** if analysis fails

## Future Enhancements

- Door and window detection
- Text/label recognition for room names
- Multiple floor support
- Advanced furniture arrangements
- Material detection (wood, tile, carpet)
- Lighting optimization based on windows
- Cost estimation
- AR preview capability

## Technologies

- **Frontend**: React, Three.js, React Three Fiber, React Three Drei
- **Backend**: Flask, OpenCV, NumPy, Pillow
- **3D**: GLB/GLTF models, Three.js scene graph
- **Analysis**: Computer vision, edge detection, contour analysis

## Supported Image Types

- Floor plan drawings (PNG, JPG, JPEG)
- Architectural blueprints
- Hand-drawn sketches
- SVG vector plans

## Tips for Best Results

1. Use high-contrast floor plans (dark walls, light rooms)
2. Clear wall boundaries work best
3. Include room labels in filename (e.g., "living_room_plan.png")
4. Avoid overly complex or detailed plans
5. Simple rectangular/square rooms give better results
