import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from '@nextui-org/react';
import { JournalEntry } from './JournalCard'; // Assuming JournalCard defines the type

type JournalFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit: JournalEntry | null; // Pass null for creating, entry data for editing
  onSave: (entryData: Omit<JournalEntry, 'id'> | JournalEntry) => Promise<void>; // Function to handle saving (create or update)
};

const JournalFormModal: React.FC<JournalFormModalProps> = ({
  isOpen,
  onClose,
  entryToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Optional
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing an existing entry
  useEffect(() => {
    if (entryToEdit) {
      setTitle(entryToEdit.title);
      // Ensure date is in YYYY-MM-DD format for the input type="date"
      const formattedDate = entryToEdit.date ? new Date(entryToEdit.date).toISOString().split('T')[0] : '';
      setDate(formattedDate);
      setImageUrl(entryToEdit.imageUrl || '');
      setContent(entryToEdit.content);
    } else {
      // Reset form for creating a new entry
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]); // Default to today
      setImageUrl('');
      setContent('');
    }
    setError(null); // Clear errors when modal opens or entry changes
  }, [entryToEdit, isOpen]); // Rerun effect if entryToEdit changes or modal opens

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const entryData: Omit<JournalEntry, 'id'> | JournalEntry = entryToEdit
        ? { ...entryToEdit, title, date, imageUrl, content } // Update existing entry
        : { title, date, imageUrl, content, snippet: content.substring(0, 100) + '...' }; // Create new entry (simplified snippet)
      
      await onSave(entryData);
      onClose(); // Close modal on successful save
    } catch (err: any) {
      console.error("Error saving entry:", err);
      setError(err.message || 'Failed to save entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()} // Prevent closing while submitting
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
      isDismissable={!isSubmitting} // Prevent dismissing while submitting
    >
      <ModalContent className="bg-gray-900 text-gray-100 shadow-[0_4px_30px_rgba(236,_72,_153,_0.4)]">
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-700 pb-4">
              {entryToEdit ? 'Edit Journal Entry' : 'Create New Journal Entry'}
            </ModalHeader>
            <ModalBody className="py-6">
              {error && (
                <div className="bg-danger-100 border border-danger-400 text-danger-700 px-4 py-3 rounded mb-4" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}
              <Input
                label="Title"
                placeholder="Enter the title"
                value={title}
                onValueChange={setTitle}
                variant="bordered"
                isRequired
                isDisabled={isSubmitting}
                className="mb-4"
              />
              <Input
                label="Date"
                type="date" // Use date input type
                placeholder="Select the date"
                value={date}
                onValueChange={setDate}
                variant="bordered"
                isRequired
                isDisabled={isSubmitting}
                className="mb-4"
              />
              <Input
                label="Image URL (Optional)"
                placeholder="Enter image URL"
                value={imageUrl}
                onValueChange={setImageUrl}
                variant="bordered"
                isDisabled={isSubmitting}
                className="mb-4"
              />
              <Textarea
                label="Content"
                placeholder="Write your journal entry..."
                value={content}
                onValueChange={setContent}
                variant="bordered"
                isRequired
                minRows={10} // Adjust rows as needed
                isDisabled={isSubmitting}
                className="mb-4"
              />
            </ModalBody>
            <ModalFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button color="danger" variant="light" onPress={close} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default JournalFormModal; 