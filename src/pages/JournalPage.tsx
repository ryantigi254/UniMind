import React, { useState, useEffect } from 'react';
import { useDisclosure, Button, Spinner } from '@nextui-org/react';
import JournalCard, { JournalEntry } from '../components/journal/JournalCard';
import JournalDetailModal from '../components/journal/JournalDetailModal';
import JournalFormModal from '../components/journal/JournalFormModal';
// import { createClient } from '@supabase/supabase-js'; // Import Supabase client if needed

// Mock data - replace with actual data fetching later
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Random, but beautiful, acts of kindness',
    date: '2024-07-25',
    imageUrl: '/placeholder-images/journal-kindness.jpg',
    snippet: 'Exploring small gestures that make a big difference.',
    // Using plain text content for safety in <pre>
    content: `Today felt different. I decided to consciously look for opportunities to perform small, random acts of kindness. It started with holding the door open for someone juggling packages, then paying for the coffee of the person behind me in line.\n\nIt's fascinating how these tiny actions ripple outwards. The smiles, the brief moments of connection – they brightened my day as much as theirs. It reminded me that even on ordinary days, we have the power to create little pockets of beauty and warmth.`,
  },
  {
    id: '2',
    title: 'Foods for better gut health',
    date: '2024-07-24',
    imageUrl: '/placeholder-images/journal-gut-health.jpg',
    snippet: 'Learning about the connection between food and gut microbiome.',
    content: `Dived into some research about gut health today. It's amazing how much our digestive system influences overall well-being, including mood and immunity.\n\n- Started incorporating more fermented foods like kimchi and yogurt.\n- Trying to increase fiber intake with more vegetables and whole grains.\n- Reducing processed sugars feels like a good step too.\n\nIt's a journey, but feeling hopeful about the positive changes.`,
  },
    {
    id: '3',
    title: 'Make someone feel special',
    date: '2024-07-23',
    imageUrl: '/placeholder-images/journal-special.jpg', // Make sure these paths exist or use URLs
    snippet: 'The simple power of genuine appreciation.',
    content: `Focused on making someone feel genuinely appreciated today. I sent a heartfelt thank-you note to a colleague who went above and beyond on a recent project. Their surprised and happy reaction was incredibly rewarding.\n\nIt takes so little effort to acknowledge the good in others, yet it can mean so much. A reminder to myself to practice this more often.`,
  },
  {
    id: '4',
    title: 'Get philosophical',
    date: '2024-07-22',
    imageUrl: '/placeholder-images/journal-philosophical.jpg', // Make sure these paths exist or use URLs
    snippet: 'Contemplating the big questions and finding peace in the unknown.',
    content: `Spent the evening pondering some of life's bigger questions. What is purpose? What defines happiness?\n\nThere aren't always easy answers, and maybe that's the point. Embracing the questions, the uncertainty, and the journey of discovery itself can be a source of profound peace and growth. It's okay not to have it all figured out.`,
  },
  // Add more mock entries based on the images provided if needed
  {
    id: '5',
    title: 'Learn about something new',
    date: '2024-07-21',
    imageUrl: '/placeholder-images/journal-learn.jpg', // Make sure these paths exist or use URLs
    snippet: 'Expanding horizons, one new fact at a time.',
    content: `Took some time today to learn about astrophysics – specifically, black holes. It's mind-bending stuff! While I barely scratched the surface, the sheer scale and mystery of the universe are awe-inspiring.\n\nIt felt good to stretch my brain in a completely new direction. A good reminder that there's always more to learn and discover, no matter how small the topic.`,
  },
   {
    id: '6',
    title: 'Tell me about...',
    date: '2024-07-20',
    imageUrl: '/placeholder-images/journal-tell-me.jpg', // Make sure these paths exist or use URLs
    snippet: 'The power of asking questions and active listening.',
    content: `Practiced active listening today. Instead of waiting for my turn to talk, I focused on truly understanding what others were saying, asking clarifying questions like "Tell me more about that...".\n\nIt led to much richer conversations and deeper connections. It's amazing what you can learn when you simply stop and listen.`,
  },
    {
    id: '7',
    title: 'Health and wellness trends of 2024',
    date: '2024-07-19',
    imageUrl: '/placeholder-images/journal-trends.jpg', // Make sure these paths exist or use URLs
    snippet: 'Exploring what's new in the world of well-being.',
    content: `Read an article summarizing the top health and wellness trends for this year. Some interesting points about personalized nutrition, mental fitness apps, and the growing importance of sleep hygiene.\n\nWhile trends come and go, the underlying theme seems to be a more holistic and individualized approach to health. It's less about quick fixes and more about sustainable lifestyle changes.`,
  },
  {
    id: '8',
    title: 'Perfect your sleeping environment',
    date: '2024-07-18',
    imageUrl: '/placeholder-images/journal-sleep.jpg', // Make sure these paths exist or use URLs
    snippet: 'Creating a sanctuary for restful nights.',
    content: `Decided to optimize my bedroom for better sleep. Key changes:\n\n- Installed blackout curtains to block out morning light.\n- Set a cooler room temperature.\n- Removed electronics from the nightstand (phone charges across the room now).\n- Trying a calming lavender pillow spray.\n\nHoping these adjustments lead to more restorative sleep!`,
  },
];

// Placeholder Supabase client setup (replace with your actual setup)
// const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure(); // Detail modal
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure(); // Form modal
  const [entryToEdit, setEntryToEdit] = useState<JournalEntry | null>(null); // State to hold entry being edited

  // --- Data Fetching --- 
  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- Replace with actual Supabase call --- 
        // Ensure you only fetch entries for the logged-in user
        // const { data: userData, error: userError } = await supabase.auth.getUser();
        // if (userError || !userData?.user) throw new Error('User not logged in');
        // const userId = userData.user.id;

        // const { data, error } = await supabase
        //   .from('journal_entries') // Replace with your table name
        //   .select('*')
        //   .eq('user_id', userId) // Filter by user ID
        //   .order('date', { ascending: false });

        // if (error) throw error;

        // Simulating fetch with mock data and delay
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        setEntries(mockJournalEntries); // Replace with setEntries(data || []);
        // --- End of Supabase call replacement --- 

      } catch (err: any) {
        console.error("Error fetching journal entries:", err);
        setError(err.message || 'Failed to fetch journal entries.');
        setEntries([]); // Clear entries on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // --- CRUD Handlers (Placeholders) --- 

  const handleCreate = () => {
    setEntryToEdit(null); // Ensure we are creating, not editing
    onFormOpen(); // Open the form modal for creating
  };

  const handleEdit = (entry: JournalEntry) => {
    setEntryToEdit(entry); // Set the entry to edit
    onDetailClose(); // Close the detail modal
    onFormOpen(); // Open the form modal for editing
  };

  const handleDelete = async (entryId: string) => {
    // Confirmation Dialog
    if (!window.confirm("Are you sure you want to delete this journal entry?")) {
      return; // Abort if user cancels
    }

    console.log("Deleting entry:", entryId);
    // Close detail modal *before* starting delete process
    onDetailClose();
    setIsLoading(true); // Indicate loading state during delete
    setError(null);

    try {
      // --- Replace with actual Supabase call --- 
      // const { error } = await supabase
      //   .from('journal_entries')
      //   .delete()
      //   .match({ id: entryId }); 
      // if (error) throw error;
      
      // Simulate delete with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // --- End of Supabase call replacement ---

      // Update local state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
    } catch (err: any) {
      console.error("Error deleting entry:", err);
      setError(err.message || 'Failed to delete entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (entryData: Omit<JournalEntry, 'id'> | JournalEntry) => {
    // This function will be called by JournalFormModal on submit
    // It needs to handle both creating and updating
    console.log("Saving entry:", entryData);
    // No need for setIsLoading here, the form modal handles its own submitting state
    setError(null);

    try {
      if ('id' in entryData) { 
        // --- Update Existing Entry (Replace with Supabase call) --- 
        console.log("Updating entry with ID:", entryData.id);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate update
        // const { data, error } = await supabase.from('journal_entries').update({...entryData}).match({ id: entryData.id }).select().single();
        // if (error) throw error;
        // Update local state
        setEntries(prev => prev.map(e => e.id === entryData.id ? entryData : e)); // Replace entryData with data if using select()
        // --- End of Update Call --- 
      } else {
        // --- Create New Entry (Replace with Supabase call) --- 
        console.log("Creating new entry");
        // Ensure you associate the entry with the logged-in user in your Supabase call
        const newEntryId = Date.now().toString(); // Mock ID generation
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate create
        const newEntry = { ...entryData, id: newEntryId }; // Mock result
        // const { data, error } = await supabase.from('journal_entries').insert({...entryData, user_id: userId }).select().single();
        // if (error) throw error;
        // Add to local state
        setEntries(prev => [newEntry, ...prev]); // Add new entry to the beginning (replace newEntry with data)
        // --- End of Create Call --- 
      }
      // onFormClose(); // Form closes itself on success
    } catch (err: any) {
      console.error("Error saving entry:", err);
      setError(`Failed to save entry: ${err.message || 'Unknown error'}`);
      // Re-throw the error so the form modal can catch it and display it
      throw err;
    }
  };

  // --- Modal Handling --- 

  const handleCardClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    onDetailOpen();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Journal</h1>
        <Button color="primary" onPress={handleCreate} startIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>}>
          New Entry
        </Button>
      </div>

      {/* Loading State */} 
      {isLoading && !error && (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Loading entries..." color="primary" />
        </div>
      )}

      {/* Error State */} 
      {error && (
        <div className="bg-danger-100 border border-danger-400 text-danger-700 dark:bg-danger-900 dark:border-danger-600 dark:text-danger-200 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Empty State */} 
      {!isLoading && !error && entries.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Your journal is empty. Create your first entry!
          </p>
        </div>
      )}

      {/* Entries Grid */} 
      {!isLoading && !error && entries.length > 0 && (
        <div className="grid grid-cols-12 gap-6">
          {entries.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onClick={() => handleCardClick(entry)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */} 
      {selectedEntry && (
        <JournalDetailModal
          entry={selectedEntry}
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Form Modal (for Create/Edit) */} 
      <JournalFormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        entryToEdit={entryToEdit} // Pass null for create, entry data for edit
        onSave={handleSave} // Pass the save handler
      />
    </div>
  );
};

export default JournalPage;