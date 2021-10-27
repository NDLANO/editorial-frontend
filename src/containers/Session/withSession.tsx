import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SessionProps, useSession } from './SessionProvider';

function withSession<P>(
  WrappedComponent: React.ComponentType<P & SessionProps>,
): React.ComponentType<P> {
  const WithSession = (props: P): React.ReactElement<P> => {
    const session = useSession();
    return <WrappedComponent {...{ ...props, ...session }} />;
  };

  return hoistNonReactStatics(WithSession, WrappedComponent);
}

export default withSession;
