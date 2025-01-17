import { create } from 'zustand';
import { Post, Event, AuditLogEntry } from '../types';

interface AppState {
  posts: Post[];
  events: Event[];
  auditLog: AuditLogEntry[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  addEvent: (event: Event) => void;
  addAuditEntry: (entry: AuditLogEntry) => void;
}

export const useStore = create<AppState>((set) => ({
  posts: [],
  events: [],
  auditLog: [],
  selectedTab: 'journalist',
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  updatePost: (post) => set((state) => ({
    posts: state.posts.map((p) => (p.id === post.id ? post : p)),
  })),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  addAuditEntry: (entry) => set((state) => ({
    auditLog: [entry, ...state.auditLog].slice(0, 1000),
  })),
}));