import hoistNonReactStatics from 'hoist-non-react-statics';
import { ComponentType, ReactElement } from 'react';
import { MessagesFunctions, useMessages } from './MessagesProvider';

function withMessages<P>(WrappedComponent: ComponentType<P & MessagesFunctions>): ComponentType<P> {
  const WithMessages = (props: P): ReactElement<P> => {
    const messagesFunc = useMessages();
    return <WrappedComponent {...{ ...props, ...messagesFunc }} />;
  };

  return hoistNonReactStatics(WithMessages, WrappedComponent);
}

export default withMessages;
