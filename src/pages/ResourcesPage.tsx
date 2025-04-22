import React, { useState } from 'react';
import { mockResourceEntries, ResourceEntry } from '../types/resources';
import ResourceCard from '../components/ResourceCard';
import ResourceDetailModal from '../components/ResourceDetailModal';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'snippet', weight: 0.3 },
    { name: 'category', weight: 0.2 },
    { name: 'keywords', weight: 0.1 },
  ],
  includeScore: true,
  threshold: 0.4, // Adjust sensitivity (lower = more sensitive)
};

const ResourcesPage: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<ResourceEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fuse = new Fuse(mockResourceEntries, fuseOptions);

  const filteredResources = searchTerm
    ? fuse.search(searchTerm).map(result => result.item)
    : mockResourceEntries;

  const handleCardClick = (resource: ResourceEntry) => {
    setSelectedResource(resource);
  };

  const handleCloseModal = () => {
    setSelectedResource(null);
  };

  // Group resources by category
  const resourcesByCategory = filteredResources.reduce((acc, resource) => {
    const category = resource.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, ResourceEntry[]>);

  const categories = Object.keys(resourcesByCategory);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-10 overflow-y-auto">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Resources
      </motion.h1>

      {/* Search Bar */}
      <div className="mb-8 sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm py-4 -mx-6 px-6 md:-mx-10 md:px-10">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search resources (e.g., anxiety, counselling, sleep)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-300"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </div>

      {/* Resource Grid by Category */}
      <div className="flex-1">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <motion.div 
              key={category}
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2 text-gray-300">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resourcesByCategory[category].map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onClick={() => handleCardClick(resource)} 
                  />
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-gray-400 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No resources found matching your search term.
          </motion.p>
        )}
      </div>

      {selectedResource && (
        <ResourceDetailModal 
          resource={selectedResource} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default ResourcesPage; 