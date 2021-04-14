import { connect } from 'react-redux';
import type { ConnectedProps } from 'react-redux';

import { Temperature as TemperatureToConnect } from './Temperature';
import { actions as appActions } from '../../models';
import type { AppStore } from '../../models';

const mapStateToProps = (
  { app }: {app: AppStore},
) => ({
  temperatures: app.temperatures,
});
const mapDispatchToProps = {
  fetchTemperatures: appActions.temperatures.fetch,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>
export const Temperature = connector(TemperatureToConnect);
