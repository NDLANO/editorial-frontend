/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { act, findByTestId, fireEvent, render } from '@testing-library/react';
import { uuid } from '@ndla/util';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import Messages, { MessageType } from '../Messages';
import { MessagesProvider } from '../MessagesProvider';

jest.useFakeTimers();

const history = createMemoryHistory();

beforeEach(() => {
  const reload = jest.fn();

  jest.spyOn(window, 'location', 'get').mockImplementation(() => ({ reload }) as unknown as Location);
});

const wrapper = (messages: MessageType[]) => (
  <Router location={history.location} navigator={history}>
    <IntlWrapper>
      <MessagesProvider initialValues={messages}>
        <Messages />
      </MessagesProvider>
    </IntlWrapper>
  </Router>
);

describe('Messages', () => {
  test('A single message renders correctly', () => {
    const messages: MessageType[] = [{ id: uuid(), message: 'Testmessage' }];
    const { baseElement } = render(wrapper(messages));

    expect(baseElement).toMatchSnapshot();
  });

  test('Several messages renders correctly', () => {
    const messages: MessageType[] = [
      { id: uuid(), message: 'Testmessage' },
      { id: uuid(), message: 'Testmessage2' },
    ];
    const { baseElement } = render(wrapper(messages));
    expect(baseElement).toMatchSnapshot();
  });

  test('A message is removed if the modal is closed', async () => {
    const messages: MessageType[] = [{ id: uuid(), message: 'Testmessage', timeToLive: 10000 }];
    const { baseElement } = render(wrapper(messages));
    const portal = baseElement.querySelector('div[role="dialog"]') as HTMLElement;
    expect(baseElement).toMatchSnapshot();
    const closeButton = await findByTestId(portal, 'closeAlert');
    await act(async () => {
      fireEvent.click(closeButton);
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('auth0 messages provides a cancel button', async () => {
    const messages: MessageType[] = [{ id: uuid(), message: 'Testmessage', timeToLive: 10000, type: 'auth0' }];
    const { baseElement, findByText } = render(wrapper(messages));
    expect(baseElement).toMatchSnapshot();
    const cancelButton = await findByText('Avbryt');
    act(() => {
      fireEvent.click(cancelButton);
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('auth0 messages allows the user to log in again', async () => {
    const messages: MessageType[] = [{ id: uuid(), message: 'Testmessage', timeToLive: 10000, type: 'auth0' }];

    const { findByText } = render(wrapper(messages));
    const loginButton = await findByText('Logg inn på nytt');
    act(() => {
      fireEvent.click(loginButton);
    });
    expect(`${history.location.pathname}${history.location.search}`).toEqual('/logout/session?returnToLogin=true');
  });
});
