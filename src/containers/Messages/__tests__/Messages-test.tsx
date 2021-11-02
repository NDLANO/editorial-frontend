/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { findByTestId, fireEvent, render } from '@testing-library/react';
import { uuid } from '@ndla/util';
import { act } from 'react-test-renderer';
import Messages, { MessageType } from '../Messages';
import { MessagesProvider } from '../MessagesProvider';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';

jest.useFakeTimers();

describe('Messages', () => {
  test('A single message renders correctly', () => {
    const messages: MessageType[] = [{ id: uuid(), message: 'Testmessage' }];
    const { container } = render(
      <IntlWrapper>
        <MessagesProvider initialValues={messages}>
          <Messages />
        </MessagesProvider>
      </IntlWrapper>,
    );

    expect(container).toMatchSnapshot();
  });

  test('Several messages renders correctly', () => {
    const messages: MessageType[] = [
      { id: uuid(), message: 'Testmessage' },
      { id: uuid(), message: 'Testmessage2' },
    ];
    const { container } = render(
      <IntlWrapper>
        <MessagesProvider initialValues={messages}>
          <Messages />
        </MessagesProvider>
      </IntlWrapper>,
    );

    expect(container).toMatchSnapshot();
  });

  test('A message is removed if the modal is closed', async () => {
    const messages: MessageType[] = [{ id: uuid(), message: 'Testmessage', timeToLive: 10000 }];
    const { container } = render(
      <MessagesProvider initialValues={messages}>
        <Messages />
      </MessagesProvider>,
    );
    expect(container).toMatchSnapshot();
    const closeButton = await findByTestId(container, 'closeAlert');
    await act(async () => {
      fireEvent.click(closeButton);
    });
    expect(container).toMatchSnapshot();
  });

  it('auth0 messages provides a cancel button', async () => {
    const messages: MessageType[] = [
      { id: uuid(), message: 'Testmessage', timeToLive: 10000, type: 'auth0' },
    ];
    const { container, findByText } = render(
      <IntlWrapper>
        <MessagesProvider initialValues={messages}>
          <Messages />
        </MessagesProvider>
      </IntlWrapper>,
    );
    expect(container).toMatchSnapshot();
    const cancelButton = await findByText('Avbryt');
    act(() => {
      fireEvent.click(cancelButton);
    });
    expect(container).toMatchSnapshot();
  });

  it('auth0 messages allows the user to log in again', async () => {
    const messages: MessageType[] = [
      { id: uuid(), message: 'Testmessage', timeToLive: 10000, type: 'auth0' },
    ];

    const { findByText } = render(
      <IntlWrapper>
        <MessagesProvider initialValues={messages}>
          <Messages />
        </MessagesProvider>
      </IntlWrapper>,
    );
    const loginButton = await findByText('Logg inn på nytt');
    act(() => {
      fireEvent.click(loginButton);
    });
    expect(`${window.location.pathname}${window.location.search}`).toEqual(
      '/logout/session?returnToLogin=true',
    );
  });
});
