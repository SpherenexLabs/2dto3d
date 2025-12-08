import { useState } from 'react';
import './TemplateSelector.css';

const TemplateSelector = ({ uploadedFile, suggestedTemplates, onTemplateSelect, onCancel }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    suggestedTemplates && suggestedTemplates[0] ? suggestedTemplates[0].id : null
  );

  const allTemplates = [
    { id: 'living_room_modern', name: 'Modern Living Room', icon: '🛋️' },
    { id: 'living_room_classic', name: 'Classic Living Room', icon: '🪑' },
    { id: 'bedroom_minimal', name: 'Minimal Bedroom', icon: '🛏️' },
    { id: 'dining_room', name: 'Dining Room', icon: '🍽️' },
    { id: 'office_modern', name: 'Modern Office', icon: '💼' },
    { id: 'kitchen_modern', name: 'Modern Kitchen', icon: '🍳' },
    { id: 'patio_outdoor', name: 'Outdoor Patio', icon: '🌿' },
    { id: 'kids_room', name: 'Kids Room', icon: '🧸' },
    { id: 'bathroom_luxury', name: 'Luxury Bathroom', icon: '🛁' },
    { id: 'studio_apartment', name: 'Studio Apartment', icon: '🏠' }
  ];

  const handleConfirm = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="template-selector-overlay">
      <div className="template-selector-container">
        <div className="selector-header">
          <h2>Choose Room Template</h2>
          <p>Select the template that best matches your floor plan</p>
        </div>

        {suggestedTemplates && suggestedTemplates.length > 0 && suggestedTemplates[0].score > 0 && (
          <div className="suggested-section">
            <h3>💡 Suggested Based on Filename</h3>
            <div className="suggested-templates">
              {suggestedTemplates.filter(t => t.score > 0).map(template => {
                const templateInfo = allTemplates.find(t => t.id === template.id);
                return (
                  <button
                    key={template.id}
                    className={`suggested-template ${selectedTemplate === template.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <span className="template-icon">{templateInfo?.icon || '🏠'}</span>
                    <span className="template-name">{template.name}</span>
                    <span className="match-badge">
                      {template.matched_keywords.join(', ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="all-templates-section">
          <h3>All Templates</h3>
          <div className="templates-grid">
            {allTemplates.map(template => (
              <button
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="template-icon-large">{template.icon}</div>
                <div className="template-name">{template.name}</div>
                {selectedTemplate === template.id && (
                  <div className="selected-indicator">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="selector-actions">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="confirm-btn"
            disabled={!selectedTemplate}
          >
            Generate 3D Scene
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
