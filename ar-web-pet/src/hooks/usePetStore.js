import { create } from 'zustand';

const usePetStore = create((set, get) => ({
  // Egg state
  isEgg: true,
  eggInteractions: 0,
  requiredInteractions: 10, // Changed from 5 to 10
  hasPlacedEgg: false,

  // Pet state after hatching
  happiness: 50,
  hunger: 50,
  energy: 100,
  lastFed: new Date(),
  lastPlayed: new Date(),

  // Actions
  interactWithEgg: () =>
    set((state) => {
      const newInteractions = state.eggInteractions + 1;
      const shouldHatch = newInteractions >= state.requiredInteractions;

      return {
        eggInteractions: newInteractions,
        isEgg: !shouldHatch,
      };
    }),

  setEggPlaced: (placed) => set({ hasPlacedEgg: placed }),

  hatchEgg: () => set({ isEgg: false }),

  resetEgg: () =>
    set({
      isEgg: true,
      eggInteractions: 0,
      hasPlacedEgg: false,
    }),

  feed: () =>
    set((state) => ({
      hunger: Math.max(0, state.hunger - 10),
      lastFed: new Date(),
    })),

  play: () =>
    set((state) => ({
      happiness: Math.min(100, state.happiness + 10),
      energy: Math.max(0, state.energy - 5),
      lastPlayed: new Date(),
    })),
}));

export default usePetStore;
