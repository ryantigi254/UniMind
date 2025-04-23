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
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-gray-900 rounded-xl shadow-2xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative text-gray-300 border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        style={{ boxShadow: '0 0 20px 3px rgba(236, 72, 153, 0.25)' }} // Pink underglow
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close resource detail"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white mb-8">{resource.title}</h2>
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300 hover:prose-a:underline prose-p:mb-4 prose-strong:text-white">
          <ReactMarkdown>{resource.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal; 