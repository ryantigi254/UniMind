import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from '@nextui-org/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JournalEntry } from './JournalCard'; // Assuming JournalCard defines the type

type JournalDetailModalProps = {
  entry: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (entry: JournalEntry) => void; // Function to handle editing
  onDelete: (entryId: string) => void; // Function to handle deletion
};

const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!entry) {
    return null; // Don't render the modal if no entry is selected
  }

  const handleEditClick = () => {
    if (entry) {
      onEdit(entry);
    }
  };

  const handleDeleteClick = () => {
    if (entry) {
      onDelete(entry.id);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="3xl" // Adjust size as needed
      scrollBehavior="inside" // Allows scrolling within the modal body
      backdrop="blur"
    >
      <ModalContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-semibold">{entry.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</p>
            </ModalHeader>
            <ModalBody className="py-6">
              {entry.imageUrl && (
                <div className="mb-6 flex justify-center">
                  <Image
                    isBlurred
                    width={400} // Adjust width as needed
                    src={entry.imageUrl}
                    alt={entry.title}
                    className="max-h-[400px] object-contain rounded-lg shadow-md"
                  />
                </div>
              )}
              {/* Use ReactMarkdown for rendering content */}
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {entry.content}
                </ReactMarkdown>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 justify-between">
              <div>
                <Button color="primary" variant="flat" onPress={handleEditClick} className="mr-2">
                  Edit
                </Button>
                <Button color="danger" variant="flat" onPress={handleDeleteClick}>
                  Delete
                </Button>
              </div>
              <Button color="danger" variant="light" onPress={close}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default JournalDetailModal; 