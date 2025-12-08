// import React, { useState, useRef, useEffect } from 'react';
// import { Upload, Play, Pause, CheckCircle, PlusCircle, XCircle, Trash2, Music, X, Loader, Wifi, WifiOff } from 'lucide-react';

// // Firebase imports
// import { initializeApp } from 'firebase/app';
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
// import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { getDatabase, ref as dbRef, onValue, off } from 'firebase/database';

// // Firebase configuration - REPLACE WITH YOUR ACTUAL CONFIG
// // Get this from: Firebase Console → Project Settings → General → Your apps → Web app
// const firebaseConfig = {
//   apiKey: "AIzaSyAOFbpbOwdren9NlNtWvRVyf4DsDf9-2H4",
//   authDomain: "procart-8d2f6.firebaseapp.com",
//   databaseURL: "https://procart-8d2f6-default-rtdb.firebaseio.com",
//   projectId: "procart-8d2f6",
//   storageBucket: "procart-8d2f6.firebasestorage.app",
//   messagingSenderId: "1026838026898",
//   appId: "1:1026838026898:web:56b3889e347862ca37a44b",
//   measurementId: "G-RW7V299RPY"
// };

// // Check if Firebase is properly configured
// const isFirebaseConfigured = () => {
//   return !firebaseConfig.apiKey.includes('your-') && 
//          !firebaseConfig.projectId.includes('your-') &&
//          !firebaseConfig.appId.includes('your-');
// };

// // Only initialize Firebase if properly configured
// let app, storage, auth, database;
// if (isFirebaseConfigured()) {
//   try {
//     app = initializeApp(firebaseConfig);
//     storage = getStorage(app);
//     auth = getAuth(app);
//     database = getDatabase(app);
//   } catch (error) {
//     console.error('Firebase initialization failed:', error);
//   }
// }

// const AudioPlayerApp = () => {
//   // Constants
//   const SELECTION_LIMIT = 7;
  
//   // State
//   const [audioFiles, setAudioFiles] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [position, setPosition] = useState(0);
//   const [currentFileName, setCurrentFileName] = useState(null);
//   const [activeTab, setActiveTab] = useState('library');
//   const [isLoading, setIsLoading] = useState(true);
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [user, setUser] = useState(null);
  
//   // New state for Firebase detection
//   const [isDetectionConnected, setIsDetectionConnected] = useState(false);
//   const [lastDetection, setLastDetection] = useState(null);
//   const [animalData, setAnimalData] = useState(null);
//   const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  
//   // Sequential auto-play state
//   const [sequentialPlayEnabled, setSequentialPlayEnabled] = useState(false);
//   const [currentSequentialIndex, setCurrentSequentialIndex] = useState(0);
  
//   // Refs
//   const audioRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const detectionListenerRef = useRef(null);
  
//   // Re-setup detection listener when selectedFiles or autoPlayEnabled changes
//   useEffect(() => {
//     if (user && !user.isLocal && isFirebaseConfigured() && database) {
//       console.log('Re-setting up detection listener due to dependency change');
//       console.log('Selected files:', selectedFiles.length);
//       console.log('Auto-play enabled:', autoPlayEnabled);
      
//       // Clean up existing listener
//       if (detectionListenerRef.current) {
//         off(detectionListenerRef.current);
//       }
      
//       // Setup new listener with current dependencies
//       setupDetectionListener();
//     }
//   }, [selectedFiles, autoPlayEnabled]); // Re-run when these change
//   useEffect(() => {
//     if (!isFirebaseConfigured()) {
//       // Show configuration warning
//       showToast('⚠️ Firebase not configured. Using local storage mode.', '#f59e0b');
//       setUser({ uid: 'local-user', isLocal: true });
//       setAudioFiles([]);
//       setIsLoading(false);
//       return;
//     }

//     if (!auth) {
//       showToast('Firebase initialization failed. Using local storage.', '#ef4444');
//       setUser({ uid: 'local-user', isLocal: true });
//       setAudioFiles([]);
//       setIsLoading(false);
//       return;
//     }

//     // Firebase is properly configured
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//         loadAudioFilesFromFirebase(user.uid);
//         setupDetectionListener(); // Setup the detection listener
//       } else {
//         // Try anonymous sign-in
//         signInAnonymously(auth).catch((error) => {
//           console.error('Anonymous sign-in failed:', error);
//           let message = 'Authentication failed. ';
          
//           if (error.code === 'auth/admin-restricted-operation') {
//             message += 'Enable Anonymous Authentication in Firebase Console.';
//           } else {
//             message += 'Using local session.';
//           }
          
//           showToast(message, '#f59e0b');
          
//           // Fallback to local session
//           const localUser = { 
//             uid: localStorage.getItem('audio-app-user-id') || 'user-' + Date.now(),
//             isLocal: true 
//           };
//           localStorage.setItem('audio-app-user-id', localUser.uid);
//           setUser(localUser);
//           setAudioFiles([]); // Start with empty files for local mode
//           setIsLoading(false);
//         });
//       }
//     });
    
//     return () => {
//       unsubscribe();
//       // Clean up detection listener
//       if (detectionListenerRef.current) {
//         off(detectionListenerRef.current);
//       }
//     };
//   }, []);

//   // Setup Firebase Realtime Database listener for animal detection
//   const setupDetectionListener = () => {
//     if (!database) {
//       console.warn('Firebase Realtime Database not available');
//       return;
//     }

//     try {
//       const animalRef = dbRef(database, 'Animal');
//       detectionListenerRef.current = animalRef;
      
//       onValue(animalRef, (snapshot) => {
//         const data = snapshot.val();
//         console.log('Firebase detection data received:', data);
//         console.log('Current selectedFiles length:', selectedFiles.length);
//         console.log('Current autoPlayEnabled:', autoPlayEnabled);
//         console.log('Current lastDetection:', lastDetection);
        
//         if (data) {
//           setAnimalData(data);
//           setIsDetectionConnected(true);
          
//           const currentDetection = data.detection;
//           console.log('Detection value:', currentDetection);
          
//           // Check if we should trigger auto-play
//           const shouldAutoPlay = autoPlayEnabled && 
//                                 currentDetection !== lastDetection && 
//                                 currentDetection >= 1 && 
//                                 currentDetection <= SELECTION_LIMIT &&
//                                 selectedFiles.length > 0;
          
//           console.log('Should auto-play?', shouldAutoPlay);
          
//           if (shouldAutoPlay) {
//             const fileIndex = currentDetection - 1; // Convert to 0-based index
//             console.log('File index to play:', fileIndex);
            
//             if (fileIndex < selectedFiles.length) {
//               const fileToPlay = selectedFiles[fileIndex];
//               console.log(`Triggering auto-play for file ${currentDetection}: ${fileToPlay.name}`);
              
//               // Use setTimeout to ensure state updates and DOM are ready
//               setTimeout(() => {
//                 playAudioByData(fileToPlay);
//                 showToast(
//                   `Auto-playing: ${fileToPlay.name} (Detection ${currentDetection})`,
//                   '#10b981'
//                 );
//               }, 200);
//             } else {
//               console.warn(`Detection ${currentDetection} but only ${selectedFiles.length} files selected`);
//               showToast(
//                 `Detection ${currentDetection} received, but only ${selectedFiles.length} files in selection`,
//                 '#f59e0b'
//               );
//             }
//           } else {
//             console.log('Auto-play conditions not met:', {
//               autoPlayEnabled,
//               detectionChanged: currentDetection !== lastDetection,
//               validRange: currentDetection >= 1 && currentDetection <= SELECTION_LIMIT,
//               hasFiles: selectedFiles.length > 0
//             });
//           }
          
//           setLastDetection(currentDetection);
//         } else {
//           setIsDetectionConnected(false);
//           console.log('No animal data received');
//         }
//       }, (error) => {
//         console.error('Error listening to animal detection:', error);
//         setIsDetectionConnected(false);
//         showToast('Failed to connect to detection system', '#ef4444');
//       });
      
//       showToast('Connected to animal detection system', '#10b981');
      
//     } catch (error) {
//       console.error('Error setting up detection listener:', error);
//       showToast('Error setting up detection listener', '#ef4444');
//     }
//   };
  
//   // Load audio files from Firebase Storage or local storage
//   const loadAudioFilesFromFirebase = async (userId) => {
//     if (!userId || !isFirebaseConfigured() || !storage) {
//       // Use local storage mode
//       loadAudioFilesFromLocal();
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const audioRef = ref(storage, `audio-files/${userId}`);
//       const result = await listAll(audioRef);
      
//       const files = await Promise.all(
//         result.items.map(async (itemRef) => {
//           const url = await getDownloadURL(itemRef);
//           return {
//             id: itemRef.name,
//             name: itemRef.name,
//             url: url,
//             firebaseRef: itemRef,
//             isFirebaseFile: true
//           };
//         })
//       );
      
//       setAudioFiles(files);
      
//       // Clean up selection if any files were removed
//       setSelectedFiles(prev => 
//         prev.filter(sel => 
//           files.some(file => isSameFile(file, sel))
//         )
//       );
      
//     } catch (error) {
//       console.error('Error loading files from Firebase:', error);
      
//       // Handle specific Firebase errors
//       if (error.code === 'storage/unauthorized') {
//         showToast('Storage access denied. Check Firebase Storage rules.', '#ef4444');
//       } else if (error.code === 'storage/object-not-found') {
//         // This is normal for first-time users - no files exist yet
//         setAudioFiles([]);
//       } else {
//         showToast('Firebase storage error. Switching to local mode.', '#f59e0b');
//         loadAudioFilesFromLocal();
//         return;
//       }
//     }
//     setIsLoading(false);
//   };

//   // Load audio files from local storage (fallback)
//   const loadAudioFilesFromLocal = () => {
//     try {
//       const savedFiles = JSON.parse(localStorage.getItem('audio-files') || '[]');
//       // Filter out any files that no longer exist
//       const validFiles = savedFiles.filter(file => file.url && file.name);
//       setAudioFiles(validFiles);
//     } catch (error) {
//       console.error('Error loading local files:', error);
//       setAudioFiles([]);
//     }
//     setIsLoading(false);
//   };

//   // Save audio files to local storage
//   const saveAudioFilesToLocal = (files) => {
//     try {
//       localStorage.setItem('audio-files', JSON.stringify(files));
//     } catch (error) {
//       console.error('Error saving to local storage:', error);
//     }
//   };
  
//   // Audio event handlers
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;
    
//     const handleLoadedMetadata = () => {
//       setDuration(audio.duration || 0);
//     };
    
//     const handleTimeUpdate = () => {
//       setPosition(audio.currentTime || 0);
//     };
    
//     const handleEnded = () => {
//       setIsPlaying(false);
//       setPosition(0);
      
//       // Check if sequential auto-play is enabled and there are more files
//       if (sequentialPlayEnabled && selectedFiles.length > 0) {
//         const nextIndex = (currentSequentialIndex + 1) % selectedFiles.length;
//         setCurrentSequentialIndex(nextIndex);
        
//         // Play next file after a short delay
//         setTimeout(() => {
//           const nextFile = selectedFiles[nextIndex];
//           if (nextFile) {
//             playAudioByData(nextFile);
//             showToast(
//               `Auto-playing next: ${nextFile.name} (${nextIndex + 1}/${selectedFiles.length})`,
//               '#10b981'
//             );
//           }
//         }, 500);
//       } else {
//         setCurrentlyPlayingIndex(null);
//         setCurrentFileName(null);
//         setCurrentSequentialIndex(0);
//       }
//     };
    
//     const handlePlay = () => setIsPlaying(true);
//     const handlePause = () => setIsPlaying(false);
    
//     audio.addEventListener('loadedmetadata', handleLoadedMetadata);
//     audio.addEventListener('timeupdate', handleTimeUpdate);
//     audio.addEventListener('ended', handleEnded);
//     audio.addEventListener('play', handlePlay);
//     audio.addEventListener('pause', handlePause);
    
//     return () => {
//       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       audio.removeEventListener('timeupdate', handleTimeUpdate);
//       audio.removeEventListener('ended', handleEnded);
//       audio.removeEventListener('play', handlePlay);
//       audio.removeEventListener('pause', handlePause);
//     };
//   }, []);
  
//   // Helper functions
//   const formatDuration = (seconds) => {
//     if (!seconds || seconds === Infinity || isNaN(seconds)) return '00:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };
  
//   const isAudioFile = (file) => {
//     const audioTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/flac', 'audio/ogg', 'audio/mpeg'];
//     return audioTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|aac|flac|ogg)$/i);
//   };
  
//   const isSameFile = (a, b) => {
//     return a.id === b.id || a.name === b.name;
//   };
  
//   const isInSelection = (file) => {
//     return selectedFiles.some(selectedFile => isSameFile(selectedFile, file));
//   };
  
//   // Toast notification function
//   const showToast = (message, backgroundColor = '#10b981') => {
//     const toast = document.createElement('div');
//     toast.textContent = message;
//     toast.style.cssText = `
//       position: fixed; top: 20px; right: 20px; z-index: 1000;
//       background: ${backgroundColor}; color: white; padding: 12px 20px;
//       border-radius: 8px; font-size: 14px; font-weight: 500;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//       max-width: 300px; word-wrap: break-word;
//     `;
//     document.body.appendChild(toast);
//     setTimeout(() => {
//       if (document.body.contains(toast)) {
//         document.body.removeChild(toast);
//       }
//     }, 4000);
//   };
  
//   // File upload handler with Firebase Storage and local fallback
//   const handleFileUpload = async (event) => {
//     if (!user) {
//       showToast('Please wait for initialization...', '#f59e0b');
//       return;
//     }
    
//     const files = Array.from(event.target.files);
//     const audioOnlyFiles = files.filter(isAudioFile);
    
//     if (audioOnlyFiles.length === 0) {
//       showToast('Please select valid audio files.', '#ef4444');
//       return;
//     }
    
//     // Reset file input
//     event.target.value = '';
    
//     // Check if using Firebase or local storage
//     if (user.isLocal || !isFirebaseConfigured() || !storage) {
//       // Upload to local storage
//       audioOnlyFiles.forEach(file => {
//         const fileId = `${Date.now()}-${Math.random()}`;
//         const fileData = {
//           id: fileId,
//           name: file.name,
//           url: URL.createObjectURL(file),
//           size: file.size,
//           isFirebaseFile: false,
//           file: file // Keep reference for local files
//         };
        
//         setAudioFiles(prev => {
//           const newFiles = [...prev, fileData];
//           saveAudioFilesToLocal(newFiles);
//           return newFiles;
//         });
//       });
      
//       const message = audioOnlyFiles.length === 1 
//         ? 'Audio file stored locally!' 
//         : `${audioOnlyFiles.length} audio files stored locally!`;
//       showToast(message, '#10b981');
//       return;
//     }
    
//     // Upload files to Firebase Storage
//     for (const file of audioOnlyFiles) {
//       const fileId = `${Date.now()}-${file.name}`;
//       const storageRef = ref(storage, `audio-files/${user.uid}/${fileId}`);
      
//       try {
//         // Show upload progress
//         setUploadProgress(prev => ({
//           ...prev,
//           [fileId]: { name: file.name, progress: 0 }
//         }));
        
//         // Upload file
//         await uploadBytes(storageRef, file);
//         const downloadURL = await getDownloadURL(storageRef);
        
//         // Add to local state
//         const fileData = {
//           id: fileId,
//           name: file.name,
//           url: downloadURL,
//           firebaseRef: storageRef,
//           isFirebaseFile: true
//         };
        
//         setAudioFiles(prev => [...prev, fileData]);
        
//         // Remove from upload progress
//         setUploadProgress(prev => {
//           const newProgress = { ...prev };
//           delete newProgress[fileId];
//           return newProgress;
//         });
        
//         showToast(`${file.name} uploaded to Firebase!`, '#10b981');
        
//       } catch (error) {
//         console.error('Error uploading file:', error);
        
//         let errorMessage = `Error uploading ${file.name}`;
//         if (error.code === 'storage/unauthorized') {
//           errorMessage += ': Storage access denied. Check Firebase rules.';
//         } else if (error.code === 'storage/quota-exceeded') {
//           errorMessage += ': Storage quota exceeded.';
//         } else {
//           errorMessage += `: ${error.message}`;
//         }
        
//         showToast(errorMessage, '#ef4444');
        
//         // Remove from upload progress
//         setUploadProgress(prev => {
//           const newProgress = { ...prev };
//           delete newProgress[fileId];
//           return newProgress;
//         });
//       }
//     }
//   };
  
//   // Audio playback functions
//   const playAudio = async (index) => {
//     const audio = audioRef.current;
//     if (!audio) return;
    
//     try {
//       if (currentlyPlayingIndex === index && !audio.paused) {
//         audio.pause();
//         return;
//       }
      
//       const audioFile = audioFiles[index];
//       if (audio.src !== audioFile.url) {
//         audio.src = audioFile.url;
//         // Add loading state while audio loads
//         showToast('Loading audio...', '#3b82f6');
//       }
      
//       await audio.play();
//       setCurrentlyPlayingIndex(index);
//       setCurrentFileName(audioFile.name);
//     } catch (error) {
//       console.error('Error playing audio:', error);
//       showToast(`Error playing audio: ${error.message}`, '#ef4444');
//     }
//   };
  
//   const playAudioByData = (file) => {
//     const index = audioFiles.findIndex(audioFile => isSameFile(audioFile, file));
//     if (index !== -1) {
//       playAudio(index);
      
//       // Update sequential index if playing from selection
//       const selectedIndex = selectedFiles.findIndex(selectedFile => isSameFile(selectedFile, file));
//       if (selectedIndex !== -1) {
//         setCurrentSequentialIndex(selectedIndex);
//       }
//     } else {
//       showToast('File not found in library.', '#ef4444');
//     }
//   };

//   // Start sequential playback
//   const startSequentialPlay = () => {
//     if (selectedFiles.length === 0) {
//       showToast('Add files to selection first', '#f59e0b');
//       return;
//     }
    
//     setSequentialPlayEnabled(true);
//     setCurrentSequentialIndex(0);
    
//     const firstFile = selectedFiles[0];
//     playAudioByData(firstFile);
//     showToast(
//       `Started sequential playback: ${firstFile.name} (1/${selectedFiles.length})`,
//       '#10b981'
//     );
//   };

//   // Stop sequential playback
//   const stopSequentialPlay = () => {
//     setSequentialPlayEnabled(false);
//     setCurrentSequentialIndex(0);
//     stopAudio();
//     showToast('Sequential playback stopped', '#f59e0b');
//   };
  
//   const stopAudio = () => {
//     const audio = audioRef.current;
//     if (!audio) return;
    
//     audio.pause();
//     audio.currentTime = 0;
//     setCurrentlyPlayingIndex(null);
//     setCurrentFileName(null);
//     setPosition(0);
//     setIsPlaying(false);
//   };
  
//   const handleSeek = (event) => {
//     const audio = audioRef.current;
//     if (!audio || duration === 0) return;
    
//     const rect = event.currentTarget.getBoundingClientRect();
//     const percentage = (event.clientX - rect.left) / rect.width;
//     const newTime = percentage * duration;
    
//     audio.currentTime = Math.max(0, Math.min(newTime, duration));
//   };
  
//   // Selection management
//   const toggleSelection = (file) => {
//     const isSelected = isInSelection(file);
    
//     if (isSelected) {
//       setSelectedFiles(prev => prev.filter(selectedFile => !isSameFile(selectedFile, file)));
//     } else {
//       if (selectedFiles.length >= SELECTION_LIMIT) {
//         showToast(`Selection limit is ${SELECTION_LIMIT} files.`, '#6b7280');
//         return;
//       }
//       setSelectedFiles(prev => [...prev, file]);
//     }
//   };
  
//   const clearSelection = () => {
//     setSelectedFiles([]);
//   };
  
//   // Delete file from Firebase Storage or local storage
//   const deleteAudioFile = async (index) => {
//     if (currentlyPlayingIndex === index) {
//       stopAudio();
//     }
    
//     const fileToDelete = audioFiles[index];
    
//     try {
//       // Delete from Firebase Storage if it's a Firebase file
//       if (fileToDelete.isFirebaseFile && fileToDelete.firebaseRef && storage) {
//         await deleteObject(fileToDelete.firebaseRef);
//       }
      
//       // If it's a local file, revoke the URL
//       if (!fileToDelete.isFirebaseFile && fileToDelete.url) {
//         URL.revokeObjectURL(fileToDelete.url);
//       }
      
//       // Remove from local state
//       const newFiles = audioFiles.filter((_, i) => i !== index);
//       setAudioFiles(newFiles);
      
//       // Update local storage if in local mode
//       if (user?.isLocal) {
//         saveAudioFilesToLocal(newFiles);
//       }
      
//       // Remove from selection if present
//       setSelectedFiles(prev => prev.filter(selectedFile => !isSameFile(selectedFile, fileToDelete)));
      
//       // Update current playing index if needed
//       if (currentlyPlayingIndex !== null && currentlyPlayingIndex > index) {
//         setCurrentlyPlayingIndex(prev => prev - 1);
//       }
      
//       showToast('Audio file deleted successfully!', '#f59e0b');
//     } catch (error) {
//       console.error('Error deleting file:', error);
//       showToast(`Error deleting file: ${error.message}`, '#ef4444');
//     }
//   };
  
//   // Styles (same as before but with detection status)
//   const styles = {
//     container: {
//       minHeight: '100vh',
//       backgroundColor: '#f9fafb',
//       fontFamily: 'system-ui, -apple-system, sans-serif'
//     },
//     header: {
//       backgroundColor: '#1d4ed8',
//       color: 'white',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//     },
//     headerContent: {
//       maxWidth: '1024px',
//       margin: '0 auto',
//       padding: '16px'
//     },
//     headerTop: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between'
//     },
//     title: {
//       fontSize: '20px',
//       fontWeight: 'bold',
//       margin: 0
//     },
//     headerRight: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '16px'
//     },
//     detectionStatus: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       fontSize: '14px',
//       fontWeight: '500'
//     },
//     selectionCounter: {
//       fontSize: '14px',
//       fontWeight: '600'
//     },
//     tabs: {
//       display: 'flex',
//       marginTop: '16px',
//       borderBottom: '1px solid #3b82f6'
//     },
//     tab: {
//       padding: '8px 24px',
//       fontWeight: '500',
//       backgroundColor: 'transparent',
//       border: 'none',
//       cursor: 'pointer',
//       transition: 'color 0.2s'
//     },
//     tabActive: {
//       borderBottom: '2px solid white',
//       color: 'white'
//     },
//     tabInactive: {
//       color: '#bfdbfe'
//     },
//     main: {
//       maxWidth: '1024px',
//       margin: '0 auto'
//     },
//     detectionInfo: {
//       margin: '16px',
//       padding: '16px',
//       backgroundColor: isDetectionConnected ? '#f0f9ff' : '#fef3c7',
//       border: `1px solid ${isDetectionConnected ? '#0ea5e9' : '#f59e0b'}`,
//       borderRadius: '8px'
//     },
//     detectionHeader: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: '12px'
//     },
//     detectionTitle: {
//       fontWeight: 'bold',
//       color: isDetectionConnected ? '#0369a1' : '#92400e'
//     },
//     autoPlayToggle: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       color: '#6b7280',
//       fontSize: '14px'
//     },
//     toggleSwitch: {
//       width: '40px',
//       height: '20px',
//       borderRadius: '10px',
//       backgroundColor: autoPlayEnabled ? '#10b981' : '#d1d5db',
//       border: 'none',
//       cursor: 'pointer',
//       position: 'relative',
//       transition: 'background-color 0.2s'
//     },
//     toggleKnob: {
//       width: '16px',
//       height: '16px',
//       borderRadius: '50%',
//       backgroundColor: 'white',
//       position: 'absolute',
//       top: '2px',
//       left: autoPlayEnabled ? '22px' : '2px',
//       transition: 'left 0.2s'
//     },
//     detectionData: {
//       fontSize: '14px',
//       color: isDetectionConnected ? '#1e40af' : '#92400e',
//       lineHeight: '1.5'
//     },
//     uploadSection: {
//       padding: '16px'
//     },
//     uploadButton: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '8px',
//       backgroundColor: '#2563eb',
//       color: 'white',
//       padding: '12px 24px',
//       border: 'none',
//       borderRadius: '8px',
//       fontSize: '16px',
//       fontWeight: '500',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s',
//       width: '100%'
//     },
//     uploadProgress: {
//       margin: '16px',
//       padding: '16px',
//       backgroundColor: '#eff6ff',
//       border: '1px solid #bfdbfe',
//       borderRadius: '8px'
//     },
//     uploadProgressItem: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px',
//       marginBottom: '8px'
//     },
//     loadingSpinner: {
//       animation: 'spin 1s linear infinite'
//     },
//     nowPlaying: {
//       margin: '0 16px 16px 16px',
//       backgroundColor: '#eff6ff',
//       border: '1px solid #bfdbfe',
//       borderRadius: '12px',
//       padding: '24px'
//     },
//     nowPlayingTitle: {
//       textAlign: 'center',
//       marginBottom: '16px'
//     },
//     nowPlayingTitleText: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#1d4ed8',
//       marginBottom: '8px'
//     },
//     nowPlayingFile: {
//       color: '#374151',
//       fontWeight: '500'
//     },
//     progressContainer: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px',
//       marginBottom: '16px'
//     },
//     timeDisplay: {
//       fontSize: '14px',
//       color: '#6b7280',
//       minWidth: '45px'
//     },
//     progressBar: {
//       flex: 1,
//       height: '8px',
//       backgroundColor: '#e5e7eb',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       position: 'relative',
//       overflow: 'hidden'
//     },
//     progressFill: {
//       height: '100%',
//       backgroundColor: '#2563eb',
//       borderRadius: '4px',
//       transition: 'width 0.1s ease'
//     },
//     controls: {
//       display: 'flex',
//       justifyContent: 'center',
//       gap: '16px'
//     },
//     controlButton: {
//       padding: '12px',
//       borderRadius: '50%',
//       border: 'none',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     stopButton: {
//       backgroundColor: '#e5e7eb'
//     },
//     playButton: {
//       backgroundColor: '#2563eb',
//       color: 'white'
//     },
//     stopIcon: {
//       width: '24px',
//       height: '24px',
//       backgroundColor: '#374151',
//       borderRadius: '2px'
//     },
//     tabContent: {
//       backgroundColor: 'white',
//       borderRadius: '12px 12px 0 0',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//       minHeight: '400px'
//     },
//     emptyState: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '256px',
//       color: '#6b7280'
//     },
//     emptyStateIcon: {
//       marginBottom: '16px',
//       color: '#9ca3af'
//     },
//     emptyStateTitle: {
//       fontSize: '18px',
//       fontWeight: '500',
//       marginBottom: '8px'
//     },
//     emptyStateSubtitle: {
//       fontSize: '14px'
//     },
//     fileList: {
//       padding: '16px',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '8px'
//     },
//     fileItem: {
//       backgroundColor: 'white',
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//       padding: '16px',
//       border: '1px solid #e5e7eb',
//       transition: 'box-shadow 0.2s'
//     },
//     fileContent: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '16px'
//     },
//     playButton2: {
//       width: '48px',
//       height: '48px',
//       borderRadius: '50%',
//       border: 'none',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: 'white',
//       transition: 'opacity 0.2s'
//     },
//     fileInfo: {
//       flex: 1,
//       minWidth: 0
//     },
//     fileName: {
//       fontWeight: '500',
//       margin: 0,
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       whiteSpace: 'nowrap'
//     },
//     fileSubtitle: {
//       fontSize: '12px',
//       color: '#6b7280',
//       margin: '4px 0 0 0'
//     },
//     fileActions: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     actionButton: {
//       padding: '8px',
//       borderRadius: '50%',
//       border: 'none',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s',
//       backgroundColor: 'transparent'
//     },
//     selectionHeader: {
//       padding: '16px 16px 0 16px',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     selectionHeaderText: {
//       fontSize: '14px',
//       color: '#6b7280'
//     },
//     clearButton: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '4px',
//       color: '#2563eb',
//       backgroundColor: 'transparent',
//       border: 'none',
//       padding: '4px 12px',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s'
//     },
//     playlistIcon: {
//       width: '56px',
//       height: '56px',
//       marginBottom: '12px',
//       color: '#9ca3af',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     playlistIconContent: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '4px'
//     },
//     playlistIconRow: {
//       display: 'flex',
//       gap: '4px'
//     },
//     playlistIconBar1: {
//       width: '4px',
//       height: '12px',
//       backgroundColor: '#9ca3af',
//       borderRadius: '1px'
//     },
//     playlistIconBar2: {
//       width: '24px',
//       height: '12px',
//       backgroundColor: '#9ca3af',
//       borderRadius: '1px'
//     },
//     playlistIconBar3: {
//       width: '32px',
//       height: '12px',
//       backgroundColor: '#9ca3af',
//       borderRadius: '1px'
//     },
//     playlistIconBar4: {
//       width: '16px',
//       height: '12px',
//       backgroundColor: '#9ca3af',
//       borderRadius: '1px'
//     },
//     loadingContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '256px',
//       gap: '16px'
//     }
//   };
  
//   // Add spinner animation
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);
  
//   // Render functions
//   const renderLibraryList = () => {
//     if (isLoading) {
//       return (
//         <div style={styles.loadingContainer}>
//           <Loader size={48} style={styles.loadingSpinner} />
//           <p>Loading your audio library...</p>
//         </div>
//       );
//     }
    
//     if (audioFiles.length === 0) {
//       return (
//         <div style={styles.emptyState}>
//           <Music size={64} style={styles.emptyStateIcon} />
//           <h3 style={styles.emptyStateTitle}>No audio files found</h3>
//           <p style={styles.emptyStateSubtitle}>Upload some audio files to get started</p>
//         </div>
//       );
//     }
    
//     return (
//       <div style={styles.fileList}>
//         {audioFiles.map((file, index) => {
//           const isCurrentlyPlaying = currentlyPlayingIndex === index;
//           const isSelected = isInSelection(file);
//           const canAddMore = selectedFiles.length < SELECTION_LIMIT || isSelected;
          
//           return (
//             <div
//               key={file.id}
//               style={{
//                 ...styles.fileItem,
//                 boxShadow: isCurrentlyPlaying ? '0 4px 12px rgba(37, 99, 235, 0.2)' : styles.fileItem.boxShadow
//               }}
//               onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'}
//               onMouseLeave={(e) => e.target.style.boxShadow = isCurrentlyPlaying ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'}
//             >
//               <div style={styles.fileContent}>
//                 <button
//                   onClick={() => playAudio(index)}
//                   style={{
//                     ...styles.playButton2,
//                     backgroundColor: isCurrentlyPlaying ? '#2563eb' : '#9ca3af'
//                   }}
//                   onMouseEnter={(e) => e.target.style.opacity = '0.8'}
//                   onMouseLeave={(e) => e.target.style.opacity = '1'}
//                 >
//                   {isCurrentlyPlaying && isPlaying ? (
//                     <Pause size={20} />
//                   ) : (
//                     <Play size={20} />
//                   )}
//                 </button>
                
//                 <div style={styles.fileInfo}>
//                   <h4 style={{
//                     ...styles.fileName,
//                     color: isCurrentlyPlaying ? '#1d4ed8' : '#111827',
//                     fontWeight: isCurrentlyPlaying ? 'bold' : '500'
//                   }}>
//                     {file.name}
//                   </h4>
//                   <p style={styles.fileSubtitle}>
//                     {file.isFirebaseFile 
//                       ? 'Stored in Firebase Cloud' 
//                       : 'Stored locally (session only)'
//                     }
//                   </p>
//                 </div>
                
//                 <div style={styles.fileActions}>
//                   <button
//                     onClick={() => toggleSelection(file)}
//                     disabled={!canAddMore}
//                     style={{
//                       ...styles.actionButton,
//                       color: isSelected ? '#059669' : canAddMore ? '#6b7280' : '#d1d5db',
//                       cursor: canAddMore ? 'pointer' : 'not-allowed'
//                     }}
//                     title={
//                       isSelected
//                         ? 'Remove from selection'
//                         : canAddMore
//                         ? 'Add to selection'
//                         : `Limit reached (${SELECTION_LIMIT})`
//                     }
//                     onMouseEnter={(e) => {
//                       if (canAddMore) e.target.style.backgroundColor = isSelected ? '#ecfdf5' : '#f3f4f6';
//                     }}
//                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                   >
//                     {isSelected ? (
//                       <CheckCircle size={20} />
//                     ) : (
//                       <PlusCircle size={20} />
//                     )}
//                   </button>
                  
//                   <button
//                     onClick={() => deleteAudioFile(index)}
//                     style={{
//                       ...styles.actionButton,
//                       color: '#ef4444'
//                     }}
//                     title="Delete file"
//                     onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
//                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };
  
//   const renderSelectionList = () => {
//     return (
//       <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//         {selectedFiles.length > 0 && (
//           <div style={styles.selectionHeader}>
//             <p style={styles.selectionHeaderText}>Auto-play sequence (Detection 1-{selectedFiles.length})</p>
//             <button
//               onClick={clearSelection}
//               style={styles.clearButton}
//               onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
//               onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//             >
//               <X size={16} />
//               <span>Clear</span>
//             </button>
//           </div>
//         )}
        
//         <div style={{ flex: 1, overflow: 'auto' }}>
//           {selectedFiles.length === 0 ? (
//             <div style={styles.emptyState}>
//               <div style={styles.playlistIcon}>
//                 <div style={styles.playlistIconContent}>
//                   <div style={styles.playlistIconRow}>
//                     <div style={styles.playlistIconBar1}></div>
//                     <div style={styles.playlistIconBar2}></div>
//                   </div>
//                   <div style={styles.playlistIconRow}>
//                     <div style={styles.playlistIconBar1}></div>
//                     <div style={styles.playlistIconBar3}></div>
//                   </div>
//                   <div style={styles.playlistIconRow}>
//                     <div style={styles.playlistIconBar1}></div>
//                     <div style={styles.playlistIconBar4}></div>
//                   </div>
//                 </div>
//               </div>
//               <h3 style={styles.emptyStateTitle}>No files in Selection</h3>
//               <p style={styles.emptyStateSubtitle}>Add files from the Library tab for auto-play</p>
//             </div>
//           ) : (
//             <div style={styles.fileList}>
//               {selectedFiles.map((file, index) => {
//                 const libIndex = audioFiles.findIndex(f => isSameFile(f, file));
//                 const playingHere = libIndex !== -1 && libIndex === currentlyPlayingIndex;
//                 const detectionNumber = index + 1;
//                 const isCurrentDetection = animalData?.detection === detectionNumber;
//                 const isCurrentSequential = sequentialPlayEnabled && currentSequentialIndex === index;
                
//                 return (
//                   <div
//                     key={`selection-${file.id}`}
//                     style={{
//                       ...styles.fileItem,
//                       boxShadow: playingHere ? '0 4px 12px rgba(37, 99, 235, 0.2)' : styles.fileItem.boxShadow,
//                       border: isCurrentDetection 
//                         ? '2px solid #10b981' 
//                         : isCurrentSequential 
//                           ? '2px solid #3b82f6' 
//                           : '1px solid #e5e7eb',
//                       backgroundColor: isCurrentSequential ? '#f0f9ff' : 'white'
//                     }}
//                     onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'}
//                     onMouseLeave={(e) => e.target.style.boxShadow = playingHere ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'}
//                   >
//                     <div style={styles.fileContent}>
//                       <button
//                         onClick={() => playAudioByData(file)}
//                         style={{
//                           ...styles.playButton2,
//                           backgroundColor: playingHere ? '#2563eb' : '#9ca3af'
//                         }}
//                         onMouseEnter={(e) => e.target.style.opacity = '0.8'}
//                         onMouseLeave={(e) => e.target.style.opacity = '1'}
//                       >
//                         {playingHere && isPlaying ? (
//                           <Pause size={20} />
//                         ) : (
//                           <Play size={20} />
//                         )}
//                       </button>
                      
//                       <div style={styles.fileInfo}>
//                         <h4 style={{
//                           ...styles.fileName,
//                           color: playingHere ? '#1d4ed8' : '#111827',
//                           fontWeight: playingHere ? 'bold' : '500'
//                         }}>
//                           {file.name}
//                         </h4>
//                         <p style={styles.fileSubtitle}>
//                           Detection {detectionNumber}
//                           {isCurrentDetection && ' • CURRENT DETECTION'}
//                           {isCurrentSequential && ' • NOW PLAYING IN SEQUENCE'}
//                         </p>
//                       </div>
                      
//                       <button
//                         onClick={() => toggleSelection(file)}
//                         style={{
//                           ...styles.actionButton,
//                           color: '#ef4444'
//                         }}
//                         title="Remove from selection"
//                         onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
//                         onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                       >
//                         <XCircle size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   return (
//     <div style={styles.container}>
//       <audio ref={audioRef} />
      
//       {/* Header */}
//       <header style={styles.header}>
//         <div style={styles.headerContent}>
//           <div style={styles.headerTop}>
//             <h1 style={styles.title}>Audio Player App</h1>
//             <div style={styles.headerRight}>
//               <div style={styles.detectionStatus}>
//                 {isDetectionConnected ? (
//                   <Wifi size={16} />
//                 ) : (
//                   <WifiOff size={16} />
//                 )}
//                 <span>{isDetectionConnected ? 'Connected' : 'Disconnected'}</span>
//               </div>
//               <div style={styles.selectionCounter}>
//                 Selected: {selectedFiles.length}/{SELECTION_LIMIT}
//               </div>
//             </div>
//           </div>
          
//           {/* Tabs */}
//           <div style={styles.tabs}>
//             <button
//               onClick={() => setActiveTab('library')}
//               style={{
//                 ...styles.tab,
//                 ...(activeTab === 'library' ? styles.tabActive : styles.tabInactive)
//               }}
//               onMouseEnter={(e) => {
//                 if (activeTab !== 'library') {
//                   e.target.style.color = 'white';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (activeTab !== 'library') {
//                   e.target.style.color = '#bfdbfe';
//                 }
//               }}
//             >
//               Library
//             </button>
//             <button
//               onClick={() => setActiveTab('selection')}
//               style={{
//                 ...styles.tab,
//                 ...(activeTab === 'selection' ? styles.tabActive : styles.tabInactive)
//               }}
//               onMouseEnter={(e) => {
//                 if (activeTab !== 'selection') {
//                   e.target.style.color = 'white';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (activeTab !== 'selection') {
//                   e.target.style.color = '#bfdbfe';
//                 }
//               }}
//             >
//               Selection
//             </button>
//           </div>
//         </div>
//       </header>
      
//       <main style={styles.main}>
//         {/* Configuration Status Banner */}
//         {!isFirebaseConfigured() && (
//           <div style={{
//             margin: '16px',
//             padding: '16px',
//             backgroundColor: '#fef3c7',
//             border: '1px solid #f59e0b',
//             borderRadius: '8px',
//             fontSize: '14px',
//             lineHeight: '1.5'
//           }}>
//             <div style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
//               🔧 Firebase Setup Required
//             </div>
//             <div style={{ color: '#92400e' }}>
//               Currently running in <strong>local storage mode</strong>. Auto-detection will not work.
//               <br />
//               To enable cloud storage and detection:
//               <br />
//               1. Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8' }}>console.firebase.google.com</a>
//               <br />
//               2. Replace the firebaseConfig in the code with your project's configuration
//               <br />
//               3. Enable Anonymous Authentication, Realtime Database, and update Firebase Storage rules
//             </div>
//           </div>
//         )}

//         {/* Detection Status and Controls */}
//         {isFirebaseConfigured() && (
//           <div style={styles.detectionInfo}>
//             <div style={styles.detectionHeader}>
//               <h3 style={styles.detectionTitle}>
//                 Animal Detection System
//                 {isDetectionConnected ? ' 🟢' : ' 🔴'}
//               </h3>
//               <div style={styles.autoPlayToggle}>
//                 <span>Auto-play:</span>
//                 <button
//                   style={styles.toggleSwitch}
//                   onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
//                 >
//                   <div style={styles.toggleKnob}></div>
//                 </button>
//               </div>
//             </div>
//             <div style={styles.detectionData}>
//               {animalData ? (
//                 <>
//                   <strong>Current Detection:</strong> {animalData.detection} | 
//                   <strong> Animal:</strong> {animalData.last_detected_animal} | 
//                   <strong> Confidence:</strong> {animalData.confidence}% | 
//                   <strong> Time:</strong> {animalData.detection_timestamp}
//                   <br />
//                   <strong>Status:</strong> {autoPlayEnabled ? 'Auto-play enabled' : 'Manual play only'} | 
//                   <strong>Files in Selection:</strong> {selectedFiles.length}/7
//                   <br />
//                   <button
//                     onClick={() => {
//                       const currentDetection = animalData.detection;
//                       if (currentDetection >= 1 && currentDetection <= selectedFiles.length) {
//                         const fileIndex = currentDetection - 1;
//                         const fileToPlay = selectedFiles[fileIndex];
//                         playAudioByData(fileToPlay);
//                         showToast(`Playing: ${fileToPlay.name} (Detection ${currentDetection})`, '#10b981');
//                       } else {
//                         showToast(`No file for detection ${currentDetection}`, '#f59e0b');
//                       }
//                     }}
//                     disabled={!animalData || selectedFiles.length === 0}
//                     style={{
//                       backgroundColor: '#10b981',
//                       color: 'white',
//                       border: 'none',
//                       padding: '6px 12px',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '500',
//                       cursor: selectedFiles.length > 0 ? 'pointer' : 'not-allowed',
//                       marginTop: '8px',
//                       marginRight: '8px',
//                       opacity: selectedFiles.length > 0 ? 1 : 0.5
//                     }}
//                   >
//                     ▶ Play Current Detection ({animalData?.detection || 0})
//                   </button>
//                   <button
//                     onClick={() => {
//                       console.log('=== DEBUG INFO ===');
//                       console.log('Selected files:', selectedFiles);
//                       console.log('Auto-play enabled:', autoPlayEnabled);
//                       console.log('Last detection:', lastDetection);
//                       console.log('Current animal data:', animalData);
//                       console.log('Is connected:', isDetectionConnected);
//                       console.log('Detection listener ref:', detectionListenerRef.current);
//                     }}
//                     style={{
//                       backgroundColor: '#6b7280',
//                       color: 'white',
//                       border: 'none',
//                       padding: '6px 12px',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '500',
//                       cursor: 'pointer',
//                       marginTop: '8px'
//                     }}
//                   >
//                     🐛 Debug Info
//                   </button>
//                 </>
//               ) : (
//                 isDetectionConnected ? 'Waiting for detection data...' : 'Connection to detection system failed'
//               )}
//             </div>
//           </div>
//         )}

//         {/* Sequential Auto-Play Controls */}
//         {selectedFiles.length > 0 && (
//           <div style={{
//             margin: '16px',
//             padding: '16px',
//             backgroundColor: '#f0f9ff',
//             border: '1px solid #0ea5e9',
//             borderRadius: '8px'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               marginBottom: '12px'
//             }}>
//               <h3 style={{
//                 fontWeight: 'bold',
//                 color: '#0369a1',
//                 margin: 0
//               }}>
//                 Sequential Auto-Play
//               </h3>
//               <div style={{
//                 display: 'flex',
//                 gap: '8px'
//               }}>
//                 {!sequentialPlayEnabled ? (
//                   <button
//                     onClick={startSequentialPlay}
//                     style={{
//                       backgroundColor: '#10b981',
//                       color: 'white',
//                       border: 'none',
//                       padding: '8px 16px',
//                       borderRadius: '6px',
//                       fontSize: '14px',
//                       fontWeight: '500',
//                       cursor: 'pointer',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
//                     onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
//                   >
//                     ▶ Start Playlist
//                   </button>
//                 ) : (
//                   <button
//                     onClick={stopSequentialPlay}
//                     style={{
//                       backgroundColor: '#ef4444',
//                       color: 'white',
//                       border: 'none',
//                       padding: '8px 16px',
//                       borderRadius: '6px',
//                       fontSize: '14px',
//                       fontWeight: '500',
//                       cursor: 'pointer',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
//                     onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
//                   >
//                     ■ Stop Playlist
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div style={{
//               fontSize: '14px',
//               color: '#1e40af',
//               lineHeight: '1.5'
//             }}>
//               {sequentialPlayEnabled ? (
//                 <>
//                   <strong>Playlist Mode Active:</strong> Playing {currentSequentialIndex + 1} of {selectedFiles.length} files
//                   <br />
//                   <strong>Current:</strong> {selectedFiles[currentSequentialIndex]?.name || 'Loading...'}
//                   <br />
//                   <strong>Next:</strong> {selectedFiles[(currentSequentialIndex + 1) % selectedFiles.length]?.name || 'End of playlist'}
//                 </>
//               ) : (
//                 <>
//                   <strong>Playlist Ready:</strong> {selectedFiles.length} files in queue
//                   <br />
//                   <strong>Mode:</strong> Play all selected files in sequence automatically
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Upload Section */}
//         <div style={styles.uploadSection}>
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileUpload}
//             accept="audio/*"
//             multiple
//             style={{ display: 'none' }}
//           />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             style={styles.uploadButton}
//             disabled={!user}
//             onMouseEnter={(e) => {
//               if (user) e.target.style.backgroundColor = '#1d4ed8';
//             }}
//             onMouseLeave={(e) => {
//               if (user) e.target.style.backgroundColor = '#2563eb';
//             }}
//           >
//             <Upload size={20} />
//             <span>
//               {!user 
//                 ? 'Initializing...' 
//                 : user.isLocal || !isFirebaseConfigured()
//                   ? 'Upload Audio Files (Local Storage)'
//                   : 'Upload Audio Files (Firebase Storage)'
//               }
//             </span>
//           </button>
//         </div>
        
//         {/* Upload Progress */}
//         {Object.keys(uploadProgress).length > 0 && (
//           <div style={styles.uploadProgress}>
//             <h3>Uploading files...</h3>
//             {Object.entries(uploadProgress).map(([fileId, data]) => (
//               <div key={fileId} style={styles.uploadProgressItem}>
//                 <Loader size={16} style={styles.loadingSpinner} />
//                 <span>Uploading {data.name}...</span>
//               </div>
//             ))}
//           </div>
//         )}
        
//         {/* Currently Playing Section */}
//         {currentFileName && (
//           <div style={styles.nowPlaying}>
//             <div style={styles.nowPlayingTitle}>
//               <h2 style={styles.nowPlayingTitleText}>Now Playing</h2>
//               <p style={styles.nowPlayingFile}>{currentFileName}</p>
//             </div>
            
//             {/* Progress Bar */}
//             <div style={styles.progressContainer}>
//               <span style={styles.timeDisplay}>
//                 {formatDuration(position)}
//               </span>
//               <div
//                 style={styles.progressBar}
//                 onClick={handleSeek}
//               >
//                 <div
//                   style={{
//                     ...styles.progressFill,
//                     width: duration > 0 ? `${(position / duration) * 100}%` : '0%'
//                   }}
//                 />
//               </div>
//               <span style={styles.timeDisplay}>
//                 {formatDuration(duration)}
//               </span>
//             </div>
            
//             {/* Controls */}
//             <div style={styles.controls}>
//               <button
//                 onClick={stopAudio}
//                 style={{...styles.controlButton, ...styles.stopButton}}
//                 onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
//                 onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
//               >
//                 <div style={styles.stopIcon} />
//               </button>
//               {currentlyPlayingIndex !== null && (
//                 <button
//                   onClick={() => playAudio(currentlyPlayingIndex)}
//                   style={{...styles.controlButton, ...styles.playButton}}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
//                 >
//                   {isPlaying ? <Pause size={24} /> : <Play size={24} />}
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
        
//         {/* Tab Content */}
//         <div style={styles.tabContent}>
//           {activeTab === 'library' ? renderLibraryList() : renderSelectionList()}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AudioPlayerApp;








import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, CheckCircle, PlusCircle, XCircle, Trash2, Music, X, Loader, Wifi, WifiOff } from 'lucide-react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref as dbRef, onValue, off } from 'firebase/database';

// Firebase configuration - REPLACE WITH YOUR ACTUAL CONFIG
// Get this from: Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyAOFbpbOwdren9NlNtWvRVyf4DsDf9-2H4",
  authDomain: "procart-8d2f6.firebaseapp.com",
  databaseURL: "https://procart-8d2f6-default-rtdb.firebaseio.com",
  projectId: "procart-8d2f6",
  storageBucket: "procart-8d2f6.firebasestorage.app",
  messagingSenderId: "1026838026898",
  appId: "1:1026838026898:web:56b3889e347862ca37a44b",
  measurementId: "G-RW7V299RPY"
};

// Animal detection mapping
const ANIMAL_DETECTION_MAP = {
  1: { name: 'Cow', emoji: '🐄', color: '#8B4513' },
  2: { name: 'Elephant', emoji: '🐘', color: '#708090' },
  3: { name: 'Goat', emoji: '🐐', color: '#DEB887' },
  4: { name: 'Lion', emoji: '🦁', color: '#DAA520' },
  5: { name: 'Pig', emoji: '🐷', color: '#FFB6C1' },
  6: { name: 'Sheep', emoji: '🐑', color: '#F5F5DC' },
  7: { name: 'Tiger', emoji: '🐅', color: '#FF4500' }
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !firebaseConfig.apiKey.includes('your-') && 
         !firebaseConfig.projectId.includes('your-') &&
         !firebaseConfig.appId.includes('your-');
};

// Only initialize Firebase if properly configured
let app, storage, auth, database;
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    auth = getAuth(app);
    database = getDatabase(app);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

const AudioPlayerApp = () => {
  // Constants
  const SELECTION_LIMIT = 7;
  
  // State
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentFileName, setCurrentFileName] = useState(null);
  const [activeTab, setActiveTab] = useState('library');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState({});
  const [user, setUser] = useState(null);
  
  // New state for Firebase detection
  const [isDetectionConnected, setIsDetectionConnected] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [animalData, setAnimalData] = useState(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  
  // Sequential auto-play state
  const [sequentialPlayEnabled, setSequentialPlayEnabled] = useState(false);
  const [currentSequentialIndex, setCurrentSequentialIndex] = useState(0);
  
  // Refs
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const detectionListenerRef = useRef(null);
  
  // Re-setup detection listener when selectedFiles or autoPlayEnabled changes
  useEffect(() => {
    if (user && !user.isLocal && isFirebaseConfigured() && database) {
      console.log('Re-setting up detection listener due to dependency change');
      console.log('Selected files:', selectedFiles.length);
      console.log('Auto-play enabled:', autoPlayEnabled);
      
      // Clean up existing listener
      if (detectionListenerRef.current) {
        off(detectionListenerRef.current);
      }
      
      // Setup new listener with current dependencies
      setupDetectionListener();
    }
  }, [selectedFiles, autoPlayEnabled]); // Re-run when these change
  
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // Show configuration warning
      showToast('⚠️ Firebase not configured. Using local storage mode.', '#f59e0b');
      setUser({ uid: 'local-user', isLocal: true });
      setAudioFiles([]);
      setIsLoading(false);
      return;
    }

    if (!auth) {
      showToast('Firebase initialization failed. Using local storage.', '#ef4444');
      setUser({ uid: 'local-user', isLocal: true });
      setAudioFiles([]);
      setIsLoading(false);
      return;
    }

    // Firebase is properly configured
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadAudioFilesFromFirebase(user.uid);
        setupDetectionListener(); // Setup the detection listener
      } else {
        // Try anonymous sign-in
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in failed:', error);
          let message = 'Authentication failed. ';
          
          if (error.code === 'auth/admin-restricted-operation') {
            message += 'Enable Anonymous Authentication in Firebase Console.';
          } else {
            message += 'Using local session.';
          }
          
          showToast(message, '#f59e0b');
          
          // Fallback to local session
          const localUser = { 
            uid: localStorage.getItem('audio-app-user-id') || 'user-' + Date.now(),
            isLocal: true 
          };
          localStorage.setItem('audio-app-user-id', localUser.uid);
          setUser(localUser);
          setAudioFiles([]); // Start with empty files for local mode
          setIsLoading(false);
        });
      }
    });
    
    return () => {
      unsubscribe();
      // Clean up detection listener
      if (detectionListenerRef.current) {
        off(detectionListenerRef.current);
      }
    };
  }, []);

  // Enhanced toast notification function with animal alerts
  const showAnimalAlert = (detectionNumber, animalInfo, message, duration = 5000) => {
    const alert = document.createElement('div');
    alert.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 32px;">${animalInfo.emoji}</div>
        <div>
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">
            ${animalInfo.name} Detected!
          </div>
          <div style="font-size: 14px; opacity: 0.9;">
            ${message}
          </div>
        </div>
      </div>
    `;
    
    alert.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 1001;
      background: linear-gradient(135deg, ${animalInfo.color}dd, ${animalInfo.color}bb);
      color: white; padding: 16px 20px;
      border-radius: 12px; font-size: 14px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      max-width: 350px; word-wrap: break-word;
      border: 2px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      animation: slideInBounce 0.5s ease-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.getElementById('animal-alert-styles')) {
      const style = document.createElement('style');
      style.id = 'animal-alert-styles';
      style.textContent = `
        @keyframes slideInBounce {
          0% { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
          }
          60% { 
            transform: translateX(-10px) scale(1.05); 
            opacity: 1; 
          }
          100% { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add pulse animation
    alert.style.animation = 'slideInBounce 0.5s ease-out, pulse 2s ease-in-out infinite 1s';
    
    document.body.appendChild(alert);
    
    // Auto-remove after duration
    setTimeout(() => {
      if (document.body.contains(alert)) {
        alert.style.animation = 'slideInBounce 0.3s ease-in reverse';
        setTimeout(() => {
          if (document.body.contains(alert)) {
            document.body.removeChild(alert);
          }
        }, 300);
      }
    }, duration);
    
    // Play detection sound if available
    playDetectionSound(animalInfo);
  };

  // Optional: Play a detection sound
  const playDetectionSound = (animalInfo) => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different animals
      const frequencies = {
        'Cow': 220,
        'Elephant': 180,
        'Goat': 330,
        'Lion': 150,
        'Pig': 280,
        'Sheep': 400,
        'Tiger': 140
      };
      
      oscillator.frequency.setValueAtTime(
        frequencies[animalInfo.name] || 250, 
        audioContext.currentTime
      );
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play detection sound:', error);
    }
  };

  // Setup Firebase Realtime Database listener for animal detection
  const setupDetectionListener = () => {
    if (!database) {
      console.warn('Firebase Realtime Database not available');
      return;
    }

    try {
      const animalRef = dbRef(database, 'Animal');
      detectionListenerRef.current = animalRef;
      
      onValue(animalRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Firebase detection data received:', data);
        console.log('Current selectedFiles length:', selectedFiles.length);
        console.log('Current autoPlayEnabled:', autoPlayEnabled);
        console.log('Current lastDetection:', lastDetection);
        
        if (data) {
          setAnimalData(data);
          setIsDetectionConnected(true);
          
          const currentDetection = data.detection;
          console.log('Detection value:', currentDetection);
          
          // Show animal alert for any valid detection (regardless of auto-play settings)
          if (currentDetection >= 1 && currentDetection <= SELECTION_LIMIT && 
              currentDetection !== lastDetection) {
            
            const animalInfo = ANIMAL_DETECTION_MAP[currentDetection];
            if (animalInfo) {
              // Always show animal detection alert
              let alertMessage = `Detection #${currentDetection}`;
              
              if (selectedFiles.length > 0) {
                const fileIndex = currentDetection - 1;
                if (fileIndex < selectedFiles.length) {
                  const selectedFile = selectedFiles[fileIndex];
                  alertMessage += ` • File: ${selectedFile.name}`;
                  
                  if (autoPlayEnabled) {
                    alertMessage += ' • Auto-playing now!';
                  } else {
                    alertMessage += ' • Auto-play disabled';
                  }
                } else {
                  alertMessage += ` • No file assigned to slot ${currentDetection}`;
                }
              } else {
                alertMessage += ' • No files in selection';
              }
              
              showAnimalAlert(currentDetection, animalInfo, alertMessage);
            }
          }
          
          // Check if we should trigger auto-play
          const shouldAutoPlay = autoPlayEnabled && 
                                currentDetection !== lastDetection && 
                                currentDetection >= 1 && 
                                currentDetection <= SELECTION_LIMIT &&
                                selectedFiles.length > 0;
          
          console.log('Should auto-play?', shouldAutoPlay);
          
          if (shouldAutoPlay) {
            const fileIndex = currentDetection - 1; // Convert to 0-based index
            console.log('File index to play:', fileIndex);
            
            if (fileIndex < selectedFiles.length) {
              const fileToPlay = selectedFiles[fileIndex];
              const animalInfo = ANIMAL_DETECTION_MAP[currentDetection];
              
              console.log(`Triggering auto-play for file ${currentDetection}: ${fileToPlay.name}`);
              
              // Use setTimeout to ensure state updates and DOM are ready
              setTimeout(() => {
                playAudioByData(fileToPlay);
                showToast(
                  `${animalInfo?.emoji || ''} ${animalInfo?.name || 'Animal'} detected! Playing: ${fileToPlay.name}`,
                  '#10b981'
                );
              }, 200);
            } else {
              console.warn(`Detection ${currentDetection} but only ${selectedFiles.length} files selected`);
              const animalInfo = ANIMAL_DETECTION_MAP[currentDetection];
              showToast(
                `${animalInfo?.emoji || ''} ${animalInfo?.name || 'Animal'} detected, but no file assigned to slot ${currentDetection}`,
                '#f59e0b'
              );
            }
          } else {
            console.log('Auto-play conditions not met:', {
              autoPlayEnabled,
              detectionChanged: currentDetection !== lastDetection,
              validRange: currentDetection >= 1 && currentDetection <= SELECTION_LIMIT,
              hasFiles: selectedFiles.length > 0
            });
          }
          
          setLastDetection(currentDetection);
        } else {
          setIsDetectionConnected(false);
          console.log('No animal data received');
        }
      }, (error) => {
        console.error('Error listening to animal detection:', error);
        setIsDetectionConnected(false);
        showToast('Failed to connect to detection system', '#ef4444');
      });
      
      showToast('Connected to animal detection system', '#10b981');
      
    } catch (error) {
      console.error('Error setting up detection listener:', error);
      showToast('Error setting up detection listener', '#ef4444');
    }
  };
  
  // Load audio files from Firebase Storage or local storage
  const loadAudioFilesFromFirebase = async (userId) => {
    if (!userId || !isFirebaseConfigured() || !storage) {
      // Use local storage mode
      loadAudioFilesFromLocal();
      return;
    }
    
    setIsLoading(true);
    try {
      const audioRef = ref(storage, `audio-files/${userId}`);
      const result = await listAll(audioRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            id: itemRef.name,
            name: itemRef.name,
            url: url,
            firebaseRef: itemRef,
            isFirebaseFile: true
          };
        })
      );
      
      setAudioFiles(files);
      
      // Clean up selection if any files were removed
      setSelectedFiles(prev => 
        prev.filter(sel => 
          files.some(file => isSameFile(file, sel))
        )
      );
      
    } catch (error) {
      console.error('Error loading files from Firebase:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'storage/unauthorized') {
        showToast('Storage access denied. Check Firebase Storage rules.', '#ef4444');
      } else if (error.code === 'storage/object-not-found') {
        // This is normal for first-time users - no files exist yet
        setAudioFiles([]);
      } else {
        showToast('Firebase storage error. Switching to local mode.', '#f59e0b');
        loadAudioFilesFromLocal();
        return;
      }
    }
    setIsLoading(false);
  };

  // Load audio files from local storage (fallback)
  const loadAudioFilesFromLocal = () => {
    try {
      const savedFiles = JSON.parse(localStorage.getItem('audio-files') || '[]');
      // Filter out any files that no longer exist
      const validFiles = savedFiles.filter(file => file.url && file.name);
      setAudioFiles(validFiles);
    } catch (error) {
      console.error('Error loading local files:', error);
      setAudioFiles([]);
    }
    setIsLoading(false);
  };

  // Save audio files to local storage
  const saveAudioFilesToLocal = (files) => {
    try {
      localStorage.setItem('audio-files', JSON.stringify(files));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };
  
  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    
    const handleTimeUpdate = () => {
      setPosition(audio.currentTime || 0);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setPosition(0);
      
      // Check if sequential auto-play is enabled and there are more files
      if (sequentialPlayEnabled && selectedFiles.length > 0) {
        const nextIndex = (currentSequentialIndex + 1) % selectedFiles.length;
        setCurrentSequentialIndex(nextIndex);
        
        // Play next file after a short delay
        setTimeout(() => {
          const nextFile = selectedFiles[nextIndex];
          if (nextFile) {
            playAudioByData(nextFile);
            showToast(
              `Auto-playing next: ${nextFile.name} (${nextIndex + 1}/${selectedFiles.length})`,
              '#10b981'
            );
          }
        }, 500);
      } else {
        setCurrentlyPlayingIndex(null);
        setCurrentFileName(null);
        setCurrentSequentialIndex(0);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);
  
  // Helper functions
  const formatDuration = (seconds) => {
    if (!seconds || seconds === Infinity || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const isAudioFile = (file) => {
    const audioTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/flac', 'audio/ogg', 'audio/mpeg'];
    return audioTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|aac|flac|ogg)$/i);
  };
  
  const isSameFile = (a, b) => {
    return a.id === b.id || a.name === b.name;
  };
  
  const isInSelection = (file) => {
    return selectedFiles.some(selectedFile => isSameFile(selectedFile, file));
  };
  
  // Toast notification function
  const showToast = (message, backgroundColor = '#10b981') => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 1000;
      background: ${backgroundColor}; color: white; padding: 12px 20px;
      border-radius: 8px; font-size: 14px; font-weight: 500;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 300px; word-wrap: break-word;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 4000);
  };
  
  // File upload handler with Firebase Storage and local fallback
  const handleFileUpload = async (event) => {
    if (!user) {
      showToast('Please wait for initialization...', '#f59e0b');
      return;
    }
    
    const files = Array.from(event.target.files);
    const audioOnlyFiles = files.filter(isAudioFile);
    
    if (audioOnlyFiles.length === 0) {
      showToast('Please select valid audio files.', '#ef4444');
      return;
    }
    
    // Reset file input
    event.target.value = '';
    
    // Check if using Firebase or local storage
    if (user.isLocal || !isFirebaseConfigured() || !storage) {
      // Upload to local storage
      audioOnlyFiles.forEach(file => {
        const fileId = `${Date.now()}-${Math.random()}`;
        const fileData = {
          id: fileId,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          isFirebaseFile: false,
          file: file // Keep reference for local files
        };
        
        setAudioFiles(prev => {
          const newFiles = [...prev, fileData];
          saveAudioFilesToLocal(newFiles);
          return newFiles;
        });
      });
      
      const message = audioOnlyFiles.length === 1 
        ? 'Audio file stored locally!' 
        : `${audioOnlyFiles.length} audio files stored locally!`;
      showToast(message, '#10b981');
      return;
    }
    
    // Upload files to Firebase Storage
    for (const file of audioOnlyFiles) {
      const fileId = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `audio-files/${user.uid}/${fileId}`);
      
      try {
        // Show upload progress
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { name: file.name, progress: 0 }
        }));
        
        // Upload file
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Add to local state
        const fileData = {
          id: fileId,
          name: file.name,
          url: downloadURL,
          firebaseRef: storageRef,
          isFirebaseFile: true
        };
        
        setAudioFiles(prev => [...prev, fileData]);
        
        // Remove from upload progress
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
        showToast(`${file.name} uploaded to Firebase!`, '#10b981');
        
      } catch (error) {
        console.error('Error uploading file:', error);
        
        let errorMessage = `Error uploading ${file.name}`;
        if (error.code === 'storage/unauthorized') {
          errorMessage += ': Storage access denied. Check Firebase rules.';
        } else if (error.code === 'storage/quota-exceeded') {
          errorMessage += ': Storage quota exceeded.';
        } else {
          errorMessage += `: ${error.message}`;
        }
        
        showToast(errorMessage, '#ef4444');
        
        // Remove from upload progress
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }
    }
  };
  
  // Audio playback functions
  const playAudio = async (index) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      if (currentlyPlayingIndex === index && !audio.paused) {
        audio.pause();
        return;
      }
      
      const audioFile = audioFiles[index];
      if (audio.src !== audioFile.url) {
        audio.src = audioFile.url;
        // Add loading state while audio loads
        showToast('Loading audio...', '#3b82f6');
      }
      
      await audio.play();
      setCurrentlyPlayingIndex(index);
      setCurrentFileName(audioFile.name);
    } catch (error) {
      console.error('Error playing audio:', error);
      showToast(`Error playing audio: ${error.message}`, '#ef4444');
    }
  };
  
  const playAudioByData = (file) => {
    const index = audioFiles.findIndex(audioFile => isSameFile(audioFile, file));
    if (index !== -1) {
      playAudio(index);
      
      // Update sequential index if playing from selection
      const selectedIndex = selectedFiles.findIndex(selectedFile => isSameFile(selectedFile, file));
      if (selectedIndex !== -1) {
        setCurrentSequentialIndex(selectedIndex);
      }
    } else {
      showToast('File not found in library.', '#ef4444');
    }
  };

  // Start sequential playback
  const startSequentialPlay = () => {
    if (selectedFiles.length === 0) {
      showToast('Add files to selection first', '#f59e0b');
      return;
    }
    
    setSequentialPlayEnabled(true);
    setCurrentSequentialIndex(0);
    
    const firstFile = selectedFiles[0];
    playAudioByData(firstFile);
    showToast(
      `Started sequential playback: ${firstFile.name} (1/${selectedFiles.length})`,
      '#10b981'
    );
  };

  // Stop sequential playback
  const stopSequentialPlay = () => {
    setSequentialPlayEnabled(false);
    setCurrentSequentialIndex(0);
    stopAudio();
    showToast('Sequential playback stopped', '#f59e0b');
  };
  
  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    setCurrentlyPlayingIndex(null);
    setCurrentFileName(null);
    setPosition(0);
    setIsPlaying(false);
  };
  
  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = Math.max(0, Math.min(newTime, duration));
  };
  
  // Selection management
  const toggleSelection = (file) => {
    const isSelected = isInSelection(file);
    
    if (isSelected) {
      setSelectedFiles(prev => prev.filter(selectedFile => !isSameFile(selectedFile, file)));
    } else {
      if (selectedFiles.length >= SELECTION_LIMIT) {
        showToast(`Selection limit is ${SELECTION_LIMIT} files.`, '#6b7280');
        return;
      }
      setSelectedFiles(prev => [...prev, file]);
    }
  };
  
  const clearSelection = () => {
    setSelectedFiles([]);
  };
  
  // Delete file from Firebase Storage or local storage
  const deleteAudioFile = async (index) => {
    if (currentlyPlayingIndex === index) {
      stopAudio();
    }
    
    const fileToDelete = audioFiles[index];
    
    try {
      // Delete from Firebase Storage if it's a Firebase file
      if (fileToDelete.isFirebaseFile && fileToDelete.firebaseRef && storage) {
        await deleteObject(fileToDelete.firebaseRef);
      }
      
      // If it's a local file, revoke the URL
      if (!fileToDelete.isFirebaseFile && fileToDelete.url) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      
      // Remove from local state
      const newFiles = audioFiles.filter((_, i) => i !== index);
      setAudioFiles(newFiles);
      
      // Update local storage if in local mode
      if (user?.isLocal) {
        saveAudioFilesToLocal(newFiles);
      }
      
      // Remove from selection if present
      setSelectedFiles(prev => prev.filter(selectedFile => !isSameFile(selectedFile, fileToDelete)));
      
      // Update current playing index if needed
      if (currentlyPlayingIndex !== null && currentlyPlayingIndex > index) {
        setCurrentlyPlayingIndex(prev => prev - 1);
      }
      
      showToast('Audio file deleted successfully!', '#f59e0b');
    } catch (error) {
      console.error('Error deleting file:', error);
      showToast(`Error deleting file: ${error.message}`, '#ef4444');
    }
  };
  
  // Styles (same as before but with detection status)
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: '#1d4ed8',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
      maxWidth: '1024px',
      margin: '0 auto',
      padding: '16px'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: 0
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    detectionStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500'
    },
    selectionCounter: {
      fontSize: '14px',
      fontWeight: '600'
    },
    tabs: {
      display: 'flex',
      marginTop: '16px',
      borderBottom: '1px solid #3b82f6'
    },
    tab: {
      padding: '8px 24px',
      fontWeight: '500',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    tabActive: {
      borderBottom: '2px solid white',
      color: 'white'
    },
    tabInactive: {
      color: '#bfdbfe'
    },
    main: {
      maxWidth: '1024px',
      margin: '0 auto'
    },
    detectionInfo: {
      margin: '16px',
      padding: '16px',
      backgroundColor: isDetectionConnected ? '#f0f9ff' : '#fef3c7',
      border: `1px solid ${isDetectionConnected ? '#0ea5e9' : '#f59e0b'}`,
      borderRadius: '8px'
    },
    detectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px'
    },
    detectionTitle: {
      fontWeight: 'bold',
      color: isDetectionConnected ? '#0369a1' : '#92400e'
    },
    autoPlayToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      fontSize: '14px'
    },
    toggleSwitch: {
      width: '40px',
      height: '20px',
      borderRadius: '10px',
      backgroundColor: autoPlayEnabled ? '#10b981' : '#d1d5db',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background-color 0.2s'
    },
    toggleKnob: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: 'white',
      position: 'absolute',
      top: '2px',
      left: autoPlayEnabled ? '22px' : '2px',
      transition: 'left 0.2s'
    },
    detectionData: {
      fontSize: '14px',
      color: isDetectionConnected ? '#1e40af' : '#92400e',
      lineHeight: '1.5'
    },
    uploadSection: {
      padding: '16px'
    },
    uploadButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      width: '100%'
    },
    uploadProgress: {
      margin: '16px',
      padding: '16px',
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '8px'
    },
    uploadProgressItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite'
    },
    nowPlaying: {
      margin: '0 16px 16px 16px',
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '12px',
      padding: '24px'
    },
    nowPlayingTitle: {
      textAlign: 'center',
      marginBottom: '16px'
    },
    nowPlayingTitleText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1d4ed8',
      marginBottom: '8px'
    },
    nowPlayingFile: {
      color: '#374151',
      fontWeight: '500'
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    timeDisplay: {
      fontSize: '14px',
      color: '#6b7280',
      minWidth: '45px'
    },
    progressBar: {
      flex: 1,
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2563eb',
      borderRadius: '4px',
      transition: 'width 0.1s ease'
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px'
    },
    controlButton: {
      padding: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    stopButton: {
      backgroundColor: '#e5e7eb'
    },
    playButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    stopIcon: {
      width: '24px',
      height: '24px',
      backgroundColor: '#374151',
      borderRadius: '2px'
    },
    tabContent: {
      backgroundColor: 'white',
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      minHeight: '400px'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '256px',
      color: '#6b7280'
    },
    emptyStateIcon: {
      marginBottom: '16px',
      color: '#9ca3af'
    },
    emptyStateTitle: {
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    emptyStateSubtitle: {
      fontSize: '14px'
    },
    fileList: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    fileItem: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      border: '1px solid #e5e7eb',
      transition: 'box-shadow 0.2s'
    },
    fileContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    playButton2: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      transition: 'opacity 0.2s'
    },
    fileInfo: {
      flex: 1,
      minWidth: 0
    },
    fileName: {
      fontWeight: '500',
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    fileSubtitle: {
      fontSize: '12px',
      color: '#6b7280',
      margin: '4px 0 0 0'
    },
    fileActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    actionButton: {
      padding: '8px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      backgroundColor: 'transparent'
    },
    selectionHeader: {
      padding: '16px 16px 0 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    selectionHeaderText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    clearButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#2563eb',
      backgroundColor: 'transparent',
      border: 'none',
      padding: '4px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    playlistIcon: {
      width: '56px',
      height: '56px',
      marginBottom: '12px',
      color: '#9ca3af',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    playlistIconContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    playlistIconRow: {
      display: 'flex',
      gap: '4px'
    },
    playlistIconBar1: {
      width: '4px',
      height: '12px',
      backgroundColor: '#9ca3af',
      borderRadius: '1px'
    },
    playlistIconBar2: {
      width: '24px',
      height: '12px',
      backgroundColor: '#9ca3af',
      borderRadius: '1px'
    },
    playlistIconBar3: {
      width: '32px',
      height: '12px',
      backgroundColor: '#9ca3af',
      borderRadius: '1px'
    },
    playlistIconBar4: {
      width: '16px',
      height: '12px',
      backgroundColor: '#9ca3af',
      borderRadius: '1px'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '256px',
      gap: '16px'
    }
  };
  
  // Add spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  // Render functions
  const renderLibraryList = () => {
    if (isLoading) {
      return (
        <div style={styles.loadingContainer}>
          <Loader size={48} style={styles.loadingSpinner} />
          <p>Loading your audio library...</p>
        </div>
      );
    }
    
    if (audioFiles.length === 0) {
      return (
        <div style={styles.emptyState}>
          <Music size={64} style={styles.emptyStateIcon} />
          <h3 style={styles.emptyStateTitle}>No audio files found</h3>
          <p style={styles.emptyStateSubtitle}>Upload some audio files to get started</p>
        </div>
      );
    }
    
    return (
      <div style={styles.fileList}>
        {audioFiles.map((file, index) => {
          const isCurrentlyPlaying = currentlyPlayingIndex === index;
          const isSelected = isInSelection(file);
          const canAddMore = selectedFiles.length < SELECTION_LIMIT || isSelected;
          
          return (
            <div
              key={file.id}
              style={{
                ...styles.fileItem,
                boxShadow: isCurrentlyPlaying ? '0 4px 12px rgba(37, 99, 235, 0.2)' : styles.fileItem.boxShadow
              }}
              onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'}
              onMouseLeave={(e) => e.target.style.boxShadow = isCurrentlyPlaying ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'}
            >
              <div style={styles.fileContent}>
                <button
                  onClick={() => playAudio(index)}
                  style={{
                    ...styles.playButton2,
                    backgroundColor: isCurrentlyPlaying ? '#2563eb' : '#9ca3af'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {isCurrentlyPlaying && isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} />
                  )}
                </button>
                
                <div style={styles.fileInfo}>
                  <h4 style={{
                    ...styles.fileName,
                    color: isCurrentlyPlaying ? '#1d4ed8' : '#111827',
                    fontWeight: isCurrentlyPlaying ? 'bold' : '500'
                  }}>
                    {file.name}
                  </h4>
                  <p style={styles.fileSubtitle}>
                    {file.isFirebaseFile 
                      ? 'Stored in Firebase Cloud' 
                      : 'Stored locally (session only)'
                    }
                  </p>
                </div>
                
                <div style={styles.fileActions}>
                  <button
                    onClick={() => toggleSelection(file)}
                    disabled={!canAddMore}
                    style={{
                      ...styles.actionButton,
                      color: isSelected ? '#059669' : canAddMore ? '#6b7280' : '#d1d5db',
                      cursor: canAddMore ? 'pointer' : 'not-allowed'
                    }}
                    title={
                      isSelected
                        ? 'Remove from selection'
                        : canAddMore
                        ? 'Add to selection'
                        : `Limit reached (${SELECTION_LIMIT})`
                    }
                    onMouseEnter={(e) => {
                      if (canAddMore) e.target.style.backgroundColor = isSelected ? '#ecfdf5' : '#f3f4f6';
                    }}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {isSelected ? (
                      <CheckCircle size={20} />
                    ) : (
                      <PlusCircle size={20} />
                    )}
                  </button>
                  
                  <button
                    onClick={() => deleteAudioFile(index)}
                    style={{
                      ...styles.actionButton,
                      color: '#ef4444'
                    }}
                    title="Delete file"
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderSelectionList = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {selectedFiles.length > 0 && (
          <div style={styles.selectionHeader}>
            <p style={styles.selectionHeaderText}>Auto-play sequence (Detection 1-{selectedFiles.length})</p>
            <button
              onClick={clearSelection}
              style={styles.clearButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <X size={16} />
              <span>Clear</span>
            </button>
          </div>
        )}
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          {selectedFiles.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.playlistIcon}>
                <div style={styles.playlistIconContent}>
                  <div style={styles.playlistIconRow}>
                    <div style={styles.playlistIconBar1}></div>
                    <div style={styles.playlistIconBar2}></div>
                  </div>
                  <div style={styles.playlistIconRow}>
                    <div style={styles.playlistIconBar1}></div>
                    <div style={styles.playlistIconBar3}></div>
                  </div>
                  <div style={styles.playlistIconRow}>
                    <div style={styles.playlistIconBar1}></div>
                    <div style={styles.playlistIconBar4}></div>
                  </div>
                </div>
              </div>
              <h3 style={styles.emptyStateTitle}>No files in Selection</h3>
              <p style={styles.emptyStateSubtitle}>Add files from the Library tab for auto-play</p>
            </div>
          ) : (
            <div style={styles.fileList}>
              {selectedFiles.map((file, index) => {
                const libIndex = audioFiles.findIndex(f => isSameFile(f, file));
                const playingHere = libIndex !== -1 && libIndex === currentlyPlayingIndex;
                const detectionNumber = index + 1;
                const isCurrentDetection = animalData?.detection === detectionNumber;
                const isCurrentSequential = sequentialPlayEnabled && currentSequentialIndex === index;
                const animalInfo = ANIMAL_DETECTION_MAP[detectionNumber];
                
                return (
                  <div
                    key={`selection-${file.id}`}
                    style={{
                      ...styles.fileItem,
                      boxShadow: playingHere ? '0 4px 12px rgba(37, 99, 235, 0.2)' : styles.fileItem.boxShadow,
                      border: isCurrentDetection 
                        ? '2px solid #10b981' 
                        : isCurrentSequential 
                          ? '2px solid #3b82f6' 
                          : '1px solid #e5e7eb',
                      backgroundColor: isCurrentSequential ? '#f0f9ff' : 'white'
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = playingHere ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'}
                  >
                    <div style={styles.fileContent}>
                      <button
                        onClick={() => playAudioByData(file)}
                        style={{
                          ...styles.playButton2,
                          backgroundColor: playingHere ? '#2563eb' : '#9ca3af'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        {playingHere && isPlaying ? (
                          <Pause size={20} />
                        ) : (
                          <Play size={20} />
                        )}
                      </button>
                      
                      <div style={styles.fileInfo}>
                        <h4 style={{
                          ...styles.fileName,
                          color: playingHere ? '#1d4ed8' : '#111827',
                          fontWeight: playingHere ? 'bold' : '500'
                        }}>
                          {file.name}
                        </h4>
                        <p style={styles.fileSubtitle}>
                          {animalInfo?.emoji} Detection {detectionNumber} • {animalInfo?.name}
                          {isCurrentDetection && ' • CURRENT DETECTION'}
                          {isCurrentSequential && ' • NOW PLAYING IN SEQUENCE'}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => toggleSelection(file)}
                        style={{
                          ...styles.actionButton,
                          color: '#ef4444'
                        }}
                        title="Remove from selection"
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div style={styles.container}>
      <audio ref={audioRef} />
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <h1 style={styles.title}>Audio Player App</h1>
            <div style={styles.headerRight}>
              <div style={styles.detectionStatus}>
                {isDetectionConnected ? (
                  <Wifi size={16} />
                ) : (
                  <WifiOff size={16} />
                )}
                <span>{isDetectionConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div style={styles.selectionCounter}>
                Selected: {selectedFiles.length}/{SELECTION_LIMIT}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('library')}
              style={{
                ...styles.tab,
                ...(activeTab === 'library' ? styles.tabActive : styles.tabInactive)
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'library') {
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'library') {
                  e.target.style.color = '#bfdbfe';
                }
              }}
            >
              Library
            </button>
            <button
              onClick={() => setActiveTab('selection')}
              style={{
                ...styles.tab,
                ...(activeTab === 'selection' ? styles.tabActive : styles.tabInactive)
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'selection') {
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'selection') {
                  e.target.style.color = '#bfdbfe';
                }
              }}
            >
              Selection
            </button>
          </div>
        </div>
      </header>
      
      <main style={styles.main}>
        {/* Configuration Status Banner */}
        {!isFirebaseConfigured() && (
          <div style={{
            margin: '16px',
            padding: '16px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <div style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
              🔧 Firebase Setup Required
            </div>
            <div style={{ color: '#92400e' }}>
              Currently running in <strong>local storage mode</strong>. Auto-detection will not work.
              <br />
              To enable cloud storage and detection:
              <br />
              1. Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8' }}>console.firebase.google.com</a>
              <br />
              2. Replace the firebaseConfig in the code with your project's configuration
              <br />
              3. Enable Anonymous Authentication, Realtime Database, and update Firebase Storage rules
            </div>
          </div>
        )}

        {/* Detection Status and Controls */}
        {isFirebaseConfigured() && (
          <div style={styles.detectionInfo}>
            <div style={styles.detectionHeader}>
              <h3 style={styles.detectionTitle}>
                Animal Detection System
                {isDetectionConnected ? ' 🟢' : ' 🔴'}
              </h3>
              <div style={styles.autoPlayToggle}>
                <span>Auto-play:</span>
                <button
                  style={styles.toggleSwitch}
                  onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
                >
                  <div style={styles.toggleKnob}></div>
                </button>
              </div>
            </div>
            <div style={styles.detectionData}>
              {animalData ? (
                <>
                  {/* <strong>Current Detection:</strong> {animalData.detection} | 
                  <strong> Animal:</strong> {animalData.last_detected_animal} | 
                  <strong> Confidence:</strong> {animalData.confidence}% | 
                  <strong> Time:</strong> {animalData.detection_timestamp}
                  <br />
                  <strong>Status:</strong> {autoPlayEnabled ? 'Auto-play enabled' : 'Manual play only'} | 
                  <strong>Files in Selection:</strong> {selectedFiles.length}/7
                  <br /> */}
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Object.entries(ANIMAL_DETECTION_MAP).map(([num, animal]) => (
                      <span 
                        key={num}
                        style={{
                          fontSize: '12px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: animalData.detection == num ? animal.color : '#f3f4f6',
                          color: animalData.detection == num ? 'white' : '#6b7280',
                          fontWeight: animalData.detection == num ? 'bold' : 'normal'
                        }}
                      >
                        {num}: {animal.emoji} {animal.name}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const currentDetection = animalData.detection;
                      if (currentDetection >= 1 && currentDetection <= selectedFiles.length) {
                        const fileIndex = currentDetection - 1;
                        const fileToPlay = selectedFiles[fileIndex];
                        const animalInfo = ANIMAL_DETECTION_MAP[currentDetection];
                        playAudioByData(fileToPlay);
                        showToast(`${animalInfo?.emoji} Playing: ${fileToPlay.name} (${animalInfo?.name} Detection)`, '#10b981');
                      } else {
                        showToast(`No file for detection ${currentDetection}`, '#f59e0b');
                      }
                    }}
                    disabled={!animalData || selectedFiles.length === 0}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: selectedFiles.length > 0 ? 'pointer' : 'not-allowed',
                      marginTop: '8px',
                      marginRight: '8px',
                      opacity: selectedFiles.length > 0 ? 1 : 0.5
                    }}
                  >
                    ▶ Play Current Detection ({animalData?.detection || 0})
                  </button>
                </>
              ) : (
                isDetectionConnected ? 'Waiting for detection data...' : 'Connection to detection system failed'
              )}
            </div>
          </div>
        )}

        {/* Sequential Auto-Play Controls */}
        {selectedFiles.length > 0 && (
          <div style={{
            margin: '16px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontWeight: 'bold',
                color: '#0369a1',
                margin: 0
              }}>
                Sequential Auto-Play
              </h3>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                {!sequentialPlayEnabled ? (
                  <button
                    onClick={startSequentialPlay}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    ▶ Start Playlist
                  </button>
                ) : (
                  <button
                    onClick={stopSequentialPlay}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    ■ Stop Playlist
                  </button>
                )}
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#1e40af',
              lineHeight: '1.5'
            }}>
              {sequentialPlayEnabled ? (
                <>
                  <strong>Playlist Mode Active:</strong> Playing {currentSequentialIndex + 1} of {selectedFiles.length} files
                  <br />
                  <strong>Current:</strong> {selectedFiles[currentSequentialIndex]?.name || 'Loading...'}
                  <br />
                  <strong>Next:</strong> {selectedFiles[(currentSequentialIndex + 1) % selectedFiles.length]?.name || 'End of playlist'}
                </>
              ) : (
                <>
                  <strong>Playlist Ready:</strong> {selectedFiles.length} files in queue
                  <br />
                  <strong>Mode:</strong> Play all selected files in sequence automatically
                </>
              )}
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div style={styles.uploadSection}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            multiple
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={styles.uploadButton}
            disabled={!user}
            onMouseEnter={(e) => {
              if (user) e.target.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              if (user) e.target.style.backgroundColor = '#2563eb';
            }}
          >
            <Upload size={20} />
            <span>
              {!user 
                ? 'Initializing...' 
                : user.isLocal || !isFirebaseConfigured()
                  ? 'Upload Audio Files (Local Storage)'
                  : 'Upload Audio Files (Firebase Storage)'
              }
            </span>
          </button>
        </div>
        
        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div style={styles.uploadProgress}>
            <h3>Uploading files...</h3>
            {Object.entries(uploadProgress).map(([fileId, data]) => (
              <div key={fileId} style={styles.uploadProgressItem}>
                <Loader size={16} style={styles.loadingSpinner} />
                <span>Uploading {data.name}...</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Currently Playing Section */}
        {currentFileName && (
          <div style={styles.nowPlaying}>
            <div style={styles.nowPlayingTitle}>
              <h2 style={styles.nowPlayingTitleText}>Now Playing</h2>
              <p style={styles.nowPlayingFile}>{currentFileName}</p>
            </div>
            
            {/* Progress Bar */}
            <div style={styles.progressContainer}>
              <span style={styles.timeDisplay}>
                {formatDuration(position)}
              </span>
              <div
                style={styles.progressBar}
                onClick={handleSeek}
              >
                <div
                  style={{
                    ...styles.progressFill,
                    width: duration > 0 ? `${(position / duration) * 100}%` : '0%'
                  }}
                />
              </div>
              <span style={styles.timeDisplay}>
                {formatDuration(duration)}
              </span>
            </div>
            
            {/* Controls */}
            <div style={styles.controls}>
              <button
                onClick={stopAudio}
                style={{...styles.controlButton, ...styles.stopButton}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                <div style={styles.stopIcon} />
              </button>
              {currentlyPlayingIndex !== null && (
                <button
                  onClick={() => playAudio(currentlyPlayingIndex)}
                  style={{...styles.controlButton, ...styles.playButton}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Tab Content */}
        <div style={styles.tabContent}>
          {activeTab === 'library' ? renderLibraryList() : renderSelectionList()}
        </div>
      </main>
    </div>
  );
};

export default AudioPlayerApp;