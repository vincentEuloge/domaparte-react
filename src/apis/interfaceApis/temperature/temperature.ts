import { herokuApi } from '../../backendApis';
import { getDateFormatedParts } from '../../../utils';
import type { Temperature, TemperatureRaw } from './temperature.type';

export async function getTemperatures(): Promise<Temperature[]> {
  const tempraturesRaw = await (herokuApi.get() as Promise<TemperatureRaw[]>);

  return tempraturesRaw.map(([date,, kitchenTemp,, entranceTemp,, outsideTemp,, corridorTemp]) => {
    // The date have to be normalize (we want paris timezoned date)
    const {
      day, month, year, hour, minute, second,
    } = getDateFormatedParts(new Date(date));

    return {
      outsideTemp,
      entranceTemp,
      kitchenTemp,
      corridorTemp,
      date: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
    };
  });
}
