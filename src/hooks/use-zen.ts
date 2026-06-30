import { create } from 'zustand'

interface ZenState {
  isZenMode: boolean
  toggleZenMode: () => void
}

export const useZenMode = create<ZenState>((set) => ({
  isZenMode: false,
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
}))
