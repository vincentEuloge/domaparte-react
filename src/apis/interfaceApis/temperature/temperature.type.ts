export type TemperatureRaw = [Date, string, number, string, number, string, number, string, number]

export interface Temperature{
  outsideTemp: number;
  entranceTemp: number;
  kitchenTemp: number;
  corridorTemp: number;
  date: string
}
