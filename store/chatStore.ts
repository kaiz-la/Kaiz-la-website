import { create } from 'zustand';

// Message state now lives in useChat (@ai-sdk/react) — this store only keeps the
// conversation list that the sidebar reads.
export type Conversation = {
  id: string;
  createdAt: Date;
  title: string;
};

type ChatState = {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations.');
      const conversations = await response.json();
      set({ conversations, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete conversation.');
      await get().fetchConversations();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
