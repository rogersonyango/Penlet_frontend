const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Create a new scanned document
 * @param {Object} documentData - Document data
 * @returns {Promise<Object>} Created document
 */
export const createDocument = async (documentData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/documents?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create document: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create document error:', error);
    throw error;
  }
};

/**
 * Get all scanned documents with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} List of documents
 */
export const getDocuments = async ({
  documentType = null,
  folder = null,
  isFavorite = null,
  hasOcr = null,
  search = null,
  page = 1,
  pageSize = 20
} = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const params = new URLSearchParams({ user_id: userId, page, page_size: pageSize });
    
    if (documentType) params.append('document_type', documentType);
    if (folder) params.append('folder', folder);
    if (isFavorite !== null) params.append('is_favorite', isFavorite);
    if (hasOcr !== null) params.append('has_ocr', hasOcr);
    if (search) params.append('search', search);

    const response = await fetch(
      `${API_BASE_URL}/scanner/documents?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
};

/**
 * Get a specific document by ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Document details
 */
export const getDocument = async (documentId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/documents/${documentId}?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get document error:', error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} documentId - Document ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated document
 */
export const updateDocument = async (documentId, updateData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/documents/${documentId}?user_id=${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update document: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update document error:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Success message
 */
export const deleteDocument = async (documentId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/documents/${documentId}?user_id=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};

/**
 * Toggle favorite status
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Updated document
 */
export const toggleFavorite = async (documentId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/documents/${documentId}/favorite?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to toggle favorite: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Toggle favorite error:', error);
    throw error;
  }
};

/**
 * Perform OCR on a document
 * @param {string} documentId - Document ID
 * @param {string} language - OCR language (default: 'en')
 * @param {boolean} enhanceBeforeOcr - Apply enhancement before OCR
 * @returns {Promise<Object>} OCR result with extracted text
 */
export const performOCR = async (documentId, language = 'en', enhanceBeforeOcr = true) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/ocr?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: documentId,
          language,
          enhance_before_ocr: enhanceBeforeOcr
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to perform OCR: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('OCR error:', error);
    throw error;
  }
};

/**
 * Apply image enhancement
 * @param {string} documentId - Document ID
 * @param {Object} settings - Enhancement settings
 * @returns {Promise<Object>} Enhanced document
 */
export const enhanceDocument = async (documentId, settings) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/enhance/${documentId}?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: documentId,
          ...settings
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to enhance document: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Enhancement error:', error);
    throw error;
  }
};

/**
 * Convert documents to PDF
 * @param {Array<string>} documentIds - List of document IDs
 * @param {string} filename - Output PDF filename
 * @param {Object} options - Conversion options
 * @returns {Promise<Object>} PDF conversion result
 */
export const convertToPDF = async (documentIds, filename, options = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/convert-to-pdf?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_ids: documentIds,
          output_filename: filename,
          page_size: options.pageSize || 'A4',
          quality: options.quality || 85
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to convert to PDF: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PDF conversion error:', error);
    throw error;
  }
};

/**
 * Get scan statistics
 * @returns {Promise<Object>} Scan statistics
 */
export const getStatistics = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/statistics?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};

/**
 * Get all folders
 * @returns {Promise<Object>} List of folders with counts
 */
export const getFolders = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/scanner/folders?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch folders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get folders error:', error);
    throw error;
  }
};