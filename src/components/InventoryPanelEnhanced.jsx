import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../config/api';
import './InventoryPanelEnhanced.css';

const InventoryPanelEnhanced = ({ selectedObject, onReplaceObject }) => {
  const [inventory, setInventory] = useState(null);
  const [activeCategory, setActiveCategory] = useState('chairs');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('variants');

  const getCategoryIcon = (category) => {
    const icons = {
      'chairs': '🪑',
      'sofas': '🛋️',
      'tables': '🍽️',
      'lights': '💡',
      'rugs': '🧶'
    };
    return icons[category] || '📦';
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/inventory`);
      // Transform the data structure from {category: {options: [...]}} to {category: [...]}
      const transformedData = {};
      Object.keys(response.data).forEach(key => {
        transformedData[key] = response.data[key].options || [];
      });
      setInventory(transformedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    // Add category to item for better handling in parent
    const itemWithCategory = {
      ...item,
      category: activeCategory
    };
    onReplaceObject(itemWithCategory);
  };

  const categories = [
    { key: 'chairs', label: 'Chairs', icon: '🪑', count: 12 },
    { key: 'sofas', label: 'Sofas', icon: '🛋️', count: 8 },
    { key: 'tables', label: 'Tables', icon: '🍽️', count: 10 },
    { key: 'lights', label: 'Lights', icon: '💡', count: 15 },
    { key: 'rugs', label: 'Rugs', icon: '🧶', count: 6 }
  ];

  if (loading) {
    return (
      <div className="inventory-panel-enhanced">
        <div className="inventory-loading">
          <div className="loading-spinner"></div>
          <p>Loading furniture collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-panel-enhanced">
      <div className="inventory-header">
        <h2>Furniture Gallery</h2>
        {selectedObject && (
          <div className="selection-badge">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Selected: {selectedObject}
          </div>
        )}
      </div>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <span className="tab-icon">{cat.icon}</span>
            <span className="tab-label">{cat.label}</span>
            <span className="variant-count">{cat.count}</span>
          </button>
        ))}
      </div>

      <div className="view-controls">
        <button
          className={`view-toggle ${viewMode === 'variants' ? 'active' : ''}`}
          onClick={() => setViewMode('variants')}
        >
          🎨 Variants View
        </button>
        <button
          className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📋 List View
        </button>
      </div>

      <div className="inventory-content">
        {viewMode === 'variants' ? (
          <>
            <h3 className="section-title">
              {categories.find(c => c.key === activeCategory)?.label || 'Items'}
              <span className="variant-badge">
                {inventory && inventory[activeCategory] && Array.isArray(inventory[activeCategory]) ? inventory[activeCategory].length : 0} variants
              </span>
            </h3>
            <div className="variants-grid">
              {inventory && inventory[activeCategory] && Array.isArray(inventory[activeCategory]) && inventory[activeCategory].map((item, index) => (
                <div key={item.id || index} className="variant-card" onClick={() => handleItemSelect(item)}>
                  <div className="variant-thumbnail">
                    <div className="placeholder-icon">{getCategoryIcon(activeCategory)}</div>
                  </div>
                  <div className="variant-info">
                    <h4 className="variant-name">{item.name}</h4>
                    <p className="variant-id">ID: {item.id || 'N/A'}</p>
                    <span className="model-badge">{item.model || 'model.glb'}</span>
                    <button className="use-variant-btn">
                      {selectedObject ? '🔄 Replace Selected' : '➕ Add to Scene'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="section-title">
              {categories.find(c => c.key === activeCategory)?.label || 'Items'} - List View
            </h3>
            {inventory && inventory[activeCategory] && Array.isArray(inventory[activeCategory]) && inventory[activeCategory].map((item, index) => (
              <div key={item.id || index} className="default-item-card" onClick={() => handleItemSelect(item)}>
                <div className="item-thumbnail">
                  {getCategoryIcon(activeCategory)}
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="model-path">{item.model || 'model.glb'}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="inventory-footer">
        <div className="instruction-row">
          <div className="instruction-item">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {selectedObject 
              ? '🔄 Click any item to REPLACE selected object (keeps position & size)' 
              : '➕ Click any item to ADD new furniture to the scene'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPanelEnhanced;
