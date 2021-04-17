import React, { useEffect } from 'react';
import type { FC } from 'react';

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
      { temperatures.status === 'Loading' && <Text>Loading... Please wait</Text>}
      { temperatures.status === 'Some' && <LineChart data={temperatures.value} />}
    </Container>
  );
};
