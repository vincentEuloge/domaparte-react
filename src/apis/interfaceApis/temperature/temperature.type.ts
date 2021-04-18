export type TemperatureRaw = [Date, string, number, string, number, string, number, string, number]

export interface Temperatures {
  dates: string[];
  corridorTemps: number[];
  entranceTemps: number[];
  kitchenTemps: number[];
  outsideTemps: number[];
}
