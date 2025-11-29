import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  File, 
  Star,
  Trash2,
  Download,
  FileText,
  Folder,
  Search,
  Filter,
  Upload,
  Image as ImageIcon,
  Eye,
  Maximize,
  Scissors,
  Sparkles,
  FileImage
} from 'lucide-react';
import {
  getDocuments,
  getStatistics,
  getFolders,
  createDocument,
  updateDocument,
  deleteDocument,
  toggleFavorite,
  performOCR,
  enhanceDocument,
  convertToPDF
} from '../../services/documentsApi';
import toast from 'react-hot-toast';

const CamScanner = () => {
  const [documents, setDocuments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(null);
  const [folderFilter, setFolderFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
    fetchStatistics();
    fetchFolders();
  }, [typeFilter, folderFilter, searchQuery]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments({
        documentType: typeFilter,
        folder: folderFilter,
        search: searchQuery || null
      });
      setDocuments(data.documents);
    } catch (error) {
      toast.error('Failed to load documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const fetchFolders = async () => {
    try {
      const data = await getFolders();
      setFolders(data.folders);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // In a real implementation, upload to server and create document record
      toast.success(`${files.length} file(s) selected for upload`);
      setShowUploadModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    
    try {
      await deleteDocument(id);
      toast.success('Document deleted');
      fetchDocuments();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await toggleFavorite(id);
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleOCR = async (id) => {
    try {
      toast.loading('Extracting text...', { id: 'ocr' });
      const result = await performOCR(id);
      toast.success(`Text extracted: ${result.word_count} words`, { id: 'ocr' });
      fetchDocuments();
    } catch (error) {
      toast.error('OCR failed', { id: 'ocr' });
    }
  };

  const handleEnhance = async (id) => {
    try {
      toast.loading('Enhancing image...', { id: 'enhance' });
      await enhanceDocument(id, {
        auto_crop: true,
        perspective_correction: true,
        brightness: 1.1,
        contrast: 1.1,
        apply_sharpen: true
      });
      toast.success('Image enhanced', { id: 'enhance' });
      fetchDocuments();
    } catch (error) {
      toast.error('Enhancement failed', { id: 'enhance' });
    }
  };

  const handleConvertToPDF = async () => {
    if (selectedDocs.length === 0) {
      toast.error('Select documents to convert');
      return;
    }

    try {
      toast.loading('Converting to PDF...', { id: 'pdf' });
      const result = await convertToPDF(
        selectedDocs,
        `scan_${Date.now()}.pdf`
      );
      toast.success(`PDF created: ${result.page_count} pages`, { id: 'pdf' });
      setSelectedDocs([]);
    } catch (error) {
      toast.error('PDF conversion failed', { id: 'pdf' });
    }
  };

  const handleViewDocument = (doc) => {
    setSelectedDoc(doc);
    setShowViewer(true);
  };

  const toggleSelectDoc = (id) => {
    setSelectedDocs(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const getDocTypeIcon = (type) => {
    const icons = {
      note: '📝',
      assignment: '📄',
      textbook: '📚',
      worksheet: '📋',
      certificate: '🎓',
      id_card: '🪪',
      receipt: '🧾',
      other: '📄'
    };
    return icons[type] || icons.other;
  };

  const getDocTypeColor = (type) => {
    const colors = {
      note: 'bg-blue-100 text-blue-800',
      assignment: 'bg-purple-100 text-purple-800',
      textbook: 'bg-green-100 text-green-800',
      worksheet: 'bg-orange-100 text-orange-800',
      certificate: 'bg-yellow-100 text-yellow-800',
      id_card: 'bg-pink-100 text-pink-800',
      receipt: 'bg-gray-100 text-gray-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cam Scanner</h1>
          <p className="text-gray-600 mt-1">Scan, organize, and manage your documents</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Camera size={20} />
            Scan Document
          </button>
          {selectedDocs.length > 0 && (
            <button
              onClick={handleConvertToPDF}
              className="btn flex items-center gap-2"
            >
              <File size={20} />
              Create PDF ({selectedDocs.length})
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileImage size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold">{statistics.total_documents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <File size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold">{statistics.total_pages}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">With OCR</p>
                <p className="text-2xl font-bold">{statistics.documents_with_ocr}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Folder size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage</p>
                <p className="text-2xl font-bold">{statistics.storage_used_mb} MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full"
            />
          </div>

          <select
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || null)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="note">Notes</option>
            <option value="assignment">Assignments</option>
            <option value="textbook">Textbooks</option>
            <option value="worksheet">Worksheets</option>
            <option value="certificate">Certificates</option>
            <option value="id_card">ID Cards</option>
            <option value="receipt">Receipts</option>
            <option value="other">Other</option>
          </select>

          <select
            value={folderFilter || ''}
            onChange={(e) => setFolderFilter(e.target.value || null)}
            className="input"
          >
            <option value="">All Folders</option>
            {folders.map(folder => (
              <option key={folder.name} value={folder.name}>
                {folder.name} ({folder.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="card text-center py-12">
          <Camera size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-4">Start scanning to build your document library</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary"
          >
            Scan Your First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`card group hover:shadow-lg transition-all cursor-pointer ${
                selectedDocs.includes(doc.id) ? 'ring-2 ring-primary-600' : ''
              }`}
              onClick={() => handleViewDocument(doc)}
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                {doc.thumbnail_url || doc.processed_image_url || doc.original_image_url ? (
                  <img
                    src={doc.processed_image_url || doc.original_image_url}
                    alt={doc.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectDoc(doc.id);
                    }}
                    className={`p-2 rounded-lg ${
                      selectedDocs.includes(doc.id)
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(doc.id);
                    }}
                    className="p-2 bg-white rounded-lg"
                  >
                    <Star
                      size={18}
                      className={doc.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}
                    />
                  </button>
                </div>
              </div>

              {/* Document Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-1">{doc.title}</h3>
                  <span className="text-lg">{getDocTypeIcon(doc.document_type)}</span>
                </div>

                {doc.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDocTypeColor(doc.document_type)}`}>
                    {doc.document_type}
                  </span>
                  {doc.has_ocr && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      OCR
                    </span>
                  )}
                  {doc.page_count > 1 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                      {doc.page_count} pages
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    <div>{formatDate(doc.created_at)}</div>
                    <div>{formatFileSize(doc.file_size)}</div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!doc.has_ocr && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOCR(doc.id);
                        }}
                        className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                        title="Extract Text (OCR)"
                      >
                        <FileText size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnhance(doc.id);
                      }}
                      className="p-1.5 hover:bg-purple-50 rounded text-purple-600"
                      title="Enhance"
                    >
                      <Sparkles size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {showViewer && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedDoc.title}</h2>
                <button
                  onClick={() => setShowViewer(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedDoc.processed_image_url || selectedDoc.original_image_url}
                alt={selectedDoc.title}
                className="w-full rounded-lg mb-4"
              />

              {selectedDoc.has_ocr && selectedDoc.extracted_text && (
                <div className="card bg-gray-50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText size={20} />
                    Extracted Text (Confidence: {selectedDoc.ocr_confidence?.toFixed(1)}%)
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedDoc.extracted_text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CamScanner;