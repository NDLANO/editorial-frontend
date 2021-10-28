import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { MessagesFunctions, useMessages } from './MessagesProvider';

function withMessages<P>(
  WrappedComponent: React.ComponentType<P & MessagesFunctions>,
): React.ComponentType<P> {
  const WithMessages = (props: P): React.ReactElement<P> => {
    const messagesFunc = useMessages();
    return <WrappedComponent {...{ ...props, ...messagesFunc }} />;
  };

  return hoistNonReactStatics(WithMessages, WrappedComponent);
}

export default withMessages;
