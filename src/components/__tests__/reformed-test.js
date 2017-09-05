/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import reformed from '../reformed';

const Form = props => {
  const { bindInput } = props;

  return (
    <form>
      <input type="text" {...bindInput('title')} />
      <input type="text" {...bindInput('introcution')} />
      <input type="text" {...bindInput('content')} />
    </form>
  );
};
Form.propTypes = {
  bindInput: PropTypes.func.isRequired,
};

const Reformed = reformed(Form);

test('reformed HOC renderers form component correctly', () => {
  const component = renderer.create(
    <Reformed
      initialModel={{
        title: 'Olé',
        introduction: '',
        content: 'Olé, Olé, Olé',
      }}
    />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});
