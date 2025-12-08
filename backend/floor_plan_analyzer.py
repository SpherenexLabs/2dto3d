import cv2
import numpy as np
from PIL import Image
import json

class FloorPlanAnalyzer:
    """Rule-based 2D floor plan to 3D scene converter"""
    
    def __init__(self):
        self.wall_thickness = 0.2  # meters
        self.default_wall_height = 2.8  # meters
        self.default_door_width = 0.9  # meters
        self.default_window_width = 1.2  # meters
        
    def analyze_floor_plan(self, image_path):
        """Main analysis function to extract rooms, walls, doors, and windows"""
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not load image")
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Get image dimensions for scaling
        height, width = gray.shape
        scale_factor = 10.0 / max(height, width)  # Normalize to ~10 meter space
        
        # Analyze different components
        walls = self.detect_walls(gray, scale_factor)
        rooms = self.detect_rooms(gray, scale_factor)
        doors = self.detect_doors(gray, scale_factor)
        windows = self.detect_windows(gray, scale_factor)
        
        # Generate 3D scene configuration
        scene_config = self.generate_3d_scene(walls, rooms, doors, windows)
        
        return scene_config
    
    def detect_walls(self, gray_img, scale_factor):
        """Detect walls using edge detection and line detection"""
        # Apply edge detection
        edges = cv2.Canny(gray_img, 50, 150, apertureSize=3)
        
        # Detect lines using Hough Transform
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100,
                                minLineLength=50, maxLineGap=10)
        
        walls = []
        if lines is not None:
            for line in lines:
                x1, y1, x2, y2 = line[0]
                
                # Convert to 3D coordinates (scale and center)
                start = self._to_3d_coords(x1, y1, gray_img.shape, scale_factor)
                end = self._to_3d_coords(x2, y2, gray_img.shape, scale_factor)
                
                # Calculate wall length
                length = np.sqrt((end[0] - start[0])**2 + (end[2] - start[2])**2)
                
                # Only keep significant walls
                if length > 0.5:
                    walls.append({
                        'start': start,
                        'end': end,
                        'length': length,
                        'height': self.default_wall_height,
                        'thickness': self.wall_thickness
                    })
        
        return walls
    
    def detect_rooms(self, gray_img, scale_factor):
        """Detect room spaces using contour detection"""
        # Threshold and find contours
        _, binary = cv2.threshold(gray_img, 200, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        rooms = []
        for i, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            
            # Filter small contours (noise)
            if area > 1000:
                # Get bounding box
                x, y, w, h = cv2.boundingRect(contour)
                
                # Convert to 3D coordinates
                center = self._to_3d_coords(x + w/2, y + h/2, gray_img.shape, scale_factor)
                size = [w * scale_factor, h * scale_factor]
                
                # Classify room type based on size
                room_type = self._classify_room(size[0] * size[1])
                
                rooms.append({
                    'id': f'room_{i}',
                    'type': room_type,
                    'center': center,
                    'width': size[0],
                    'depth': size[1],
                    'area': size[0] * size[1]
                })
        
        return rooms
    
    def detect_doors(self, gray_img, scale_factor):
        """Detect doors - typically shown as gaps in walls or specific symbols"""
        # Use template matching or gap detection
        # For simplicity, we'll identify potential door locations based on wall gaps
        
        # Apply morphological operations to find gaps
        kernel = np.ones((3, 3), np.uint8)
        edges = cv2.Canny(gray_img, 50, 150)
        dilated = cv2.dilate(edges, kernel, iterations=1)
        
        doors = []
        # This is a simplified approach - in practice, you'd use more sophisticated methods
        # For now, return placeholder door positions
        
        return doors
    
    def detect_windows(self, gray_img, scale_factor):
        """Detect windows - typically shown as double lines or specific patterns"""
        windows = []
        # Simplified window detection
        # In practice, you'd look for specific patterns or parallel lines
        
        return windows
    
    def _to_3d_coords(self, x, y, img_shape, scale_factor):
        """Convert 2D image coordinates to 3D world coordinates"""
        height, width = img_shape
        
        # Center and scale
        world_x = (x - width / 2) * scale_factor
        world_z = (y - height / 2) * scale_factor
        world_y = 0  # Floor level
        
        return [world_x, world_y, world_z]
    
    def _classify_room(self, area):
        """Classify room type based on area"""
        if area < 8:
            return 'bathroom'
        elif area < 12:
            return 'bedroom'
        elif area < 20:
            return 'living_room'
        elif area < 15:
            return 'kitchen'
        else:
            return 'living_room'
    
    def generate_3d_scene(self, walls, rooms, doors, windows):
        """Generate 3D scene configuration from detected elements"""
        scene = {
            'walls': [],
            'floors': [],
            'ceilings': [],
            'doors': [],
            'windows': [],
            'rooms': rooms,
            'furniture': []
        }
        
        # Add walls to scene
        for wall in walls:
            scene['walls'].append({
                'type': 'wall',
                'start': wall['start'],
                'end': wall['end'],
                'height': wall['height'],
                'thickness': wall['thickness'],
                'material': 'drywall'
            })
        
        # For each room, create a complete space with walls, floor, ceiling
        for room in rooms:
            room_width = room['width']
            room_depth = room['depth']
            room_center = room['center']
            
            # Add floor
            scene['floors'].append({
                'type': 'floor',
                'position': room_center,
                'width': room_width,
                'depth': room_depth,
                'material': self._get_floor_material(room['type'])
            })
            
            # Add ceiling
            scene['ceilings'].append({
                'type': 'ceiling',
                'position': [room_center[0], self.default_wall_height, room_center[2]],
                'width': room_width,
                'depth': room_depth
            })
            
            # Add room boundary walls if not already present
            half_w = room_width / 2
            half_d = room_depth / 2
            cx, cy, cz = room_center
            
            # North wall
            scene['walls'].append({
                'type': 'wall',
                'start': [cx - half_w, 0, cz - half_d],
                'end': [cx + half_w, 0, cz - half_d],
                'height': self.default_wall_height,
                'thickness': self.wall_thickness,
                'material': 'drywall'
            })
            
            # South wall
            scene['walls'].append({
                'type': 'wall',
                'start': [cx - half_w, 0, cz + half_d],
                'end': [cx + half_w, 0, cz + half_d],
                'height': self.default_wall_height,
                'thickness': self.wall_thickness,
                'material': 'drywall'
            })
            
            # East wall
            scene['walls'].append({
                'type': 'wall',
                'start': [cx + half_w, 0, cz - half_d],
                'end': [cx + half_w, 0, cz + half_d],
                'height': self.default_wall_height,
                'thickness': self.wall_thickness,
                'material': 'drywall'
            })
            
            # West wall
            scene['walls'].append({
                'type': 'wall',
                'start': [cx - half_w, 0, cz - half_d],
                'end': [cx - half_w, 0, cz + half_d],
                'height': self.default_wall_height,
                'thickness': self.wall_thickness,
                'material': 'drywall'
            })
            
            # Add doors for room
            num_doors = 1 if room['type'] == 'bathroom' else 1
            for i in range(num_doors):
                door_pos = [cx + half_w - 0.5, 0, cz]
                scene['doors'].append({
                    'type': 'door',
                    'position': door_pos,
                    'rotation': -np.pi / 2,
                    'width': self.default_door_width,
                    'height': 2.1
                })
            
            # Add windows for room (except bathrooms)
            if room['type'] != 'bathroom':
                num_windows = 2 if room['area'] > 15 else 1
                for i in range(num_windows):
                    window_pos = [cx - half_w + 0.1, 1.5, cz + (i - 0.5) * room_depth * 0.4]
                    scene['windows'].append({
                        'type': 'window',
                        'position': window_pos,
                        'rotation': np.pi / 2,
                        'width': 1.2,
                        'height': 1.5
                    })
            
            # Add furniture based on room type
            furniture = self._generate_furniture_for_room(room)
            scene['furniture'].extend(furniture)
        
        return scene
    
    def _get_floor_material(self, room_type):
        """Return appropriate floor material for room type"""
        materials = {
            'living_room': 'wood',
            'bedroom': 'wood',
            'kitchen': 'tile',
            'bathroom': 'tile',
            'dining': 'wood',
            'office': 'wood'
        }
        return materials.get(room_type, 'wood')
    
    def _generate_furniture_for_room(self, room):
        """Generate appropriate furniture placement for room type"""
        furniture = []
        room_type = room['type']
        center = room['center']
        width = room['width']
        depth = room['depth']
        
        if room_type == 'living_room':
            # Sofa against back wall
            furniture.append({
                'type': 'sofa',
                'component': 'ModernSofa',
                'position': [center[0], 0, center[2] - depth * 0.35],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'color': '#4a5568'
            })
            
            # Coffee table in center
            furniture.append({
                'type': 'table',
                'component': 'DiningTable',
                'position': [center[0], 0, center[2]],
                'rotation': [0, 0, 0],
                'scale': [0.8, 0.8, 0.8],
                'color': '#8B4513'
            })
            
            # Armchairs on sides
            furniture.append({
                'type': 'chair',
                'component': 'ModernChair',
                'position': [center[0] - width * 0.3, 0, center[2] + depth * 0.2],
                'rotation': [0, np.pi / 4, 0],
                'scale': [1.2, 1.2, 1.2],
                'color': '#2d3748'
            })
            
            furniture.append({
                'type': 'chair',
                'component': 'ModernChair',
                'position': [center[0] + width * 0.3, 0, center[2] + depth * 0.2],
                'rotation': [0, -np.pi / 4, 0],
                'scale': [1.2, 1.2, 1.2],
                'color': '#2d3748'
            })
            
            # Area rug
            furniture.append({
                'type': 'rug',
                'component': 'AreaRug',
                'position': [center[0], 0, center[2]],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'width': width * 0.6,
                'depth': depth * 0.5,
                'color': '#8B0000'
            })
            
            # Ceiling light
            furniture.append({
                'type': 'light',
                'component': 'CeilingLight',
                'position': [center[0], 2.6, center[2]],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'intensity': 2
            })
            
        elif room_type == 'bedroom':
            # Bed centered against back wall
            furniture.append({
                'type': 'bed',
                'component': 'Bed',
                'position': [center[0], 0, center[2] - depth * 0.3],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'color': '#f5f5dc'
            })
            
            # Nightstands on both sides
            furniture.append({
                'type': 'table',
                'component': 'DiningTable',
                'position': [center[0] - width * 0.35, 0, center[2] - depth * 0.3],
                'rotation': [0, 0, 0],
                'scale': [0.4, 0.6, 0.4],
                'color': '#654321'
            })
            
            furniture.append({
                'type': 'table',
                'component': 'DiningTable',
                'position': [center[0] + width * 0.35, 0, center[2] - depth * 0.3],
                'rotation': [0, 0, 0],
                'scale': [0.4, 0.6, 0.4],
                'color': '#654321'
            })
            
            # Dresser
            furniture.append({
                'type': 'table',
                'component': 'DiningTable',
                'position': [center[0] + width * 0.35, 0, center[2] + depth * 0.3],
                'rotation': [0, np.pi / 2, 0],
                'scale': [0.6, 0.8, 0.8],
                'color': '#654321'
            })
            
            # Chair
            furniture.append({
                'type': 'chair',
                'component': 'ModernChair',
                'position': [center[0] - width * 0.3, 0, center[2] + depth * 0.2],
                'rotation': [0, np.pi / 4, 0],
                'scale': [1, 1, 1],
                'color': '#8B4513'
            })
            
            # Ceiling lights
            furniture.append({
                'type': 'light',
                'component': 'CeilingLight',
                'position': [center[0], 2.6, center[2]],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'intensity': 1.5
            })
            
            # Area rug
            furniture.append({
                'type': 'rug',
                'component': 'AreaRug',
                'position': [center[0], 0, center[2] + depth * 0.1],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'width': width * 0.5,
                'depth': depth * 0.4,
                'color': '#c8b8a0'
            })
            
        elif room_type == 'kitchen':
            # Dining table
            furniture.append({
                'type': 'table',
                'component': 'DiningTable',
                'position': [center[0], 0, center[2]],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'color': '#8B4513'
            })
            
            # Dining chairs around table
            furniture.append({
                'type': 'chair',
                'component': 'ModernChair',
                'position': [center[0] - width * 0.2, 0, center[2] + depth * 0.15],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 1],
                'color': '#654321'
            })
            
            furniture.append({
                'type': 'chair',
                'component': 'ModernChair',
                'position': [center[0] + width * 0.2, 0, center[2] + depth * 0.15],
                'rotation': [0, np.pi, 0],
                'scale': [1, 1, 1],
                'color': '#654321'
            })
            
            furniture.append({
                'type': 'chair',
                'component': 'ModernChair',
                'position': [center[0], 0, center[2] - depth * 0.15],
                'rotation': [0, np.pi / 2, 0],
                'scale': [1, 1, 1],
                'color': '#654321'
            })
            
            furniture.append({
                'type': 'chair',
                'component': 'ModernChair',
                'position': [center[0], 0, center[2] + depth * 0.35],
                'rotation': [0, -np.pi / 2, 0],
                'scale': [1, 1, 1],
                'color': '#654321'
            })
            
            # Pendant light over table
            furniture.append({
                'type': 'light',
                'component': 'CeilingLight',
                'position': [center[0], 2.3, center[2]],
                'rotation': [0, 0, 0],
                'scale': [0.8, 0.8, 0.8],
                'intensity': 2.5
            })
            
        elif room_type == 'bathroom':
            # Minimal lighting
            furniture.append({
                'type': 'light',
                'component': 'CeilingLight',
                'position': [center[0], 2.5, center[2]],
                'rotation': [0, 0, 0],
                'scale': [0.7, 0.7, 0.7],
                'intensity': 1.8
            })
        
        return furniture
    
    def analyze_and_generate_json(self, image_path, output_path=None):
        """Complete analysis pipeline returning JSON configuration"""
        scene_config = self.analyze_floor_plan(image_path)
        
        # Add metadata
        result = {
            'version': '1.0',
            'type': 'floor_plan_3d',
            'scene': scene_config,
            'metadata': {
                'source_image': image_path,
                'analysis_method': 'rule_based',
                'wall_height': self.default_wall_height
            }
        }
        
        if output_path:
            with open(output_path, 'w') as f:
                json.dump(result, f, indent=2)
        
        return result


# Helper function for the Flask app
def analyze_floor_plan_image(image_path):
    """Wrapper function to be called from Flask"""
    analyzer = FloorPlanAnalyzer()
    return analyzer.analyze_and_generate_json(image_path)
