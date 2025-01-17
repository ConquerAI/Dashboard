import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowDown, Loader2, Bug, ChevronDown, Image as ImageIcon, Pencil } from 'lucide-react';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';
import { fetchGeneratedPosts, GeneratedPost, updatePost } from '../../services/generated-posts';
import { toast } from 'react-hot-toast';
import { EditModal } from '../Modal/CalendarModal';
import axios from 'axios';

const gradients = [
  "from-blue-600 to-cyan-400",
  "from-purple-600 to-pink-400",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-green-400",
  "from-rose-500 to-pink-400",
  "from-indigo-500 to-blue-400"
];

interface PostCardProps {
  post: GeneratedPost;
  index: number;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  getPostTitle: (content: string) => string;
  onOpenModal: (post: GeneratedPost) => void;
  onPublish: (postId: string, post: GeneratedPost) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  index, 
  expandedId, 
  toggleExpand, 
  getPostTitle, 
  onOpenModal, 
  onPublish 
}) => {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative bg-white rounded-xl shadow-sm hover:shadow-md",
        "transition-all duration-300 cursor-pointer",
        "border border-gray-200 hover:border-gray-300",
        expandedId === post.id && "ring-2 ring-purple-500 ring-opacity-50"
      )}
      onClick={() => toggleExpand(post.id)}
    >
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity duration-300",
        "bg-gradient-to-br opacity-[0.07] group-hover:opacity-[0.10]",
        gradients[index % gradients.length]
      )} />

      <div className="relative p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {getPostTitle(post.post)}
          </h3>
          {expandedId !== post.id && (
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 ml-2 flex-shrink-0">
              {post.style}
            </span>
          )}
        </div>

        <AnimatePresence>
          {expandedId === post.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-100">
                <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-gray-100 mb-3">
                  {post.style}
                </span>

                {post.imageUrl && (
                  <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={post.imageUrl}
                      alt="AI Generated"
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      AI Generated
                    </div>
                  </div>
                )}

                <div className="relative mb-2">
                  <p className="text-gray-600 whitespace-pre-wrap cursor-pointer">
                    {post.post}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal(post);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-all duration-200 absolute right-0 top-0 p-1 focus:outline-none"
                  >
                    <Pencil className="w-4 h-4 hover:scale-125 transition-transform duration-200" />
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdTime).toLocaleDateString()}
                  </span>
                  {post.platform && (
                    <span className={cn(
                      "px-3 py-1 text-xs rounded-full font-medium",
                      post.platform.toLowerCase() === 'facebook' && "bg-blue-100 text-blue-700",
                      post.platform.toLowerCase() === 'twitter' && "bg-gray-100 text-gray-700",
                      post.platform.toLowerCase() === 'linkedin' && "bg-blue-100 text-blue-800",
                      post.platform.toLowerCase() === 'blog' && "bg-emerald-100 text-emerald-700"
                    )}>
                      {post.platform}
                    </span>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = "/scheduled-posts"}
                      className={cn(
                        "px-4 py-2 rounded-lg transition-all duration-200",
                        "text-sm font-medium flex items-center gap-2",
                        "bg-white hover:bg-gray-50 border border-gray-200",
                        "hover:border-gray-300 shadow-sm"
                      )}
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => onPublish(post.id, post)}
                      className={cn(
                        "px-4 py-2 rounded-lg transition-all duration-200",
                        "text-sm font-medium flex items-center gap-2",
                        "bg-white hover:bg-gray-50 border border-gray-200",
                        "hover:border-gray-300 shadow-sm"
                      )}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className={cn(
            "absolute bottom-2 right-2 p-1 rounded-full",
            "text-gray-400 hover:text-gray-600",
            "transition-transform duration-200",
            expandedId === post.id && "transform rotate-180"
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(post.id);
          }}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export function GoodStuffGrid() {
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextOffset, setNextOffset] = useState<string | undefined>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | undefined>(undefined);

  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = async () => {
    try {
      const response = await fetchGeneratedPosts();
      setPosts(response.posts);
      setNextOffset(response.offset);
      setDebugData(response);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts');
      toast.error('Failed to load posts');
      setDebugData({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const loadMore = async () => {
    if (!nextOffset || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetchGeneratedPosts(nextOffset);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 }
      });

      setPosts(prev => [...prev, ...response.posts]);
      setNextOffset(response.offset);
      setDebugData(response);
    } catch (error) {
      toast.error('Failed to load more posts');
      setDebugData({ error });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getPostTitle = (content: string) => {
    const firstLine = content.split('\n')[0];
    return firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;
  };

  const handleOpenModal = (post: GeneratedPost) => {
    setModalOpen(true);
    setCurrentPost(post);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentPost(undefined);
    setSaveError(null);
  };

  const handleSaveEdit = async (postId: string, editedPostText: string) => {
    if (!editedPostText) {
      toast.error('Post cannot be empty');
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await updatePost(postId, editedPostText);
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            post: editedPostText
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      toast.success('Post updated successfully!');
      setModalOpen(false);
      setCurrentPost(undefined);
    } catch (error) {
      setSaveError('Failed to update post');
      console.error('Failed to update post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  const onPublish = async (postId: string, post: GeneratedPost) => {
    if (post.platform?.toLowerCase() === 'linkedin') {
      try {
        const webhookURL = "https://hook.eu2.make.com/14cvfvtn1mw5unyjhso8i19qave64sdq";
        const response = await axios.post(webhookURL, { 
          postId, 
          post: post.post, 
          imageUrl: post.imageUrl 
        });
        if (response.status === 200) {
          toast.success("Post published to LinkedIn via webhook");
        }
      } catch (error) {
        console.error("Failed to send webhook to Make.com:", error);
        toast.error('Failed to publish to LinkedIn');
      }
    } else {
      toast.success(`Post Published to ${post.platform}`);
      console.log(`Publish button clicked for post ID: ${postId} for platform ${post.platform}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        {showDebug && debugData && (
          <pre className="mt-4 text-xs text-left bg-gray-50 p-4 rounded-lg overflow-auto max-h-60">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.header 
        className="mb-12 text-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          <Sparkles className="inline-block w-8 h-8 mr-2 mb-1" />
          Generated Posts
        </h1>
        <p className="mt-4 text-gray-600">Your AI-generated social media content</p>
        
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700"
          title="Toggle Debug Panel"
        >
          <Bug className="w-5 h-5" />
        </button>
      </motion.header>

      {showDebug && (
        <div className="mb-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Debug Information</h3>
            <span className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <pre className="text-xs text-gray-600 bg-white p-2 rounded max-h-60 overflow-auto">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            expandedId={expandedId}
            toggleExpand={toggleExpand}
            getPostTitle={getPostTitle}
            onOpenModal={handleOpenModal}
            onPublish={onPublish}
          />
        ))}
      </motion.div>

      <EditModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        post={currentPost}
        onSave={handleSaveEdit}
        isSaving={isSaving}
        saveError={saveError}
      />

      {nextOffset && (
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className={cn(
              "px-6 py-3 rounded-full transition-all duration-300 transform",
              "text-white font-medium",
              "bg-gradient-to-r from-purple-600 to-pink-600",
              "hover:from-purple-700 hover:to-pink-700",
              "hover:scale-105 hover:shadow-lg",
              "flex items-center gap-2 mx-auto",
              isLoadingMore && "opacity-75 cursor-not-allowed"
            )}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <span>Load More Posts</span>
                <ArrowDown className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}