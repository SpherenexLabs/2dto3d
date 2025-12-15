import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import TemplateSelector from './TemplateSelector';
import { config } from '../config/api';
import './ImageUpload.css';

const ImageUpload = ({ onTemplateMatch }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [suggestedTemplates, setSuggestedTemplates] = useState(null);

  // Helper function to convert rule-based scene format to template format
  const convertSceneToTemplate = (scene, metadata) => {
    const objects = {};
    
    // Add walls
    if (scene.walls && Array.isArray(scene.walls)) {
      scene.walls.forEach((wall, index) => {
        objects[`wall${index + 1}`] = {
          type: 'wall',
          component: 'Wall',
          start: wall.start,
          end: wall.end,
          height: wall.height,
          thickness: wall.thickness,
          material: wall.material
        };
      });
    } else {
      console.warn('No walls found in scene!', scene);
    }
    
    // Add floors
    if (scene.floors && Array.isArray(scene.floors)) {
      scene.floors.forEach((floor, index) => {
        objects[`floor${index + 1}`] = {
          type: 'floor',
          component: 'Floor',
          position: floor.position,
          width: floor.width,
          depth: floor.depth,
          material: floor.material
        };
      });
    }
    
    // Add ceilings
    if (scene.ceilings && Array.isArray(scene.ceilings)) {
      scene.ceilings.forEach((ceiling, index) => {
        objects[`ceiling${index + 1}`] = {
          type: 'ceiling',
          component: 'Ceiling',
          position: ceiling.position,
          width: ceiling.width,
          depth: ceiling.depth
        };
      });
    }
    
    // Add doors
    if (scene.doors && Array.isArray(scene.doors)) {
      scene.doors.forEach((door, index) => {
        objects[`door${index + 1}`] = {
          type: 'door',
          component: 'Door',
          position: door.position,
          rotation: door.rotation,
          width: door.width,
          height: door.height
        };
      });
    }
    
    // Add windows
    if (scene.windows && Array.isArray(scene.windows)) {
      scene.windows.forEach((window, index) => {
        objects[`window${index + 1}`] = {
          type: 'window',
          component: 'Window',
          position: window.position,
          rotation: window.rotation,
          width: window.width,
          height: window.height
        };
      });
    }
    
    // Add furniture
    if (scene.furniture && Array.isArray(scene.furniture)) {
      scene.furniture.forEach((item, index) => {
        const key = `${item.type}${index + 1}`;
        objects[key] = {
          type: item.type,
          component: item.component || 'ModernChair',
          position: item.position,
          rotation: item.rotation || [0, 0, 0],
          scale: item.scale || [1, 1, 1],
          color: item.color,
          width: item.width,
          depth: item.depth,
          intensity: item.intensity
        };
      });
    }

    return {
      id: 'rule_based_scene',
      name: 'AI Generated Floor Plan',
      objects: objects,
      metadata: metadata
    };
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('use_analysis', 'true'); // Enable rule-based analysis

    try {
      const response = await axios.post(config.endpoints.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadedImage(response.data.uploaded_file);
        setUploadedFile(file);
        
        console.log('Upload response:', response.data);
        
        // Check if rule-based analysis was successful
        if (response.data.analysis_type === 'rule_based' && response.data.scene) {
          console.log('Rule-based analysis detected');
          console.log('Scene data:', response.data.scene);
          // Convert and directly use the analyzed scene
          const convertedTemplate = convertSceneToTemplate(response.data.scene, response.data.metadata);
          console.log('Converted template:', convertedTemplate);
          onTemplateMatch(convertedTemplate);
          setUploading(false);
        } else {
          console.log('Using template matching instead');
          // Show template selector for manual selection
          setSuggestedTemplates(response.data.suggested_templates);
          setShowTemplateSelector(true);
          setUploading(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      console.error('Upload error:', err);
      setUploading(false);
    }
  }, [onTemplateMatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleClear = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setPreview(null);
    setError(null);
    setShowTemplateSelector(false);
    setSuggestedTemplates(null);
  };

  const handleTemplateSelect = async (templateId) => {
    setShowTemplateSelector(false);
    setUploading(true);

    try {
      // Re-upload with selected template
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('template_id', templateId);
      formData.append('use_analysis', 'false'); // Use template matching

      const response = await axios.post(config.endpoints.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Handle both template matching and rule-based analysis responses
        if (response.data.analysis_type === 'rule_based' && response.data.scene) {
          // Convert rule-based analysis to template format
          const convertedTemplate = convertSceneToTemplate(response.data.scene, response.data.metadata);
          onTemplateMatch(convertedTemplate);
        } else if (response.data.template) {
          // Standard template response
          onTemplateMatch(response.data.template);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load template');
      console.error('Template load error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelSelector = () => {
    setShowTemplateSelector(false);
    handleClear();
  };

  return (
    <div className="image-upload-container">
      {showTemplateSelector && (
        <TemplateSelector
          uploadedFile={uploadedImage}
          suggestedTemplates={suggestedTemplates}
          onTemplateSelect={handleTemplateSelect}
          onCancel={handleCancelSelector}
        />
      )}

      <div className="upload-header">
        <h2>Upload 2D Layout</h2>
        <p className="upload-subtitle">Transform your floor plan into an interactive 3D space</p>
      </div>
      
      {!preview ? (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="upload-icon">
              <Upload size={48} strokeWidth={1.5} />
            </div>
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <>
                <p>Drag & drop a 2D layout here, or click to select</p>
                <p className="supported-formats">Supported: JPEG, PNG, SVG</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="preview-container">
          <div className="preview-header">
            <h3>Preview</h3>
            <button onClick={handleClear} className="clear-btn">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="preview-image-wrapper">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
          {uploading && (
            <div className="upload-status">
              <div className="spinner"></div>
              <p>Analyzing layout...</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
