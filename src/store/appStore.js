import { create } from 'zustand';

export const useAppStore = create((set) => {
  // Initialize theme from localStorage or default to 'dark'
  const savedTheme = localStorage.getItem('penlet_theme') || 'light';
  
  // Apply initial theme on store creation
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return {
    // UI State
    sidebarOpen: true,
    theme: savedTheme, // Default to dark mode
    notifications: [],
    
    // Navigation
    currentPage: 'dashboard',
    
    // Loading states
    isLoading: false,
    
    // Actions
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    
    setTheme: (theme) => {
      set({ theme });
      localStorage.setItem('penlet_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          ...state.notifications,
          { id: Date.now(), ...notification, read: false },
        ],
      })),
    
    markNotificationRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
    
    clearNotifications: () => set({ notifications: [] }),
    
    setCurrentPage: (page) => set({ currentPage: page }),
    
    setLoading: (isLoading) => set({ isLoading }),
  };
});