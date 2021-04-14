import React from 'react';

import { Temperature } from './components/Temperature';
import { Container } from './App.style';

function App(): JSX.Element {
  return (
    <Container>
      <Temperature />
    </Container>
  );
}

export default App;
