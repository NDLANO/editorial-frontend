/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { MessagesProvider, NewMessageType, useMessages } from '../MessagesProvider';

interface WrapperProps {
  children?: ReactNode;
  initialValues?: NewMessageType[];
}

const wrapper = ({ children, initialValues }: WrapperProps) => (
  <MemoryRouter>
    <MessagesProvider>{children}</MessagesProvider>
  </MemoryRouter>
);

describe('useMessages', () => {
  it('correctly adds a new message to messages', () => {
    const { result } = renderHook(() => useMessages(), { wrapper });
    act(() => {
      result.current.createMessage({
        message: 'This is a dangerous error',
        severity: 'danger',
      });
    });
    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].severity).toBe('danger');
    expect(result.current.messages[0].message).toBe('This is a dangerous error');

    act(() => {
      result.current.createMessage({
        message: 'Another somewhat less dangerous error',
        severity: 'warning',
      });
    });

    expect(result.current.messages.length).toBe(2);
    expect(result.current.messages[1].severity).toBe('warning');
    expect(result.current.messages[1].message).toBe('Another somewhat less dangerous error');

    for (let i = 0; i < 8; i++) {
      act(() => {
        result.current.createMessage({
          message: 'A message',
          severity: 'success',
        });
      });
    }

    expect(result.current.messages.length).toBe(10);
    expect(result.current.messages[9].message).toBe('A message');
    expect(result.current.messages[9].severity).toBe('success');
  });

  it('correctly removes a specific message', () => {
    const { result } = renderHook(() => useMessages(), { wrapper });
    act(() => {
      result.current.createMessage({
        message: 'melding',
        severity: 'info',
        timeToLive: 1000,
      });
    });
    act(() => {
      result.current.createMessage({
        message: 'melding2',
        severity: 'info',
        timeToLive: 1000,
      });
    });
    expect(result.current.messages.length).toBe(2);
    const messageToRemove = result.current.messages[0];
    act(() => {
      result.current.clearMessage(messageToRemove.id);
    });
    expect(result.current.messages.length).toBe(1);
  });

  it('correctly clears all messages', () => {
    const { result } = renderHook(() => useMessages(), { wrapper });
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.createMessage({
          message: 'A message',
          severity: 'success',
        });
      });
    }
    expect(result.current.messages.length).toBe(10);
    act(() => result.current.clearMessages());
    expect(result.current.messages.length).toBe(0);
  });

  it('can create an application error', () => {
    const { result } = renderHook(() => useMessages(), { wrapper });
    act(() =>
      result.current.applicationError({
        json: {
          messages: [{ field: 'Generic error', message: 'Another somewhat less dangerous error' }],
        },
      }),
    );

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].severity).toBe('danger');
    expect(result.current.messages[0].message).toBe(
      'Generic error: Another somewhat less dangerous error',
    );
  });
});
