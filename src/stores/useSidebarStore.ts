import { create } from "zustand";

type AppStore = {
  folded: boolean;

  isLoggedIn: boolean;
  token: string | null;

  toggleFolded: () => void;
  setFolded: (value: boolean) => void;

  login: (token: string) => void;
  logout: () => void;
};

export const useSidebarStore = create<AppStore>((set) => ({
  folded: false,

  isLoggedIn: !!localStorage.getItem("accessToken"),
  token: localStorage.getItem("accessToken"),

  toggleFolded: () =>
    set((state) => ({
      folded: !state.folded,
    })),

  setFolded: (value) =>
    set({
      folded: value,
    }),

  login: (token) => {
    localStorage.setItem("accessToken", token);

    set({
      isLoggedIn: true,
      token,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      isLoggedIn: false,
      token: null,
    });
  },
}));