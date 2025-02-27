import create from 'zustand';

const usePetStore = create((set) => ({
  pet: null,
  loading: true,
  setPet: (pet) => set({ pet, loading: false }),
  resetPet: () => set({ pet: null, loading: true }),
}));

export default usePetStore;