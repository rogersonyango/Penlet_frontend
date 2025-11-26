import React from 'react';
import { Upload, FileText } from 'lucide-react';

const Documents = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Document Scanner</h1>
      <div className="card max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload size={40} className="text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Upload or Scan Documents</h2>
        <p className="text-gray-600 mb-6">Convert your physical documents to digital format with OCR</p>
        <button className="btn btn-primary">
          <Upload size={20} className="mr-2" />
          Upload Document
        </button>
      </div>
    </div>
  );
};

export default Documents;