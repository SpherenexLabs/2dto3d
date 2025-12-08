import { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryPanel.css';

const InventoryPanel = ({ onItemSelect, selectedObject, onReplaceObject }) => {
  const [inventory, setInventory] = useState(null);
  const [activeCategory, setActiveCategory] = useState('chairs');
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      setInventory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleItemClick = (item) => {
    if (selectedObject) {
      onReplaceObject(selectedObject, item);
    } else {
      onItemSelect(item);
    }
  };

  const categories = [
    { key: 'chairs', label: 'Chairs', icon: '🪑' },
    { key: 'sofas', label: 'Sofas', icon: '🛋️' },
    { key: 'tables', label: 'Tables', icon: '🪑' },
    { key: 'lights', label: 'Lights', icon: '💡' },
    { key: 'rugs', label: 'Rugs', icon: '🧶' }
  ];

  if (loading) {
    return (
      <div className="inventory-panel">
        <div className="inventory-loading">
          <div className="loading-spinner"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-panel">
      <div className="inventory-header">
        <h2>Furniture Inventory</h2>
        {selectedObject && (
          <div className="selection-info">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Click item to replace</span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <span className="tab-icon">{cat.icon}</span>
            <span className="tab-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="inventory-items">
        {inventory && inventory[activeCategory] && (
          <div className="items-grid">
            {inventory[activeCategory].map(item => (
              <div
                key={item.id}
                className={`inventory-item ${draggedItem?.id === item.id ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(item)}
                onDragEnd={handleDragEnd}
                onClick={() => handleItemClick(item)}
              >
                <div className="item-preview">
                  {/* Placeholder icon based on category */}
                  <div className="item-icon">
                    {activeCategory === 'chairs' && '🪑'}
                    {activeCategory === 'sofas' && '🛋️'}
                    {activeCategory === 'tables' && '🪑'}
                    {activeCategory === 'lights' && '💡'}
                    {activeCategory === 'rugs' && '🧶'}
                  </div>
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-model">{item.model}</p>
                </div>
                <div className="item-actions">
                  <button 
                    className="use-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    {selectedObject ? 'Replace' : 'Use'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="inventory-footer">
        <div className="instructions">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Drag items to scene or click to replace selected object</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
