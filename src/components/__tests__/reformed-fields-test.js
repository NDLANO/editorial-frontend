/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import TestRenderer from 'react-test-renderer';
import get from 'lodash/fp/get';
import reformed from '../reformed';

const findInput = (tree, name) =>
  tree.children.find(child => child.props.name === name);

const triggerOnChange = (tree, name, value) => {
  const input = findInput(tree, name);
  input.props.onChange({ type: 'change', target: { value, name } });
};

const triggerEvent = (tree, name, type) => {
  const input = findInput(tree, name);
  input.props.onFocus({ type, target: { name } });
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
  fields: PropTypes.object, // eslint-disable-line react/forbid-prop-types
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

test('reformed HOC sets dirty flag in fields', () => {
  const Reformed = reformed(FieldForm);

  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();

  triggerOnChange(tree, 'title', 'Hom');
  triggerOnChange(tree, 'title', 'Hombre');
  triggerOnChange(tree, 'image.caption', 'El Grande');

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC sets active flag on focus', () => {
  const Reformed = reformed(FieldForm);

  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );
  const tree = component.toJSON();

  triggerEvent(tree, 'title', 'focus');
  triggerEvent(tree, 'image.caption', 'focus');

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC removes active flag and set touched flag on blur', () => {
  const Reformed = reformed(FieldForm);

  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );
  const tree = component.toJSON();

  triggerEvent(tree, 'title', 'focus');
  triggerEvent(tree, 'title', 'blur');
  triggerEvent(tree, 'image.caption', 'focus');
  triggerEvent(tree, 'image.caption', 'blur');

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC merges and overrides input flags correctly', () => {
  const Reformed = reformed(FieldForm);

  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );
  const tree = component.toJSON();

  triggerEvent(tree, 'title', 'focus');
  expect(component.toJSON()).toMatchSnapshot();
  triggerOnChange(tree, 'title', 'test');
  expect(component.toJSON()).toMatchSnapshot();
  triggerEvent(tree, 'title', 'blur');
  expect(component.toJSON()).toMatchSnapshot();
});
