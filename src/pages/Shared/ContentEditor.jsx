import React, { useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link } from 'lucide-react';

/**
 * ContentEditor Component
 * 
 * Simple rich text editor for content description
 */
const ContentEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        contentEditable
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (onChange) onChange(e.target.innerHTML);
        }}
        onInput={(e) => {
          if (onChange) onChange(e.target.innerHTML);
        }}
        className="min-h-[200px] p-4 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        dangerouslySetInnerHTML={{ __html: value || '' }}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default ContentEditor;