import React from 'react';
import { ResourceEntry } from '../types/resources';
import {
  // General & Default
  BookOpen, Info, HelpCircle, MessageSquare, Sparkles, ArrowRight, UserCheck, Edit, FileText, MessageCircle, List,
  // Specific Topics
  HeartPulse, // Anxiety, Panic
  Brain, // CBT, Mental Health, Understanding
  Moon, // Sleep
  Cloudy, // Low Mood, Depression
  UserMinus, // Loneliness
  Users, // Social, Relationships
  LifeBuoy, // Crisis
  Phone, // Contact, Helpline
  GraduationCap, // Uni, Academic
  Calendar, // Events
  ClipboardCheck, // Eligibility, Registration
  Clock, // Session Duration, Time Management
  DollarSign, // Cost, Free
  Search, // Find, Discover
  Zap, // Stress
  Smile, // Wellbeing, Positivity
  // ... add more as needed based on resource IDs
} from 'lucide-react';

type ResourceCardProps = {
  resource: ResourceEntry;
  onClick: () => void;
};

// Function to get the appropriate icon based on resource ID
const getIconForResource = (resourceId: string): React.ElementType => {
  switch (resourceId) {
    // Counselling FAQs
    case 'faq-counselling-what-is': return Brain; // Understanding the concept
    case 'faq-counselling-eligibility': return ClipboardCheck; // Checklist, criteria
    case 'faq-counselling-what-to-expect': return Clock; // Session process/duration
    case 'faq-counselling-how-to-register': return Edit; // Form, sign up
    case 'faq-counselling-types': return List; // Different options

    // Self-Help
    case 'selfhelp-anxiety-panic': return HeartPulse; // Physical symptoms
    case 'selfhelp-low-mood-depression': return Cloudy; // Feeling down
    case 'selfhelp-sleep': return Moon;
    case 'selfhelp-stress': return Zap; // Feeling overwhelmed

    // Crisis Support
    case 'crisis-support-immediate-help': return LifeBuoy;

    // Counsellors Corner
    case 'counsellor-corner-loneliness': return UserMinus;
    case 'counsellor-corner-exam-stress': return GraduationCap; // Relates to exams
    case 'counsellor-corner-social-media': return Users; // Social aspect
    case 'counsellor-corner-procrastination': return Clock; // Time aspect

    // Uni Events & Resources
    case 'uni-resource-wellbeing-events': return Calendar;
    case 'uni-resource-academic-support': return GraduationCap;
    case 'uni-resource-financial-advice': return DollarSign; // Money related
    case 'uni-resource-disability-support': return UserCheck; // Specific support

    // Mental Health Blog
    case 'blog-mindfulness-intro': return Brain; // Mental technique
    case 'blog-positive-affirmations': return Smile;
    case 'blog-managing-burnout': return Zap; // Similar to stress
    case 'blog-building-resilience': return Sparkles; // Strength, growth

    // Chatbot FAQs
    case 'faq-chatbot-how-it-works': return MessageCircle;
    case 'faq-chatbot-privacy': return HelpCircle; // More general question
    case 'faq-chatbot-limitations': return Info; // Information symbol
    case 'faq-chatbot-personalization': return Edit; // Settings, customization

    // Default
    default:
      return BookOpen; // General resource/info
  }
};


const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  // Use the new function to get the icon based on resource ID
  const ResourceIcon = getIconForResource(resource.id);

  return (
    <button
      onClick={onClick}
      className="group relative bg-gray-800 rounded-lg shadow-lg p-6 text-left w-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
    >
      {/* Icon in top-left */}
      <div className="absolute top-4 left-4">
        {/* Render the specific resource icon */}
        <ResourceIcon className="w-6 h-6 text-pink-500" />
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