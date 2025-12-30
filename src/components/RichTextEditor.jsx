import React from 'react';

/**
 * RichTextEditor Component
 * 
 * Advanced rich text editor (can be replaced with library like TinyMCE or Quill)
 * For now, using simple textarea
 */
const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="w-full p-4 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
      />
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
        Tip: You can use Markdown formatting
      </div>
    </div>
  );
};

export default RichTextEditor;