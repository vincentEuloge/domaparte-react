interface FormatedDate{
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
}

const DATE_FORMAT = new Intl.DateTimeFormat(
  'fr-FR',
  {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Paris',
  },
);

function getDateFormatedParts(date: Date): FormatedDate {
  const [
    { value: day },,
    { value: month },,
    { value: year },,
    { value: hour },,
    { value: minute },,
    { value: second },
  ] = DATE_FORMAT.formatToParts(new Date(date));
  return {
    day, month, year, hour, minute, second,
  };
}

export {
  getDateFormatedParts,
};

export type {
  FormatedDate,
};
