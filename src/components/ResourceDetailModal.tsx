import React from 'react';
import { ResourceEntry } from '../types/resources';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';

type ResourceDetailModalProps = {
  resource: ResourceEntry;
  onClose: () => void;
};

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl p-6 sm:p-10 max-w-3xl w-full relative text-gray-300 border border-gray-700 my-8"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 20px 3px rgba(236, 72, 153, 0.25)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          aria-label="Close resource detail"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">{resource.title}</h2>
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300 hover:prose-a:underline prose-headings:font-semibold prose-headings:mb-4 prose-p:my-4 prose-li:my-2 prose-strong:text-white">
          <ReactMarkdown>{resource.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal; 