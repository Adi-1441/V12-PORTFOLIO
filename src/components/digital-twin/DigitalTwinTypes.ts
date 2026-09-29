export type DigitalTwinState =
  | 'realistic'
  | 'wireframe'
  | 'xray'
  | 'blueprint'
  | 'flow'
  | 'inspection'
  | 'exploded'
  | 'analysis'
  | 'idle';

export interface DigitalTwinStore {
  activeState: DigitalTwinState;
  explodedProgress: number; // 0 to 1
  autoRotate: boolean;
  selectedComponent: string | null;
  sensorTelemetry: {
    temp: number;
    rpm: number;
    pressure: number;
    stressMpa: number;
  };
  setState: (state: DigitalTwinState) => void;
  toggleExploded: () => void;
  setSelectedComponent: (comp: string | null) => void;
  toggleAutoRotate: () => void;
}
