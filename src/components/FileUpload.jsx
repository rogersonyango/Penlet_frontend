import React, { useState, useCallback } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * FileUpload Component
 * 
 * Reusable file upload component with drag & drop
 * Supports file validation, progress tracking, and preview
 */
const FileUpload = ({ 
  onFileSelect, 
  accept = '*',
  maxSize = 100 * 1024 * 1024, // 100MB default
  multiple = false,
  disabled = false 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // File type labels
  const getFileTypeLabel = (type) => {
    const typeMap = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'video/mp4': 'MP4',
      'video/x-msvideo': 'AVI',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
    };
    return typeMap[type] || type.split('/')[1]?.toUpperCase() || 'FILE';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    // Check file type if accept is specified
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileExtension = '.' + file.name.split('.').pop();
      const fileType = file.type;
      
      const isAccepted = acceptedTypes.some(type => 
        type === fileType || type === fileExtension
      );

      if (!isAccepted) {
        return `File type not accepted. Allowed: ${accept}`;
      }
    }

    return null;
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [disabled]);

  // Handle file selection
  const handleFileInput = (e) => {
    setError(null);
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  // Process file
  const handleFile = (file) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Call parent callback
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  // Remove file
  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setProgress(0);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Simulate upload (replace with actual upload logic)
  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      {!selectedFile && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center
            transition-all duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* File Input */}
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Icon */}
          <Upload 
            className={`
              mx-auto h-12 w-12 mb-4
              ${dragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}
            `}
          />

          {/* Text */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dragActive ? 'Drop file here' : 'Drag & drop file here'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            or click to browse
          </p>

          {/* File Info */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {accept !== '*' && <span>Accepted: {accept}</span>}
            {accept !== '*' && maxSize && <span className="mx-2">•</span>}
            {maxSize && <span>Max size: {formatFileSize(maxSize)}</span>}
          </p>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            {/* File Icon */}
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <File className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            {/* File Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getFileTypeLabel(selectedFile.type)} • {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                {/* Remove Button */}
                {!uploading && (
                  <button
                    onClick={removeFile}
                    className="ml-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success Message */}
              {!uploading && progress === 100 && (
                <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Upload complete
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-start space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Button (optional) */}
      {selectedFile && !uploading && progress !== 100 && (
        <button
          onClick={simulateUpload}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Upload File
        </button>
      )}
    </div>
  );
};

export default FileUpload;