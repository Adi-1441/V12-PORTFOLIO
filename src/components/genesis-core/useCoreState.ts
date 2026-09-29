import { create } from 'zustand';

export type CoreState = 'mechanical' | 'fusion' | 'neural';
export type CoreView = 'normal' | 'blueprint' | 'exploded';
export type CoreMaterialType = 'copper' | 'titanium' | 'aluminum' | 'carbon';

interface CoreStore {
  state: CoreState;
  view: CoreView;
  material: CoreMaterialType;
  overdrive: boolean;
  bootProgress: number; // 0 to 1
  isBooting: boolean;
  cycleState: () => void;
  setState: (state: CoreState) => void;
  setView: (view: CoreView) => void;
  toggleView: (view: CoreView) => void;
  setMaterial: (mat: CoreMaterialType) => void;
  setOverdrive: (val: boolean) => void;
  setBootProgress: (val: number) => void;
  skipBoot: () => void;
}

const ORDER: CoreState[] = ['mechanical', 'fusion', 'neural'];

export const useCoreState = create<CoreStore>((set, get) => ({
  state: 'mechanical',
  view: 'normal',
  material: 'copper',
  overdrive: false,
  bootProgress: 1, // Settled by default; boot sequence triggers on initial mount
  isBooting: false,

  cycleState: () => {
    const i = ORDER.indexOf(get().state);
    set({ state: ORDER[(i + 1) % ORDER.length] });
  },

  setState: (state) => set({ state }),

  setView: (view) => set({ view }),

  toggleView: (view) => {
    set((s) => ({ view: s.view === view ? 'normal' : view }));
  },

  setMaterial: (material) => set({ material }),

  setOverdrive: (overdrive) => set({ overdrive }),

  setBootProgress: (bootProgress) => set({ bootProgress }),

  skipBoot: () => set({ isBooting: false, bootProgress: 1 }),
}));
