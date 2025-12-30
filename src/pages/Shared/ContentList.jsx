import React from 'react';
import { FileText, Video, ClipboardList, Eye, Download } from 'lucide-react';

/**
 * ContentList Component
 * 
 * Reusable component to display content in a list
 */
const ContentList = ({ content = [], onView, onDownload }) => {
  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'assignment': return ClipboardList;
      default: return FileText;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case 'video': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'assignment': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  if (content.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No content available</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Check back later for new materials</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 shadow rounded-lg">
      {content.map((item) => {
        const Icon = getContentIcon(item.type);
        return (
          <li key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <div className={`flex-shrink-0 ${getContentColor(item.type)} rounded-lg p-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.description}</p>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                {onView && (
                  <button onClick={() => onView(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                    <Eye className="h-5 w-5" />
                  </button>
                )}
                {onDownload && (
                  <button onClick={() => onDownload(item)} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">
                    <Download className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ContentList;