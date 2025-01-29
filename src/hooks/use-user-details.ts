import { create } from 'zustand';
import { users } from '@/lib/api-client';
import type { UserDetails } from '@/lib/api-client';

interface UserDetailsStore {
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: Error | null;
  fetchUserDetails: () => Promise<void>;
}

export const useUserDetails = create<UserDetailsStore>((set) => ({
  userDetails: null,
  isLoading: false,
  error: null,
  fetchUserDetails: async () => {
    try {
      set({ isLoading: true, error: null });
      const details = await users.me();
      set({ userDetails: details, isLoading: false });
    } catch (err) {
      set({ error: err as Error, isLoading: false });
      console.error('Error fetching user details:', err);
    }
  },
})); 