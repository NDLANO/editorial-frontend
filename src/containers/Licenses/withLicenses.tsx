import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { LicenseFunctions, useLicenses } from './LicensesProvider';

function withLicenses<P>(
  WrappedComponent: React.ComponentType<P & LicenseFunctions>,
): React.ComponentType<P> {
  const WithLicenses = (props: P): React.ReactElement<P> => {
    const messagesFunc = useLicenses();
    return <WrappedComponent {...{ ...props, ...messagesFunc }} />;
  };

  return hoistNonReactStatics(WithLicenses, WrappedComponent);
}

export default withLicenses;
