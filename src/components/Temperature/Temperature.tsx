import React, { useEffect, useMemo } from 'react';
import type { FC, ReactElement } from 'react';

import { match } from '../../utils';
import { Container, Text } from './Temperature.style';
import { LineChart } from './components';
import type { PropsFromRedux } from './index';

export const Temperature: FC<PropsFromRedux> = ({
  temperatures,
  fetchTemperatures,
}) => {
  useEffect(() => {
    if (temperatures.status === 'NotAsked') fetchTemperatures();
  }, [temperatures, fetchTemperatures]);

  return (
    <Container>
      {useMemo(
        () => match<typeof temperatures, ReactElement>({
          NotAsked: () => <Text>Ask it</Text>,
          Loading: () => <Text>Loading... Please wait</Text>,
          None: () => <Text>No temperature, sorry</Text>,
          Some: ({ value }) => <LineChart data={value} />,
          Error: ({ value }) => <Text>{value}</Text>,
        }),
        [],
      )(temperatures)}
    </Container>
  );
};
