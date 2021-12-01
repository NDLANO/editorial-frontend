import { ComponentType, ReactElement } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { LicenseFunctions, useLicenses } from './LicensesProvider';

function withLicenses<P>(WrappedComponent: ComponentType<P & LicenseFunctions>): ComponentType<P> {
  const WithLicenses = (props: P): ReactElement<P> => {
    const messagesFunc = useLicenses();
    return <WrappedComponent {...{ ...props, ...messagesFunc }} />;
  };

  return hoistNonReactStatics(WithLicenses, WrappedComponent);
}

export default withLicenses;
