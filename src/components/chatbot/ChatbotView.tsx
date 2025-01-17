import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { sendChatMessage, ChatMessage } from '../../services/perplexity';
import { toast } from 'react-hot-toast';
import { Article } from '../../types';
import { ChatbotDebugPanel } from './ChatbotDebugPanel';
import { ChatbotStyleSelector } from './ChatbotStyleSelector';

interface ChatMessageWithActions extends ChatMessage {
  showActions?: boolean;
}

const ActionButton = ({ onClick, variant = "primary", children }: { 
  onClick: () => void, 
  variant?: "primary" | "secondary", 
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-lg font-medium transition-all duration-200",
      variant === "primary" 
        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    )}
  >
    {children}
  </button>
);

export function ChatbotView() {
  const [messages, setMessages] = useState<ChatMessageWithActions[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [debugData, setDebugData] = useState<any>({});
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [conversationMode, setConversationMode] = useState<'casual' | 'research'>('casual');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerateContent = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      setSelectedContent(lastMessage.content);
      setShowStyleSelector(true);
    }
  };

  if (showStyleSelector) {
    return (
      <ChatbotStyleSelector
        onBack={() => setShowStyleSelector(false)}
        content={selectedContent}
      />
    );
  }

  const shouldShowActions = (content: string) => {
    const hasArticleFormat = (
      content.includes("Here's what I found about") || 
      content.includes("Here's some articles about")
    );
    
    const hasArticleEntries = /'\d{2}\/\d{2}\/\d{4}'/.test(content);
    const hasDescriptions = content.includes("✓");
    
    return hasArticleFormat && (hasArticleEntries || hasDescriptions);
  };

  const handleFindMoreArticles = async () => {
    try {
      setIsLoading(true);
      const userMessage: ChatMessageWithActions = {
        role: 'user',
        content: "Could you find different articles about the same topic?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      const response = await sendChatMessage(userMessage.content);
      
      setDebugData(prev => ({
        ...prev,
        lastMessage: userMessage,
        apiResponse: response,
        conversationMode
      }));
      
      const assistantMessage: ChatMessageWithActions = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Full error details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageWithActions = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage.content);
      
      if (response.includes("Here's what I found about")) {
        setConversationMode('research');
      }
      
      setDebugData(prev => ({
        ...prev,
        lastMessage: userMessage,
        apiResponse: response,
        conversationMode
      }));
      
      const assistantMessage: ChatMessageWithActions = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Full error details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response from AI');
      setDebugData(prev => ({ ...prev, error }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssistantMessage = (content: string) => {
    // Updated regex to better match article titles and URLs
    const articleRegex = /-\s*['"]?([^'"]+)['"]?\s*\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;

    while (true) {
      const match = articleRegex.exec(content);
      if (!match) break;

      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {content.slice(lastIndex, match.index)}
          </span>
        );
      }

      const title = match[1].trim();
      const url = match[2];

      parts.push(
        <span key={`article-${match.index}`}>
          - {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 transition-colors duration-200 font-medium"
            >
              {title}
            </a>
          ) : (
            <span className="font-medium">{title}</span>
          )}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {content.slice(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-violet-500 to-purple-500">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-xl font-bold text-white">Healthcare AI Assistant</h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-white/80">Your intelligent healthcare companion</p>
                <button
                  onClick={() => setIsDebugOpen(!isDebugOpen)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  title="Toggle Debug Panel"
                >
                  <Bug className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    message.role === 'assistant' 
                      ? "bg-gradient-to-r from-violet-500 to-purple-500"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  )}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={cn(
                    "flex-1",
                    message.role === 'user' && "flex flex-col items-end"
                  )}>
                    <div className={cn(
                      "rounded-2xl p-4 max-w-[80%]",
                      message.role === 'assistant' 
                        ? "bg-gray-100 rounded-tl-none" 
                        : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-none"
                    )}>
                      <p className={cn(
                        "whitespace-pre-wrap",
                        message.role === 'user' && "text-white"
                      )}>
                        {message.role === 'assistant'
                          ? renderAssistantMessage(message.content)
                          : message.content}
                      </p>
                      {message.role === 'assistant' && shouldShowActions(message.content) && (
                        <div className="mt-4 flex gap-3">
                          <ActionButton onClick={handleGenerateContent}>
                            Generate Post ✨
                          </ActionButton>
                          <ActionButton onClick={handleFindMoreArticles} variant="secondary">
                            Find Different Articles 🔄
                          </ActionButton>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  "bg-gradient-to-r from-violet-500 to-purple-500",
                  "text-white font-medium",
                  "hover:from-violet-600 hover:to-purple-600",
                  "transition-all duration-200",
                  "flex items-center gap-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
      <ChatbotDebugPanel
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        data={debugData}
      />
    </div>
  );
}