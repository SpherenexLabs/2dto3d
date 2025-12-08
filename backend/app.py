from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime
from floor_plan_analyzer import analyze_floor_plan_image

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'svg'}
TEMPLATES_FOLDER = 'templates'
MODELS_FOLDER = 'models'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TEMPLATES_FOLDER, exist_ok=True)
os.makedirs(MODELS_FOLDER, exist_ok=True)

# Predefined 3D templates configuration with unique professional designs
TEMPLATES_CONFIG = {
    'living_room_modern': {
        'name': 'Modern Living Room',
        'model_path': '/models/living_room_modern.glb',
        'keywords': ['modern', 'living', 'contemporary'],
        'description': 'Contemporary L-shaped seating with accent chairs',
        'objects': {
            'sofa1': {'position': [-2, 0, -3], 'model': 'sofa_modern.glb'},
            'sofa2': {'position': [2, 0, -1], 'model': 'sofa_modern.glb'},
            'chair1': {'position': [-4, 0, 0], 'model': 'chair_modern.glb'},
            'chair2': {'position': [4, 0, 0], 'model': 'chair_modern.glb'},
            'table1': {'position': [0, 0, -1], 'model': 'table_coffee.glb'},
            'table2': {'position': [-4, 0, 2], 'model': 'table_side.glb'},
            'light1': {'position': [0, 2.8, 0], 'model': 'light_modern.glb'},
            'light2': {'position': [-3, 2.5, -2], 'model': 'light_floor.glb'},
            'rug': {'position': [0, 0.01, -1], 'model': 'rug_modern.glb'}
        }
    },
    'living_room_classic': {
        'name': 'Classic Living Room',
        'model_path': '/models/living_room_classic.glb',
        'keywords': ['classic', 'traditional', 'vintage'],
        'description': 'Symmetrical traditional layout with chandelier',
        'objects': {
            'sofa1': {'position': [-2, 0, -3], 'model': 'sofa_modern.glb'},
            'sofa2': {'position': [0, 0, -3.5], 'model': 'sofa_classic.glb'},
            'chair1': {'position': [-3.5, 0, -1], 'model': 'chair_classic.glb'},
            'chair2': {'position': [3.5, 0, -1], 'model': 'chair_classic.glb'},
            'chair3': {'position': [-3.5, 0, 1.5], 'model': 'chair_classic.glb'},
            'chair4': {'position': [3.5, 0, 1.5], 'model': 'chair_classic.glb'},
            'table1': {'position': [0, 0, 0], 'model': 'table_classic.glb'},
            'table2': {'position': [-3.5, 0, -2.5], 'model': 'table_side.glb'},
            'table3': {'position': [3.5, 0, -2.5], 'model': 'table_side.glb'},
            'light': {'position': [0, 3, 0], 'model': 'light_chandelier.glb'},
            'rug': {'position': [0, 0.01, 0], 'model': 'rug_persian.glb'}
        }
    },
    'bedroom_minimal': {
        'name': 'Minimal Bedroom',
        'model_path': '/models/bedroom_minimal.glb',
        'keywords': ['bedroom', 'minimal', 'sleep'],
        'description': 'Minimalist bedroom with centered bed and study nook',
        'objects': {
            'sofa': {'position': [0, 0, -3], 'model': 'bed_minimal.glb'},
            'table1': {'position': [-2.5, 0, -3], 'model': 'nightstand.glb'},
            'table2': {'position': [2.5, 0, -3], 'model': 'nightstand.glb'},
            'table3': {'position': [3, 0, 1.5], 'model': 'desk_minimal.glb'},
            'chair': {'position': [3, 0, 2.5], 'model': 'chair_minimal.glb'},
            'light1': {'position': [-2.5, 1.8, -3], 'model': 'light_table.glb'},
            'light2': {'position': [2.5, 1.8, -3], 'model': 'light_table.glb'},
            'light3': {'position': [0, 2.8, 0], 'model': 'light_minimal.glb'},
            'rug': {'position': [0, 0.01, 1], 'model': 'rug_minimal.glb'}
        }
    },
    'dining_room': {
        'name': 'Dining Room',
        'model_path': '/models/dining_room.glb',
        'keywords': ['dining', 'eat', 'table'],
        'description': 'Elegant 6-seater dining setup',
        'objects': {
            'table': {'position': [0, 0, 0], 'model': 'dining_table.glb'},
            'chair1': {'position': [-2, 0, 1.2], 'model': 'dining_chair.glb'},
            'chair2': {'position': [0, 0, 1.2], 'model': 'dining_chair.glb'},
            'chair3': {'position': [2, 0, 1.2], 'model': 'dining_chair.glb'},
            'chair4': {'position': [-2, 0, -1.2], 'model': 'dining_chair.glb'},
            'chair5': {'position': [0, 0, -1.2], 'model': 'dining_chair.glb'},
            'chair6': {'position': [2, 0, -1.2], 'model': 'dining_chair.glb'},
            'light': {'position': [0, 2.8, 0], 'model': 'light_dining.glb'},
            'rug': {'position': [0, 0.01, 0], 'model': 'rug_dining.glb'}
        }
    },
    'office_modern': {
        'name': 'Modern Office',
        'model_path': '/models/office_modern.glb',
        'keywords': ['office', 'work', 'desk'],
        'description': 'Executive office with meeting zone',
        'objects': {
            'table1': {'position': [0, 0, -2.5], 'model': 'desk_modern.glb'},
            'chair1': {'position': [0, 0, -1], 'model': 'office_chair.glb'},
            'table2': {'position': [-3, 0, 1.5], 'model': 'table_conference.glb'},
            'chair2': {'position': [-4, 0, 1.5], 'model': 'chair_modern.glb'},
            'chair3': {'position': [-2, 0, 1.5], 'model': 'chair_modern.glb'},
            'chair4': {'position': [-3, 0, 2.5], 'model': 'chair_modern.glb'},
            'sofa': {'position': [3, 0, 2], 'model': 'sofa_office.glb'},
            'light1': {'position': [0, 2.8, -2], 'model': 'light_office.glb'},
            'light2': {'position': [-3, 2.5, 1.5], 'model': 'light_office.glb'}
        }
    },
    'kitchen_modern': {
        'name': 'Modern Kitchen',
        'model_path': '/models/kitchen_modern.glb',
        'keywords': ['kitchen', 'cook', 'modern'],
        'description': 'Modern kitchen with island and breakfast bar',
        'objects': {
            'table1': {'position': [0, 0, 0], 'model': 'kitchen_island.glb'},
            'chair1': {'position': [1.5, 0, 0], 'model': 'bar_stool.glb'},
            'sofa': {'position': [3, 0, 2], 'model': 'sofa_office.glb'},
            'chair2': {'position': [0.5, 0, 0], 'model': 'bar_stool.glb'},
            'chair3': {'position': [-0.5, 0, 0], 'model': 'bar_stool.glb'},
            'table2': {'position': [3, 0, 2.5], 'model': 'table_dining_small.glb'},
            'light1': {'position': [0, 2.8, 0], 'model': 'light_kitchen.glb'},
            'light2': {'position': [3, 2.5, 2.5], 'model': 'light_pendant.glb'},
            'sofa': {'position': [3, 0, 2], 'model': 'sofa_office.glb'},
        }
    },
    'patio_outdoor': {
        'name': 'Outdoor Patio',
        'model_path': '/models/patio_outdoor.glb',
        'keywords': ['patio', 'outdoor', 'garden'],
        'description': 'Outdoor lounge with sectional seating',
        'objects': {
            'sofa1': {'position': [-2, 0, -2], 'model': 'sofa_outdoor.glb'},
            'sofa2': {'position': [2, 0, -2], 'model': 'sofa_outdoor.glb'},
            'sofa3': {'position': [0, 0, 0], 'model': 'sofa_outdoor.glb'},
            'table1': {'position': [0, 0, -1.5], 'model': 'table_outdoor.glb'},
            'table2': {'position': [3.5, 0, 1], 'model': 'table_side_outdoor.glb'},
            'chair1': {'position': [-3.5, 0, 1], 'model': 'chair_outdoor.glb'},
            'chair2': {'position': [3.5, 0, 1.8], 'model': 'chair_outdoor.glb'},
            'light': {'position': [0, 2.5, 0], 'model': 'light_outdoor.glb'},
            'rug': {'position': [0, 0.01, -1], 'model': 'rug_outdoor.glb'},
            'table1': {'position': [-3, 0, -3.5], 'model': 'nightstand_kids.glb'},
            'table2': {'position': [2.5, 0, -2], 'model': 'desk_kids.glb'},
        }
    },
    'kids_room': {
        'name': 'Kids Room',
        'model_path': '/models/kids_room.glb',
        'keywords': ['kids', 'children', 'play'],
        'description': 'Playful kids room with study and play areas',
        'objects': {
            'sofa': {'position': [-3, 0, -2], 'model': 'bed_kids.glb'},
            'table1': {'position': [-3, 0, -3.5], 'model': 'nightstand_kids.glb'},
            'table2': {'position': [2.5, 0, -2], 'model': 'desk_kids.glb'},
            'chair1': {'position': [2.5, 0, -1], 'model': 'chair_kids.glb'},
            'chair2': {'position': [0, 0, 1.5], 'model': 'chair_kids_small.glb'},
            'table3': {'position': [0, 0, 2], 'model': 'table_kids_play.glb'},
            'light1': {'position': [-3, 2.5, -2], 'model': 'light_kids.glb'},
            'light2': {'position': [2.5, 2.3, -2], 'model': 'light_desk.glb'},
            'rug': {'position': [0, 0.01, 1], 'model': 'rug_kids.glb'}
        }
    },
    'bathroom_luxury': {
        'name': 'Luxury Bathroom',
        'model_path': '/models/bathroom_luxury.glb',
        'keywords': ['bathroom', 'luxury', 'spa'],
        'description': 'Spa-like bathroom with vanity and seating',
        'objects': {
            'table': {'position': [0, 0, -2], 'model': 'vanity_luxury.glb'},
            'chair': {'position': [3, 0, 0], 'model': 'chair_bathroom.glb'},
            'light1': {'position': [0, 2.8, -2], 'model': 'light_bathroom.glb'},
            'light2': {'position': [2, 2.5, 0], 'model': 'light_wall.glb'},
            'light3': {'position': [-2, 2.5, 0], 'model': 'light_wall.glb'},
            'rug1': {'position': [0, 0.01, -1.5], 'model': 'bath_mat.glb'},
            'rug2': {'position': [3, 0.01, 0], 'model': 'bath_mat_small.glb'},
            'table1': {'position': [-3, 0, -3.5], 'model': 'nightstand_kids.glb'},
            'table2': {'position': [2.5, 0, -2], 'model': 'desk_kids.glb'},
        }
    },
    'studio_apartment': {
        'name': 'Studio Apartment',
        'model_path': '/models/studio_apartment.glb',
        'keywords': ['studio', 'apartment', 'compact'],
        'description': 'Efficient studio with multi-functional zones',
        'objects': {
            'sofa': {'position': [-2, 0, -1], 'model': 'sofa_compact.glb'},
            'table1': {'position': [0, 0, 0.5], 'model': 'table_coffee.glb'},
            'table2': {'position': [3, 0, -2], 'model': 'desk_compact.glb'},
            'chair1': {'position': [3, 0, -1], 'model': 'chair_compact.glb'},
            'chair2': {'position': [-3.5, 0, 2], 'model': 'chair_dining.glb'},
            'table3': {'position': [-3, 0, 2], 'model': 'table_dining_compact.glb'},
            'light1': {'position': [0, 2.8, 0], 'model': 'light_modern.glb'},
            'light2': {'position': [3, 2.3, -2], 'model': 'light_desk.glb'},
            'rug': {'position': [-1, 0.01, 0], 'model': 'rug_compact.glb'}
        }
    }
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def match_template(filename, metadata=None):
    """Match uploaded image to a 3D template based on filename or metadata"""
    filename_lower = filename.lower()
    
    # Try to match based on filename
    for template_id, template_data in TEMPLATES_CONFIG.items():
        for keyword in template_data['keywords']:
            if keyword in filename_lower:
                return template_id
    
    # Try to match based on metadata if provided
    if metadata:
        metadata_str = json.dumps(metadata).lower()
        for template_id, template_data in TEMPLATES_CONFIG.items():
            for keyword in template_data['keywords']:
                if keyword in metadata_str:
                    return template_id
    
    # Default to modern living room
    return 'living_room_modern'

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/templates', methods=['GET'])
def get_templates():
    """Get all available 3D templates"""
    templates_list = []
    for template_id, template_data in TEMPLATES_CONFIG.items():
        templates_list.append({
            'id': template_id,
            'name': template_data['name'],
            'keywords': template_data['keywords']
        })
    return jsonify({'templates': templates_list})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle 2D image upload and return matched 3D template"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        # Check if user wants rule-based analysis or template matching
        use_analysis = request.form.get('use_analysis', 'true').lower() == 'true'
        
        if use_analysis:
            try:
                # Use rule-based floor plan analysis
                print(f"Analyzing floor plan: {filepath}")
                analysis_result = analyze_floor_plan_image(filepath)
                
                print(f"Analysis successful!")
                print(f"Scene has {len(analysis_result['scene'].get('furniture', []))} furniture items")
                
                return jsonify({
                    'success': True,
                    'uploaded_file': unique_filename,
                    'analysis_type': 'rule_based',
                    'scene': analysis_result['scene'],
                    'metadata': analysis_result['metadata']
                })
            except Exception as e:
                print(f"Analysis error: {str(e)}")
                import traceback
                traceback.print_exc()
                # Fallback to template matching if analysis fails
                use_analysis = False
        
        if not use_analysis:
            # Check if user manually selected a template
            selected_template = request.form.get('template_id')
            
            if selected_template and selected_template in TEMPLATES_CONFIG:
                template_id = selected_template
            else:
                # Get metadata if provided
                metadata = request.form.get('metadata')
                if metadata:
                    try:
                        metadata = json.loads(metadata)
                    except:
                        metadata = None
                
                # Match to template based on filename
                template_id = match_template(filename, metadata)
            
            template_data = TEMPLATES_CONFIG[template_id]
            
            # Return matched template along with all available templates for user choice
            return jsonify({
                'success': True,
                'uploaded_file': unique_filename,
                'analysis_type': 'template_matching',
                'template': {
                    'id': template_id,
                    'name': template_data['name'],
                    'model_path': template_data['model_path'],
                    'objects': template_data['objects']
                },
                'suggested_templates': get_template_suggestions(filename)
            })
    
    return jsonify({'error': 'Invalid file type'}), 400

def get_template_suggestions(filename):
    """Return suggested templates based on filename analysis"""
    filename_lower = filename.lower()
    suggestions = []
    
    # Score each template based on keyword matches
    for template_id, template_data in TEMPLATES_CONFIG.items():
        score = 0
        matched_keywords = []
        
        for keyword in template_data['keywords']:
            if keyword in filename_lower:
                score += 1
                matched_keywords.append(keyword)
        
        suggestions.append({
            'id': template_id,
            'name': template_data['name'],
            'score': score,
            'matched_keywords': matched_keywords
        })
    
    # Sort by score (highest first)
    suggestions.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top 3 suggestions
    return suggestions[:3]

@app.route('/api/template/<template_id>', methods=['GET'])
def get_template(template_id):
    """Get specific template configuration"""
    if template_id not in TEMPLATES_CONFIG:
        return jsonify({'error': 'Template not found'}), 404
    
    template_data = TEMPLATES_CONFIG[template_id]
    return jsonify({
        'id': template_id,
        'name': template_data['name'],
        'model_path': template_data['model_path'],
        'objects': template_data['objects']
    })

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    """Get available furniture inventory for replacement with JSON mapping schema"""
    inventory = {
        'chairs': {
            'default': 'models/chairs/chair_modern.glb',
            'options': [
                {'id': 'chair_modern', 'name': 'Modern Chair', 'model': 'models/chairs/chair_modern.glb', 'thumbnail': '/thumbnails/chair_modern.jpg'},
                {'id': 'chair_classic', 'name': 'Classic Chair', 'model': 'models/chairs/chair_classic.glb', 'thumbnail': '/thumbnails/chair_classic.jpg'},
                {'id': 'chair_minimal', 'name': 'Minimal Chair', 'model': 'models/chairs/chair_minimal.glb', 'thumbnail': '/thumbnails/chair_minimal.jpg'},
                {'id': 'chair_office', 'name': 'Office Chair', 'model': 'models/chairs/chair_office.glb', 'thumbnail': '/thumbnails/chair_office.jpg'},
                {'id': 'chair_dining', 'name': 'Dining Chair', 'model': 'models/chairs/chair_dining.glb', 'thumbnail': '/thumbnails/chair_dining.jpg'},
                {'id': 'chair_lounge', 'name': 'Lounge Chair', 'model': 'models/chairs/chair_lounge.glb', 'thumbnail': '/thumbnails/chair_lounge.jpg'},
            ]
        },
        'sofas': {
            'default': 'models/sofas/sofa_modern.glb',
            'options': [
                {'id': 'sofa_modern', 'name': 'Modern Sofa', 'model': 'models/sofas/sofa_modern.glb', 'thumbnail': '/thumbnails/sofa_modern.jpg'},
                {'id': 'sofa_classic', 'name': 'Classic Sofa', 'model': 'models/sofas/sofa_classic.glb', 'thumbnail': '/thumbnails/sofa_classic.jpg'},
                {'id': 'sofa_sectional', 'name': 'Sectional Sofa', 'model': 'models/sofas/sofa_sectional.glb', 'thumbnail': '/thumbnails/sofa_sectional.jpg'},
                {'id': 'sofa_outdoor', 'name': 'Outdoor Sofa', 'model': 'models/sofas/sofa_outdoor.glb', 'thumbnail': '/thumbnails/sofa_outdoor.jpg'},
                {'id': 'sofa_chesterfield', 'name': 'Chesterfield', 'model': 'models/sofas/sofa_chesterfield.glb', 'thumbnail': '/thumbnails/sofa_chesterfield.jpg'},
                {'id': 'sofa_loveseat', 'name': 'Loveseat', 'model': 'models/sofas/sofa_loveseat.glb', 'thumbnail': '/thumbnails/sofa_loveseat.jpg'},
            ]
        },
        'tables': {
            'default': 'models/tables/table_modern.glb',
            'options': [
                {'id': 'table_glass', 'name': 'Glass Table', 'model': 'models/tables/table_glass.glb', 'thumbnail': '/thumbnails/table_glass.jpg'},
                {'id': 'table_wood', 'name': 'Wooden Table', 'model': 'models/tables/table_wood.glb', 'thumbnail': '/thumbnails/table_wood.jpg'},
                {'id': 'table_dining', 'name': 'Dining Table', 'model': 'models/tables/table_dining.glb', 'thumbnail': '/thumbnails/table_dining.jpg'},
                {'id': 'table_desk', 'name': 'Modern Desk', 'model': 'models/tables/table_desk.glb', 'thumbnail': '/thumbnails/table_desk.jpg'},
                {'id': 'table_nightstand', 'name': 'Nightstand', 'model': 'models/tables/table_nightstand.glb', 'thumbnail': '/thumbnails/table_nightstand.jpg'},
                {'id': 'table_coffee', 'name': 'Coffee Table', 'model': 'models/tables/table_coffee.glb', 'thumbnail': '/thumbnails/table_coffee.jpg'},
            ]
        },
        'lights': {
            'default': 'models/lights/light_pendant.glb',
            'options': [
                {'id': 'light_pendant', 'name': 'Pendant Light', 'model': 'models/lights/light_pendant.glb', 'thumbnail': '/thumbnails/light_pendant.jpg'},
                {'id': 'light_chandelier', 'name': 'Chandelier', 'model': 'models/lights/light_chandelier.glb', 'thumbnail': '/thumbnails/light_chandelier.jpg'},
                {'id': 'light_ceiling', 'name': 'Ceiling Light', 'model': 'models/lights/light_ceiling.glb', 'thumbnail': '/thumbnails/light_ceiling.jpg'},
                {'id': 'light_floor', 'name': 'Floor Lamp', 'model': 'models/lights/light_floor.glb', 'thumbnail': '/thumbnails/light_floor.jpg'},
                {'id': 'light_table', 'name': 'Table Lamp', 'model': 'models/lights/light_table.glb', 'thumbnail': '/thumbnails/light_table.jpg'},
                {'id': 'light_wall', 'name': 'Wall Sconce', 'model': 'models/lights/light_wall.glb', 'thumbnail': '/thumbnails/light_wall.jpg'},
            ]
        },
        'rugs': {
            'default': 'models/rugs/rug_modern.glb',
            'options': [
                {'id': 'rug_modern', 'name': 'Modern Rug', 'model': 'models/rugs/rug_modern.glb', 'thumbnail': '/thumbnails/rug_modern.jpg'},
                {'id': 'rug_persian', 'name': 'Persian Rug', 'model': 'models/rugs/rug_persian.glb', 'thumbnail': '/thumbnails/rug_persian.jpg'},
                {'id': 'rug_minimal', 'name': 'Minimal Rug', 'model': 'models/rugs/rug_minimal.glb', 'thumbnail': '/thumbnails/rug_minimal.jpg'},
                {'id': 'rug_round', 'name': 'Round Rug', 'model': 'models/rugs/rug_round.glb', 'thumbnail': '/thumbnails/rug_round.jpg'},
                {'id': 'rug_shag', 'name': 'Shag Rug', 'model': 'models/rugs/rug_shag.glb', 'thumbnail': '/thumbnails/rug_shag.jpg'},
                {'id': 'rug_geometric', 'name': 'Geometric Rug', 'model': 'models/rugs/rug_geometric.glb', 'thumbnail': '/thumbnails/rug_geometric.jpg'},
            ]
        }
    }
    return jsonify(inventory)

@app.route('/api/scene/save', methods=['POST'])
def save_scene():
    """Save user-edited scene configuration with detailed metadata"""
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Generate unique scene ID
    scene_id = data.get('scene_id')
    if not scene_id:
        import uuid
        scene_id = str(uuid.uuid4())[:8]
    
    scene_data = {
        'scene_id': scene_id,
        'template_id': data.get('template_id'),
        'template_name': data.get('template_name'),
        'objects': data.get('objects', {}),
        'camera': data.get('camera', {}),
        'lighting': data.get('lighting', {}),
        'metadata': {
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'version': '1.0',
            'description': data.get('description', ''),
            'tags': data.get('tags', [])
        },
        'share_url': f"/scene/{scene_id}"
    }
    
    # Save to file
    scene_file = os.path.join(TEMPLATES_FOLDER, f"scene_{scene_id}.json")
    with open(scene_file, 'w') as f:
        json.dump(scene_data, f, indent=2)
    
    return jsonify({
        'success': True,
        'scene_id': scene_id,
        'share_url': scene_data['share_url'],
        'message': 'Scene saved successfully'
    })

@app.route('/api/scene/<scene_id>', methods=['GET'])
def get_scene(scene_id):
    """Retrieve saved scene configuration"""
    scene_file = os.path.join(TEMPLATES_FOLDER, f"scene_{scene_id}.json")
    
    if not os.path.exists(scene_file):
        return jsonify({'error': 'Scene not found'}), 404
    
    with open(scene_file, 'r') as f:
        scene_data = json.load(f)
    
    return jsonify(scene_data)

@app.route('/api/scenes', methods=['GET'])
def list_scenes():
    """List all saved scenes"""
    scenes = []
    for filename in os.listdir(TEMPLATES_FOLDER):
        if filename.startswith('scene_') and filename.endswith('.json'):
            scene_file = os.path.join(TEMPLATES_FOLDER, filename)
            with open(scene_file, 'r') as f:
                scene_data = json.load(f)
                scenes.append({
                    'scene_id': scene_data['scene_id'],
                    'template_id': scene_data.get('template_id'),
                    'created_at': scene_data.get('created_at')
                })
    
    return jsonify({'scenes': scenes})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
