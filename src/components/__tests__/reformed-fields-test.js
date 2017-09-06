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
import get from 'lodash/fp/get';
import reformed from '../reformed';

const triggerOnChange = (tree, name, value) => {
  const input = tree.children.find(child => child.props.name === name);
  input.props.onChange({ target: { value, name } });
};

export const FieldForm = props => {
  const { bindInput, fields } = props;

  return (
    <form>
      <span {...get('title', fields)} />
      <input type="text" {...bindInput('title')} />
      <span {...get('content', fields)} />
      <input type="text" {...bindInput('content')} />
      <span {...get('image.alt', fields)} />
      <input type="text" {...bindInput('image.alt')} />
      <span {...get('image.caption', fields)} />
      <input type="text" {...bindInput('image.caption')} />
    </form>
  );
};

FieldForm.propTypes = {
  fields: PropTypes.object, //eslint-disable-line
  bindInput: PropTypes.func.isRequired,
};

const initialModel = {
  title: 'Olé',
  content: 'Olé, Olé, Olé',
  image: {
    caption: '',
    alt: 'Alternative image text',
  },
};

test('reformed HOC sets meta data about fields', () => {
  const Reformed = reformed(FieldForm);

  const component = renderer.create(<Reformed initialModel={initialModel} />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();

  triggerOnChange(tree, 'title', 'Hom');
  triggerOnChange(tree, 'title', 'Hombre');
  triggerOnChange(tree, 'image.caption', 'El Grande');

  expect(component.toJSON()).toMatchSnapshot();
});
