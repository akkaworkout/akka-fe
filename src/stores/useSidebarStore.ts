import { create } from 'zustand'

type SidebarStore = {
  folded: boolean

  toggleFolded: () => void
  setFolded: (value: boolean) => void
}

export const SIDEBAR_FOLD_MEDIA_QUERY = '(max-width: 1199px)'

const getInitialFolded = () =>
  typeof window !== 'undefined' && window.matchMedia(SIDEBAR_FOLD_MEDIA_QUERY).matches

export const useSidebarStore = create<SidebarStore>((set) => ({
  folded: getInitialFolded(),

  toggleFolded: () =>
    set((state) => ({
      folded: !state.folded,
    })),

  setFolded: (value) =>
    set({
      folded: value,
    }),
}))
