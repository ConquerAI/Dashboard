import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Calendar } from '../ScheduledPosts/Calendar';
import { GeneratedPost } from '../../services/generated-posts';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    post?: GeneratedPost;
    onSave: (postId: string, editedPostText: string) => Promise<void>;
    isSaving: boolean;
    saveError: string | null;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, post, onSave, isSaving, saveError }) => {
    const [editedText, setEditedText] = useState('');

    // Update editedText when post changes
    useEffect(() => {
        if (post?.post) {
            setEditedText(post.post);
        }
    }, [post]);

    if (!isOpen || !post) return null;

    const handleSave = () => {
        onSave(post.id, editedText);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-2xl relative">
                <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
                
                {/* Display the AI Generated Image if available */}
                {post.imageUrl && (
                    <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-50">
                        <img
                            src={post.imageUrl}
                            alt="AI Generated"
                            className="w-full h-48 object-cover"
                            loading="lazy"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                            AI Generated
                        </div>
                    </div>
                )}
                
                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-40 p-4 mb-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Edit your post content..."
                />
                
                {saveError && (
                    <p className="text-sm text-red-500 mb-2">
                        {saveError}
                    </p>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "px-4 py-2 rounded-lg transition-all duration-200",
                            "text-sm font-medium flex items-center gap-2",
                            "bg-white hover:bg-gray-50 border border-gray-200",
                            "hover:border-gray-300 shadow-sm",
                            isSaving && "opacity-75 cursor-not-allowed"
                        )}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />} Save
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className={cn(
                            "px-4 py-2 rounded-lg transition-all duration-200",
                            "text-sm font-medium flex items-center gap-2",
                            "bg-white hover:bg-gray-50 border border-gray-200",
                            "hover:border-gray-300 shadow-sm",
                            isSaving && "opacity-75 cursor-not-allowed"
                        )}
                    >
                        <X className="w-4 h-4" />Cancel
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

export const CalendarModal: React.FC<EditModalProps> = ({ isOpen, onClose, post, onSave, isSaving, saveError }) => {
    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-2xl relative">
                <h2 className="text-2xl font-bold mb-4">Schedule Post</h2>
                
                <Calendar />
                
                {saveError && (
                    <p className="text-sm text-red-500 mb-2">
                        {saveError}
                    </p>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onSave(post.id, post.post)}
                        disabled={isSaving}
                        className={cn(
                            "px-4 py-2 rounded-lg transition-all duration-200",
                            "text-sm font-medium flex items-center gap-2",
                            "bg-white hover:bg-gray-50 border border-gray-200",
                            "hover:border-gray-300 shadow-sm",
                            isSaving && "opacity-75 cursor-not-allowed"
                        )}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />} Save
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className={cn(
                            "px-4 py-2 rounded-lg transition-all duration-200",
                            "text-sm font-medium flex items-center gap-2",
                            "bg-white hover:bg-gray-50 border border-gray-200",
                            "hover:border-gray-300 shadow-sm",
                            isSaving && "opacity-75 cursor-not-allowed"
                        )}
                    >
                        <X className="w-4 h-4" />Cancel
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};