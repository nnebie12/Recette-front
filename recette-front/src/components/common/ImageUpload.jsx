// recette-front/src/components/common/ImageUpload.jsx

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import Button from './Button';

const ImageUpload = ({ 
  currentImage = null, 
  onImageChange, 
  maxSize = 5, // MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  label = "Image de la recette",
  preview = true,
  className = ""
}) => {
  const [imagePreview, setImagePreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validation du format
    if (!acceptedFormats.includes(file.type)) {
      setError(`Format non supporté. Formats acceptés: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`);
      return;
    }

    // Validation de la taille
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`La taille du fichier dépasse ${maxSize}MB. Taille actuelle: ${fileSizeMB.toFixed(2)}MB`);
      return;
    }

    setUploading(true);

    try {
      // Créer une preview locale
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);

      // Callback avec le fichier et la preview
      if (onImageChange) {
        onImageChange(file, reader.result);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'image:', err);
      setError('Erreur lors du chargement de l\'image');
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageChange) {
      onImageChange(null, null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Zone de prévisualisation ou d'upload */}
        {imagePreview && preview ? (
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
            />
            
            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Changer
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <X className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            {uploading ? (
              <>
                <Loader className="w-12 h-12 text-orange-500 animate-spin mb-3" />
                <p className="text-gray-600 font-medium">Chargement...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium mb-1">
                  Cliquez pour ajouter une image
                </p>
                <p className="text-sm text-gray-500">
                  ou glissez-déposez
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, WEBP jusqu'à {maxSize}MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Info supplémentaire */}
      {!imagePreview && (
        <p className="mt-2 text-xs text-gray-500">
          Formats acceptés: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} • 
          Taille maximale: {maxSize}MB
        </p>
      )}
    </div>
  );
};

export default ImageUpload;