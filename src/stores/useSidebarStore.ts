import { create } from 'zustand'

type SidebarStore = {
  folded: boolean

  toggleFolded: () => void
  setFolded: (value: boolean) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  folded: false,

  toggleFolded: () =>
    set((state) => ({
      folded: !state.folded,
    })),

  setFolded: (value) =>
    set({
      folded: value,
    }),
}))
