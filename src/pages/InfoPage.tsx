import React from 'react';

const InfoPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About UniMind</h1>
      
      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            UniMind is a supportive AI companion designed to assist with mental wellness through conversation, 
            mood tracking, and journaling. It provides a safe space for self-reflection and emotional support.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Your privacy is our priority. All your data (chats, mood entries, journal entries) is stored 
            locally on your device. We do not collect or transmit your personal information to external servers.
          </p>
          <a 
            href="/privacy-policy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Read our Privacy Policy
          </a>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">How it Works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Chat Support</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Engage in supportive conversations with our AI companion. All conversations are private 
                and stored locally on your device.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Mood Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Track your daily moods and emotional patterns over time. Add notes to provide context 
                for your mood entries.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Journaling</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Keep a private journal to record your thoughts, feelings, and experiences. All entries 
                are stored securely on your device.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Version</h2>
          <p className="text-gray-700 dark:text-gray-300">
            UniMind Web v{import.meta.env.PACKAGE_VERSION || '0.1.0'}
          </p>
        </section>
      </div>
    </div>
  );
};

export default InfoPage;