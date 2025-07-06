import { create } from "zustand";
import { isCheckPassword } from "../utils/authApi";

const usePasswordStore = create((set, get) => ({
  isPasswordVerified: false,

  setPasswordVerified: () => set({isPasswordVerified:true }),

  checkPasswordVerified: async () => {
    try {
      await isCheckPassword();
      get().setPasswordVerified();
    } catch (err) {
      if(err.status!==409)
        console.log(err);
    }
  },
}));

export default usePasswordStore