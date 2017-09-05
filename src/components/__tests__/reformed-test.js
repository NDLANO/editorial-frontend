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
      <input type="text" {...bindInput('introduction')} />
      <input type="text" {...bindInput('content')} />
      <input type="text" {...bindInput('image.alt')} />
      <input type="text" {...bindInput('image.caption')} />
    </form>
  );
};

Form.propTypes = {
  bindInput: PropTypes.func.isRequired,
};

const Reformed = reformed(Form);
const initialModel = {
  title: 'Olé',
  introduction: '',
  content: 'Olé, Olé, Olé',
  image: {
    src: 'image.jpg',
    caption: '',
    alt: 'Alternative image text',
  },
};

test('reformed HOC renderers form component correctly', () => {
  const component = renderer.create(<Reformed initialModel={initialModel} />);

  expect(component.toJSON()).toMatchSnapshot();
});
