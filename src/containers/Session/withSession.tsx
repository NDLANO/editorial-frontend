import hoistNonReactStatics from 'hoist-non-react-statics';
import { ComponentType, ReactElement } from 'react';
import { SessionProps, useSession } from './SessionProvider';

function withSession<P>(WrappedComponent: ComponentType<P & SessionProps>): ComponentType<P> {
  const WithSession = (props: P): ReactElement<P> => {
    const session = useSession();
    //@ts-ignore
    return <WrappedComponent {...{ ...props, ...session }} />;
  };

  return hoistNonReactStatics(WithSession, WrappedComponent);
}

export default withSession;
