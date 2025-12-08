import React, { useState } from 'react';

const FingerprintCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [status, setStatus] = useState('Ready to capture');
  const [error, setError] = useState(null);

  const SECUGEN_API_BASE = 'https://localhost:8000';

  const captureFingerprint = async () => {
    setIsCapturing(true);
    setError(null);
    setStatus('Capturing fingerprint...');

    try {
      // CORS Fix: Remove Content-Type header
      const response = await fetch(`${SECUGEN_API_BASE}/SGIFPCapture`, {
        method: 'POST',
        body: JSON.stringify({
          Timeout: 10000,
          Quality: 50,
          licstr: "",
          templateFormat: 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.ErrorCode === 0) {
        const imageData = result.BMPBase64;
        setCapturedImage(`data:image/bmp;base64,${imageData}`);
        setStatus('Fingerprint captured successfully!');
        downloadImage(imageData);
      } else {
        throw new Error(`Capture failed: ${result.ErrorDescription || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Capture error:', err);
      setError(err.message);
      setStatus('Capture failed');
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadImage = (base64Data) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/bmp' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fingerprint_${new Date().getTime()}.bmp`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setStatus('Fingerprint saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save fingerprint image');
    }
  };

  const clearCapture = () => {
    setCapturedImage(null);
    setStatus('Ready to capture');
    setError(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>SecuGen U20-AP Fingerprint Capture</h2>
      
      <div style={{ 
        padding: '10px', 
        marginBottom: '20px', 
        backgroundColor: error ? '#ffe6e6' : '#e6f3ff',
        border: `1px solid ${error ? '#ff6b6b' : '#4dabf7'}`,
        borderRadius: '4px'
      }}>
        <strong>Status:</strong> {status}
        {error && (
          <div style={{ color: '#d63031', marginTop: '5px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={captureFingerprint}
          disabled={isCapturing}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: isCapturing ? '#95a5a6' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isCapturing ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isCapturing ? 'Capturing...' : 'Capture Fingerprint'}
        </button>

        {capturedImage && (
          <button
            onClick={clearCapture}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {capturedImage && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Captured Fingerprint:</h3>
          <img
            src={capturedImage}
            alt="Captured fingerprint"
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              border: '2px solid #007bff',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
          <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            Image automatically saved to your Downloads folder
          </p>
        </div>
      )}
    </div>
  );
};

export default FingerprintCapture;
