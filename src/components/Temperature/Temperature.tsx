import React, { useEffect } from 'react';
import type { FC } from 'react';

import { Container, Text } from './Temperature.style';
import type { PropsFromRedux } from './index';

export const Temperature: FC<PropsFromRedux> = ({
  temperatures,
  fetchTemperatures,
}) => {
  useEffect(() => {
    if (temperatures.status === 'NotAsked') fetchTemperatures();
  }, [temperatures, fetchTemperatures]);

  console.log(temperatures.status);
  return (
    <Container>
      <Text>Hellowwwww</Text>
    </Container>
  );
};
