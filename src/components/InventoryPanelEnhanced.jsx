import { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryPanelEnhanced.css';

const InventoryPanelEnhanced = ({ selectedObject, onReplaceObject }) => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('chairs');
  const [showVariants, setShowVariants] = useState(false);

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

  const handleItemClick = (item, category) => {
    if (onReplaceObject) {
      onReplaceObject({
        ...item,
        category: category.replace('s', '') // Convert 'chairs' to 'chair'
      });
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
      <div className="inventory-panel-enhanced">
        <div className="inventory-loading">
          <div className="loading-spinner"></div>
          <p>Loading furniture library...</p>
        </div>
      </div>
    );
  }

  const categoryData = inventory[activeCategory];

  return (
    <div className="inventory-panel-enhanced">
      <div className="inventory-header">
        <h2>Furniture Library</h2>
        {selectedObject && (
          <div className="selection-badge">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span>Replace Mode: {selectedObject}</span>
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
            {inventory[cat.key]?.options && (
              <span className="variant-count">{inventory[cat.key].options.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Variants Toggle */}
      <div className="view-controls">
        <button
          className={`view-toggle ${!showVariants ? 'active' : ''}`}
          onClick={() => setShowVariants(false)}
        >
          Default
        </button>
        <button
          className={`view-toggle ${showVariants ? 'active' : ''}`}
          onClick={() => setShowVariants(true)}
        >
          All Variants ({categoryData?.options?.length || 0})
        </button>
      </div>

      {/* Items Display */}
      <div className="inventory-content">
        {!showVariants && categoryData?.default && (
          <div className="default-section">
            <h3 className="section-title">Default Selection</h3>
            <div className="default-item-card">
              <div className="item-thumbnail">
                <div className="placeholder-icon">
                  {categories.find(c => c.key === activeCategory)?.icon}
                </div>
              </div>
              <div className="item-details">
                <h4>Default {activeCategory.slice(0, -1)}</h4>
                <p className="model-path">{categoryData.default}</p>
              </div>
            </div>
          </div>
        )}

        {showVariants && categoryData?.options && (
          <div className="variants-section">
            <h3 className="section-title">
              Available Variants
              <span className="variant-badge">{categoryData.options.length} options</span>
            </h3>
            <div className="variants-grid">
              {categoryData.options.map((item, index) => (
                <div
                  key={item.id || index}
                  className="variant-card"
                  onClick={() => handleItemClick(item, activeCategory)}
                >
                  <div className="variant-thumbnail">
                    {item.thumbnail ? (
                      <img 
                        src={`http://localhost:5000${item.thumbnail}`} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="placeholder-icon" style={item.thumbnail ? { display: 'none' } : {}}>
                      {categories.find(c => c.key === activeCategory)?.icon}
                    </div>
                  </div>
                  <div className="variant-info">
                    <h4 className="variant-name">{item.name}</h4>
                    <p className="variant-id">ID: {item.id}</p>
                    <span className="model-badge">.glb</span>
                  </div>
                  <button 
                    className="use-variant-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item, activeCategory);
                    }}
                  >
                    {selectedObject ? (
                      <>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Replace
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="inventory-footer">
        <div className="instruction-row">
          <div className="instruction-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{selectedObject ? 'Replace: Click variant to swap selected object' : 'Add: Click variant to add new furniture'}</span>
          </div>
          <div className="instruction-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Select objects in 3D scene to move or delete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPanelEnhanced;
