/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { shallow } from 'enzyme';
import { uuid } from '@ndla/util';

import { Messages, Message } from '../Messages';

const noop = () => {};

test('component/Messages one message', () => {
  const messages = [{ id: uuid(), message: 'Testmessage' }];
  const component = shallow(<Messages messages={messages} dispatch={noop} />);
  const messageElement = component.find(Message);

  expect(messageElement.length).toBe(1);
});

test('component/Messages two messages', () => {
  const messages = [
    { id: uuid(), message: 'Testmessage', severity: 'success' },
    { id: uuid(), message: 'TEST' },
  ];
  const component = shallow(<Messages messages={messages} dispatch={noop} />);

  const messageElement = component.find(Message);
  expect(messageElement.length).toBe(2);
});
