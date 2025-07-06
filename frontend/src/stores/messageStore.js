import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";
import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  loadingChat: false,
  sendingMessage: null,
  chats: [],
  error: null,

  // Fetch chats for a specific user
  getChats: async (userId) => {
    set({ loadingChat: true, error: null });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      const { messages } = response.data;
      set({ chats: messages });
    } catch (error) {
      console.error("Error fetching chats:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch messages",
      });
    } finally {
      set({ loadingChat: false });
    }
  },

  // Send a new message with potential image
  sendMessage: async (receiverId, formData) => {
    set({ sendingMessage: formData.get("fileType") || "chat", error: null });
    console.log(formData.get("file"));
    try {
      const response = await axiosInstance.post(
        `/message/send/${receiverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state with the new message
      set((state) => ({
        chats: [...state.chats, response.data.newMessage],
      }));

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      set({ sendingMessage: null, error: null });
    }
  },

  // on.("newMessage") fetch the message

  // Clear chat state
  clearChats: () => set({ chats: [], error: null }),

  addNewMessage: (newMessage) => {
    set({ chats: [...get().chats, newMessage] });
  },
}));
