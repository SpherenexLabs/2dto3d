import { useState } from 'react';
import { Home, Save, RotateCcw } from 'lucide-react';
import logo from './assets/newlogo2.png';
import './App.css';
import LandingPage from './components/LandingPage';
import ImageUpload from './components/ImageUpload';
import Scene3DEnhanced from './components/Scene3DEnhanced';
import LoadingAnimation from './components/LoadingAnimation';
import InventoryPanelEnhanced from './components/InventoryPanelEnhanced';
import SaveSceneDialog from './components/SaveSceneDialog';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [sceneObjects, setSceneObjects] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleTemplateMatch = (matchedTemplate) => {
    console.log('handleTemplateMatch called with:', matchedTemplate);
    setIsLoading(true);
    // Store template and objects immediately but keep loading state
    setTemplate(matchedTemplate);
    setSceneObjects(matchedTemplate.objects);
    console.log('Template set:', matchedTemplate);
    console.log('Objects set:', matchedTemplate.objects);
  };

  const handleLoadingComplete = () => {
    console.log('Loading animation complete');
    setIsLoading(false);
  };

  const handleObjectSelect = (objectKey) => {
    setSelectedObject(objectKey);
  };

  const handleReplaceObject = (newItem) => {
    if (!sceneObjects) return;

    const updatedObjects = { ...sceneObjects };

    // If object is selected, replace it while preserving position, rotation, and scale
    if (selectedObject && updatedObjects[selectedObject]) {
      const existingObject = updatedObjects[selectedObject];
      updatedObjects[selectedObject] = {
        ...existingObject, // Keep all existing properties (position, rotation, scale, etc.)
        model: newItem.model || newItem.id, // Only update the model
        type: newItem.category ? newItem.category.replace(/s$/, '') : existingObject.type // Update type if provided
      };
      console.log(`Replaced ${selectedObject} with ${newItem.name}, preserving structure:`, updatedObjects[selectedObject]);
      setSceneObjects(updatedObjects);
      setSelectedObject(null);
    } 
    // If no object selected, add new object to scene
    else {
      // Generate unique key for new object
      let category = newItem.category || 'object';
      
      // Ensure category is singular (remove trailing 's' if present)
      if (category.endsWith('s') && category.length > 1) {
        category = category.slice(0, -1); // 'chairs' -> 'chair', 'sofas' -> 'sofa'
      }
      
      const existingKeys = Object.keys(updatedObjects).filter(key => key.startsWith(category));
      const nextIndex = existingKeys.length + 1;
      const newKey = `${category}${nextIndex}`;

      // Add new object at a random position with appropriate Y position based on category
      const randomX = (Math.random() - 0.5) * 6; // -3 to 3
      const randomZ = (Math.random() - 0.5) * 6; // -3 to 3
      
      // Set appropriate Y position based on category (furniture sits on floor, lights hang from ceiling)
      let yPosition = 0;
      if (category === 'light') {
        yPosition = 0; // Lights are positioned with their base at ground, bulb extends upward
      } else {
        yPosition = 0; // All furniture sits on the floor
      }
      
      console.log(`Adding new object: ${newKey} at position [${randomX}, ${yPosition}, ${randomZ}] with model: ${newItem.model || newItem.id}`);
      
      updatedObjects[newKey] = {
        position: [randomX, yPosition, randomZ],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        model: newItem.model || newItem.id,
        type: category,
        component: newItem.component || 'ModernChair' // Default component
      };
      
      setSceneObjects(updatedObjects);
      setSelectedObject(newKey); // Auto-select the new object
    }
  };

  const handleSaveScene = (sceneData) => {
    setShowSaveDialog(true);
  };

  const handleSaveSuccess = (savedData) => {
    console.log('Scene saved successfully:', savedData);
  };

  const handleDeleteObject = (objectKey) => {
    if (!sceneObjects) return;
    
    const updatedObjects = { ...sceneObjects };
    delete updatedObjects[objectKey];
    setSceneObjects(updatedObjects);
    setSelectedObject(null);
  };

  const handleMoveObject = (objectKey, newPosition) => {
    if (!sceneObjects || !sceneObjects[objectKey]) return;
    
    const updatedObjects = { ...sceneObjects };
    updatedObjects[objectKey] = {
      ...updatedObjects[objectKey],
      position: newPosition
    };
    setSceneObjects(updatedObjects);
  };

  const handleReset = () => {
    setTemplate(null);
    setSceneObjects(null);
    setSelectedObject(null);
    setIsLoading(false);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section" onClick={() => setShowLanding(true)} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="PlanNex3D" className="logo-image" />
          </div>
          {template && (
            <div className="header-actions">
              <button onClick={() => setShowSaveDialog(true)} className="header-btn save-btn">
                <Save size={18} />
                <span>Save</span>
              </button>
              <button onClick={handleReset} className="header-btn reset-btn">
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!template && !isLoading && (
          <div className="upload-section">
            <ImageUpload onTemplateMatch={handleTemplateMatch} />
          </div>
        )}

        {isLoading && (
          <div className="loading-section">
            <LoadingAnimation onComplete={handleLoadingComplete} />
          </div>
        )}

        {template && !isLoading && (
          <div className="workspace">
            <div className="scene-container">
              <Scene3DEnhanced
                template={template}
                objects={sceneObjects}
                selectedObject={selectedObject}
                onObjectSelect={handleObjectSelect}
                onSaveScene={handleSaveScene}
                onDeleteObject={handleDeleteObject}
                onMoveObject={handleMoveObject}
              />
            </div>

            <div className="inventory-container">
              <InventoryPanelEnhanced
                selectedObject={selectedObject}
                onReplaceObject={handleReplaceObject}
              />
            </div>
          </div>
        )}
      </main>

      <SaveSceneDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        sceneData={{
          template_id: template?.id,
          template_name: template?.name,
          objects: sceneObjects
        }}
        onSaveSuccess={handleSaveSuccess}
      />

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 PlanNex3D. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
