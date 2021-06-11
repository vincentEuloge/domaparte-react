import { herokuApi } from '../../backendApis';
import { getDateFormatedParts } from '../../../utils';
import type { Temperatures, TemperatureRaw } from './temperature.type';

export async function getTemperatures(): Promise<Temperatures> {
  const tempraturesRaw = await (herokuApi.get() as Promise<TemperatureRaw[]>);

  return tempraturesRaw
    .slice(-1000)
    .reduce<Temperatures>(
      (acc, [date,, kitchenTemp,, entranceTemp,, outsideTemp,, corridorTemp]) => {
        // The date have to be normalize (we want paris timezoned date)
        const {
          day, month, year, hour, minute, second,
        } = getDateFormatedParts(new Date(date));

        acc.dates.push(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
        acc.corridorTemps.push(corridorTemp / 100);
        acc.entranceTemps.push(entranceTemp / 100);
        acc.kitchenTemps.push(kitchenTemp / 100);
        acc.outsideTemps.push(outsideTemp / 100);

        return acc;
      }, {
        dates: [], corridorTemps: [], entranceTemps: [], kitchenTemps: [], outsideTemps: [],
      },
    );
}
