import React, { useState, useEffect } from 'react';
import { useDisclosure, Button, Spinner } from '@nextui-org/react';
import JournalCard, { JournalEntry } from '../components/journal/JournalCard';
import JournalDetailModal from '../components/journal/JournalDetailModal';
import JournalFormModal from '../components/journal/JournalFormModal';
// import { createClient } from '@supabase/supabase-js'; // Import Supabase client if needed

// Mock data reflecting common student mental health themes
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Feeling Overwhelmed by Deadlines',
    date: '2024-11-15',
    imageUrl: '/img/images/CineDiffusion Image.webp',
    snippet: 'Trying to manage the stress of multiple assignments due soon...',
    content: `Feeling the pressure pile up this week. Two essays and a presentation due next Friday. It's hard to know where to start. Tried breaking tasks down like the stress management resources suggest, but my focus keeps drifting. Deep breathing helped a little this morning. Maybe I should try that 7-11 technique mentioned in the blog? Just need to get through this week. Remembering that it's okay to feel stressed, but need to find ways to cope without burning out.`,
  },
  {
    id: '2',
    title: 'Navigating Social Anxiety at Uni Event',
    date: '2024-11-12',
    imageUrl: '/img/images/CineDiffusion Image 1.webp',
    snippet: 'Went to the society mixer tonight. It was tough, but I did it.',
    content: `Pushed myself to go to the mixer tonight. Heart was pounding just walking in. Wanted to turn back, but remembered the advice about small steps. Talked to two new people – mostly small talk, but it's a start. Felt awkward, but also a bit proud for not just staying in my room. Loneliness has been hitting hard lately, so trying to connect is important, even if it feels scary. Maybe the next one will be easier?`,
  },
  {
    id: '3',
    title: 'First Drop-In Session Experience',
    date: '2024-11-10',
    imageUrl: '/img/images/CineDiffusion Image 2.webp',
    snippet: 'Booked a drop-in with the Counselling & Mental Health team today.',
    content: `Finally booked one of those drop-in sessions. Was really nervous beforehand, wasn't sure what to expect or if my problems were 'valid' enough. The person I spoke to was really understanding, didn't feel judged at all. Just talking about feeling low and unmotivated for 20 minutes actually helped lift some weight. They signposted me to some self-help resources on the Student Hub too. Might try the longer counselling sessions if things don't improve.`,
  },
  {
    id: '4',
    title: 'Struggling with Homesickness',
    date: '2024-11-05',
    imageUrl: '/img/images/CineDiffusion Image 3.webp',
    snippet: 'Missing home and family a lot this week.',
    content: `It hit me hard this week, especially seeing friends back home posting pictures together. Feeling really disconnected here sometimes. It helps talking to family on video calls, but it's not the same. The ISSS info mentioned culture shock and how it's normal. Trying to remind myself of that. Maybe I should check out that international student society meeting next week? Need to find ways to build a sense of community here.`,
  },
  {
    id: '5',
    title: 'Mindfulness Practice - Trying the Chocolate Meditation',
    date: '2024-11-02',
    imageUrl: '/img/images/CineDiffusion Image 4.webp',
    snippet: 'Tried that mindful chocolate eating exercise from the Counsellors\' Corner...',
    content: `Decided to try the chocolate meditation mentioned online. Seemed a bit silly at first, just focusing on a piece of chocolate. But it was actually quite grounding. Forced me to slow down and just notice the sensations instead of letting my mind race about assignments or worries. Didn't magically fix anything, but it was a nice 5-minute pause. Maybe I can incorporate small mindful moments like this more often.`,
  },
  {
    id: '6',
    title: 'Worrying About Exam Results',
    date: '2024-10-28',
    imageUrl: '/img/images/CineDiffusion Image 5.webp',
    snippet: `Can't stop thinking about the results coming out next week.`,
    content: `The wait for exam results is agonising. Keep replaying the questions in my head, worrying I messed up. It's hard to concentrate on this term's work. Tried distracting myself, went for a run like the mental health awareness week stuff suggested, which helped temporarily. Need to accept I've done all I can now and stressing won't change the outcome. Easier said than done!`,
  },
  {
    id: '7',
    title: 'Finding Balance - Avoiding Burnout',
    date: '2024-10-22',
    imageUrl: '/img/images/CineDiffusion Image 6.webp',
    snippet: 'Realised I haven\'t taken a proper break in weeks. Need to prioritise self-care.',
    content: `Felt completely drained today. Looked back at my calendar and realised it's been non-stop study and work. No wonder I feel like I'm running on empty. Read something about scheduling breaks like appointments. Going to try blocking out time for a walk tomorrow and maybe just reading a book for fun, not for the course. Need to find a better balance before I crash.`,
  },
  {
    id: '8',
    title: 'Imposter Syndrome Creeping In',
    date: '2024-10-18',
    imageUrl: '/img/images/CineDiffusion Image 7.webp',
    snippet: 'Feeling like I don\'t belong here or deserve my place.',
    content: `Had a supervision meeting today and felt like a complete fraud. Everyone else seems to know exactly what they're doing. That voice in my head keeps saying I'm not smart enough and I'll be found out soon. It's exhausting. Remembered reading about imposter syndrome on Student Minds. Knowing it's a common thing helps a tiny bit. Need to focus on my actual progress, not just my fears.`,
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
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
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