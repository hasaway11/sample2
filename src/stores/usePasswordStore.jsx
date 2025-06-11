import { create } from "zustand";

const usePasswordStore = create((set) => ({
  isPasswordVerified: false,

  setPasswordVerified: () => set(state=>({...state, isPasswordVerified: true })),
}));

export default usePasswordStore