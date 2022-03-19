export interface KioskCoord {
  code: string;
  color: boolean;
  coord: {
    lat: number;
    lon: number;
  };
  mono: boolean;
  name: string;
}
