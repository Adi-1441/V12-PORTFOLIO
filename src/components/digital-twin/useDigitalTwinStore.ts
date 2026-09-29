import { create } from 'zustand';
import type { DigitalTwinState, DigitalTwinStore } from './DigitalTwinTypes';

export const useDigitalTwinStore = create<DigitalTwinStore>((set, get) => ({
  activeState: 'realistic',
  explodedProgress: 0,
  autoRotate: true,
  selectedComponent: null,
  sensorTelemetry: {
    temp: 42.4, // deg C
    rpm: 3600,
    pressure: 14.8, // bar
    stressMpa: 218, // MPa
  },

  setState: (state: DigitalTwinState) => {
    const isExploded = state === 'exploded';
    set({
      activeState: state,
      explodedProgress: isExploded ? 1 : 0,
    });
  },

  toggleExploded: () => {
    const current = get().explodedProgress;
    set({
      explodedProgress: current > 0 ? 0 : 1,
      activeState: current > 0 ? 'realistic' : 'exploded',
    });
  },

  setSelectedComponent: (comp) => set({ selectedComponent: comp }),

  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
}));
