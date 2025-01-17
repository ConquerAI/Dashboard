import React from 'react';
import { Layout } from './components/Layout';
import { JournalistView } from './components/journalist/JournalistView';
import { ScheduledPosts } from './components/ScheduledPosts/ScheduledPosts';
import { Calendar } from './components/ScheduledPosts/Calendar';
import { GoodStuffGrid } from './components/premium/GoodStuffGrid';
import { ChatbotView } from './components/chatbot/ChatbotView';
import { ImageEditor } from './components/image-editor/ImageEditor';
import { useStore } from './store/useStore';
import { Toaster } from 'react-hot-toast';

function App() {
  const selectedTab = useStore((state) => state.selectedTab);

  const renderContent = () => {
    switch (selectedTab) {
      case 'journalist':
        return <JournalistView />;
      case 'scheduled-posts':
        return <ScheduledPosts />;
      case 'calendar':
        return <Calendar />;
      case 'premium':
        return <GoodStuffGrid />;
      case 'image-editor':
        return <ImageEditor />;
      case 'chatbot':
        return <ChatbotView />;
      default:
        return <JournalistView />;
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-gray-50">
        {renderContent()}
        <Toaster position="top-right" />
      </main>
    </Layout>
  );
}

export default App;