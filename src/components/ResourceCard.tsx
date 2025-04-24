import React from 'react';
import { ResourceEntry } from '../types/resources';
import {
  BookOpen, // Default / Blog / Corner
  HelpCircle, // FAQs
  LifeBuoy, // Crisis Support
  Sparkles, // Self-Help
  GraduationCap, // Uni Events
  MessageSquare, // Chatbot FAQs
  ArrowRight, // Hover arrow
} from 'lucide-react';

type ResourceCardProps = {
  resource: ResourceEntry;
  onClick: () => void;
};

// Function to get the appropriate icon based on category
const getIconForCategory = (category: string): React.ElementType => {
  switch (category) {
    case 'Counselling FAQs':
    case 'Chatbot FAQs':
      return HelpCircle;
    case 'Self-Help':
      return Sparkles;
    case 'Crisis Support':
      return LifeBuoy;
    case 'Uni Events & Resources':
      return GraduationCap;
    case 'Mental Health Blog':
    case 'Counsellors Corner':
    default:
      return BookOpen;
  }
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  const CategoryIcon = getIconForCategory(resource.category);

  return (
    <button
      onClick={onClick}
      className="group relative bg-gray-800 rounded-lg shadow-lg p-6 text-left w-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
    >
      {/* Icon in top-left */}
      <div className="absolute top-4 left-4">
        <CategoryIcon className="w-6 h-6 text-pink-500" />
      </div>

      {/* Content - Added padding-left to avoid overlap with icon */}
      <div className="pl-10">
        <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
        <p className="text-sm text-gray-300 mb-4">{resource.snippet}</p>
      </div>

      {/* Hover Arrow Icon in bottom-right */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <ArrowRight className="w-5 h-5 text-pink-500" />
      </div>
    </button>
  );
};

export default ResourceCard; 