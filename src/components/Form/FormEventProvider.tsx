/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type EventType = 'reset';

interface FormEvent {
  id: number;
  type: EventType;
}
interface EventState {
  events: FormEvent[];
}
const FormEventContext = createContext<
  [EventState, Dispatch<SetStateAction<EventState>>] | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export interface FormEventProps {
  events: FormEvent[];
  dispatchEvent: (type: EventType) => void;
}

export const FormEventProvider = ({ children }: Props) => {
  const initialValues: EventState = { events: [] };
  const eventContext = useState<EventState>(initialValues);
  return <FormEventContext.Provider value={eventContext}>{children}</FormEventContext.Provider>;
};

export const useFormEvents = (): FormEventProps => {
  const eventContext = useContext(FormEventContext);
  if (eventContext === undefined) {
    throw new Error('useFormEvents must be used within the context of a FormEventProvider!');
  }
  const [state, setState] = eventContext;

  const dispatch = (type: EventType) => {
    const newEvent: FormEvent = { id: state.events.length, type };
    const newEvents = state.events.concat([newEvent]);
    setState(prev => ({ ...prev, events: newEvents }));
  };

  return {
    events: state.events,
    dispatchEvent: dispatch,
  };
};
