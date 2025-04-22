import React, { useState, useMemo } from 'react';
import { Input, Card, CardBody, CardHeader, Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react'; // Assuming you have lucide-react installed
import ReactMarkdown from 'react-markdown';
import { mockResourceEntries, ResourceEntry } from '../types/resources';

const ResourcesPage: React.FC = () => {
  console.log("[ResourcePage] Component rendering...");

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<ResourceEntry | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(mockResourceEntries.map(entry => entry.category))];
    return uniqueCategories;
  }, []);

  const filteredResources = useMemo(() => {
    return mockResourceEntries.filter(entry => {
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.keywords && entry.keywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleCardClick = (resource: ResourceEntry) => {
    setSelectedResource(resource);
    onOpen();
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          isClearable
          placeholder="Search resources..."
          startContent={<SearchIcon className="text-gray-400" size={18} />}
          value={searchTerm}
          onClear={() => setSearchTerm('')}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select
          label="Filter by Category"
          placeholder="Select a category"
          selectedKeys={selectedCategory === 'all' ? [] : [selectedCategory]}
          onChange={(e) => setSelectedCategory(e.target.value || 'all')}
          className="md:w-64"
        >
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card 
            key={resource.id} 
            isPressable 
            onPress={() => handleCardClick(resource)}
            className="bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <CardHeader className="flex flex-col items-start">
              <p className="text-tiny uppercase font-bold text-gray-400">{resource.category}</p>
              <h4 className="font-bold text-large text-white">{resource.title}</h4>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-gray-300 text-sm">{resource.snippet}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Resource Detail Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
        <ModalContent className="bg-gray-800 text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                {selectedResource?.title}
                <p className="text-sm font-normal text-gray-400">{selectedResource?.category}</p>
              </ModalHeader>
              <ModalBody>
                {selectedResource && (
                  <ReactMarkdown
                    className="prose prose-invert max-w-none"
                    components={{
                      // Customize rendering if needed, e.g., for links
                      a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" />
                    }}
                  >
                    {selectedResource.content}
                  </ReactMarkdown>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ResourcesPage; 