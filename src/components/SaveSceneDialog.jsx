import { useState } from 'react';
import axios from 'axios';
import './SaveSceneDialog.css';

const SaveSceneDialog = ({ isOpen, onClose, sceneData, onSaveSuccess }) => {
  const [sceneName, setSceneName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedScene, setSavedScene] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!sceneName.trim()) {
      setError('Please enter a scene name');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const savePayload = {
        ...sceneData,
        name: sceneName,
        description: description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      const response = await axios.post('http://localhost:5000/api/scene/save', savePayload);
      
      setSavedScene(response.data);
      
      if (onSaveSuccess) {
        onSaveSuccess(response.data);
      }
    } catch (err) {
      console.error('Error saving scene:', err);
      setError(err.response?.data?.error || 'Failed to save scene');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (savedScene?.share_url) {
      navigator.clipboard.writeText(savedScene.share_url);
      
      // Show copied notification
      const btn = document.querySelector('.copy-link-btn');
      if (btn) {
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy Link';
        }, 2000);
      }
    }
  };

  const handleClose = () => {
    setSceneName('');
    setDescription('');
    setTags('');
    setSavedScene(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="save-scene-overlay" onClick={handleClose}>
      <div className="save-scene-dialog" onClick={(e) => e.stopPropagation()}>
        {!savedScene ? (
          <>
            <div className="dialog-header">
              <h2>Save Scene Configuration</h2>
              <button className="close-btn" onClick={handleClose}>×</button>
            </div>

            <div className="dialog-content">
              <div className="form-group">
                <label htmlFor="scene-name">Scene Name *</label>
                <input
                  id="scene-name"
                  type="text"
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  placeholder="e.g., Modern Living Room Design"
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="scene-description">Description (Optional)</label>
                <textarea
                  id="scene-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your scene design..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="scene-tags">Tags (Optional)</label>
                <input
                  id="scene-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="modern, minimalist, living-room (comma-separated)"
                  className="form-input"
                />
                <small className="form-hint">Separate tags with commas</small>
              </div>

              {error && (
                <div className="error-message">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="scene-preview">
                <h3>Scene Summary</h3>
                <div className="preview-item">
                  <span className="preview-label">Template:</span>
                  <span className="preview-value">{sceneData?.template_name || 'Unknown'}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Objects:</span>
                  <span className="preview-value">
                    {sceneData?.objects ? Object.keys(sceneData.objects).length : 0} items
                  </span>
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="btn-spinner"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Scene
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="dialog-header success">
              <div className="success-icon">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2>Scene Saved Successfully!</h2>
            </div>

            <div className="dialog-content">
              <div className="success-details">
                <div className="detail-row">
                  <span className="detail-label">Scene ID:</span>
                  <code className="detail-value">{savedScene.scene_id}</code>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{savedScene.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">
                    {new Date(savedScene.created_at).toLocaleString()}
                  </span>
                </div>
                {savedScene.tags && savedScene.tags.length > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Tags:</span>
                    <div className="tags-list">
                      {savedScene.tags.map((tag, i) => (
                        <span key={i} className="tag-badge">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="share-section">
                <label>Shareable Link:</label>
                <div className="share-link-container">
                  <input
                    type="text"
                    value={savedScene.share_url || `${window.location.origin}/scene/${savedScene.scene_id}`}
                    readOnly
                    className="share-link-input"
                  />
                  <button className="copy-link-btn" onClick={handleCopyLink}>
                    Copy Link
                  </button>
                </div>
                <small className="share-hint">
                  Share this link to let others view your scene
                </small>
              </div>
            </div>

            <div className="dialog-footer">
              <button className="btn-primary wide" onClick={handleClose}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaveSceneDialog;
