import React from 'react';
import { ResourceEntry } from '../types/resources';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';
import { Components } from 'react-markdown';

type ResourceDetailModalProps = {
  resource: ResourceEntry;
  onClose: () => void;
};

const markdownComponents: Components = {
  h2: ({node, ...props}) => <h2 className="text-xl sm:text-2xl font-semibold text-white mt-6 mb-3" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-lg sm:text-xl font-semibold text-white mt-5 mb-2" {...props} />,
  p: ({node, ...props}) => <p className="my-4 text-sm sm:text-base" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc list-inside my-4 ml-4 space-y-2" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal list-inside my-4 ml-4 space-y-2" {...props} />,
  li: ({node, ...props}) => <li className="text-sm sm:text-base" {...props} />,
  strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
  a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" {...props} />,
};

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl p-6 sm:p-10 max-w-3xl w-full relative text-gray-300 border border-gray-700 my-8"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 25px 4px rgba(236, 72, 153, 0.2)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-white transition-colors z-10 p-1 rounded-full hover:bg-gray-700"
          aria-label="Close resource detail"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">{resource.title}</h1>
        <div className="text-sm sm:text-base">
          <ReactMarkdown components={markdownComponents}>
            {resource.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal; 