import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import ChatBotAvatar from '../components/ChatBotAvatar';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDisclaimerAccepted } = useStore();

  const handleAccept = () => {
    setDisclaimerAccepted(true);
    navigate('/');
  };

  const handleBack = () => {
    navigate('/auth');
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full mx-auto shadow-xl border border-gray-800">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center mb-8">
            <ChatBotAvatar size={80} />
          </div>

          <h1 className="text-2xl font-bold text-white text-center">
            Welcome to UniMind
          </h1>

          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">
                What UniMind Is
              </h2>
              <p className="text-gray-300">
                UniMind is a supportive AI companion designed to assist with mental wellness through conversation, mood tracking, and journaling. It provides a safe space for self-reflection and emotional support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">
                What UniMind Is Not
              </h2>
              <p className="text-gray-300">
                UniMind is not a replacement for professional mental health care. It cannot diagnose conditions or provide medical advice. If you're experiencing a crisis, please use the Crisis Support button to access emergency services and professional help.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">
                Privacy
              </h2>
              <p className="text-gray-300">
                Your privacy is our priority. All your data (chats, mood entries, journal entries) is stored locally on your device. We do not collect or transmit your personal information to external servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">
                Terms of Use
              </h2>
              <p className="text-gray-300">
                By using UniMind, you acknowledge that it is a supportive tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions you may have.
              </p>
            </section>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-800">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
            >
              Go Back
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;