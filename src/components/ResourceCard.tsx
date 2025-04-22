import React from 'react';
import { ResourceEntry } from '../types/resources';

type ResourceCardProps = {
  resource: ResourceEntry;
  onClick: () => void;
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800 rounded-lg shadow-lg p-6 text-left w-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
      <p className="text-gray-400 text-sm">{resource.snippet}</p>
    </button>
  );
};

export default ResourceCard; 