/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import sinon from 'sinon';
import { uuid } from 'ndla-util';

import { Alerts, Alert, Action } from '../Alerts';

configure({ adapter: new Adapter() });

const noop = () => {};

test('component/Alerts one message', () => {
  const alertMessages = [{ id: uuid(), message: 'Testmessage' }];
  const component = shallow(
    <Alerts messages={alertMessages} dispatch={noop} />,
  );
  const alertElement = component.find(Alert);

  expect(alertElement.length).toBe(1);
});

test('component/Alerts two messages', () => {
  const messages = ['Testmessage', 'TEST'];
  const alertMessages = [
    { id: uuid(), message: messages[0], severity: 'success' },
    { id: uuid(), message: messages[1] },
  ];
  const component = shallow(
    <Alerts messages={alertMessages} dispatch={noop} />,
  );

  const alertElement = component.find(Alert);
  expect(alertElement.length).toBe(2);
});

test('component/Alerts without messages', () => {
  const component = shallow(<Alerts messages={[]} dispatch={noop} />);
  expect(component.hasClass('alert-overlay--hidden')).toBeTruthy();
});

test('component/Action click', () => {
  const handleClick = sinon.spy(() => {});

  const actionBtn = shallow(<Action title="Undo" onClick={handleClick} />);

  actionBtn.simulate('click');

  expect(handleClick.calledOnce).toBeTruthy();
});
