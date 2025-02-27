import { create } from 'zustand';

const usePetStore = create((set) => ({
  pet: null,
  isLoading: true,
  isEgg: true, // Start as an egg
  petModelUrl: '/models/egg.glb', // Default to egg model
  setPet: (pet) => set({ pet, isLoading: false }),
  resetPet: () => set({ pet: null, isLoading: true }),
  hatchEgg: () => set({ isEgg: false, petModelUrl: '/models/Glub.gltf' }),
}));

export default usePetStore;
