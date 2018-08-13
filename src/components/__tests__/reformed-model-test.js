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
import reformed from '../reformed';

export const Form = props => {
  const { bindInput, setModel, submitted, setSubmitted } = props;

  const handleSubmit = () => {
    setModel({
      title: '',
      introduction: '',
      content: '',
      image: {
        caption: '',
        alt: '',
      },
    });
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitted && <span>Submitted!</span>}
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
  setModel: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  setSubmitted: PropTypes.func.isRequired,
};

const triggerOnChange = (tree, name, value) => {
  const input = tree.children.find(child => child.props.name === name);
  input.props.onChange({ target: { value, name } });
};

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
  const Reformed = reformed(Form);
  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC handles onChange event correctly', () => {
  const Reformed = reformed(Form);
  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );
  const tree = component.toJSON();

  triggerOnChange(tree, 'title', 'Hombre');

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC handles onChange event on nested property correctly', () => {
  const Reformed = reformed(Form);
  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );
  const tree = component.toJSON();

  triggerOnChange(tree, 'image.caption', 'El Grande');

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC handles setModel and setSubmitted', () => {
  const Reformed = reformed(Form);
  const component = TestRenderer.create(
    <Reformed initialModel={initialModel} />,
  );
  const tree = component.toJSON();

  tree.props.onSubmit();

  expect(component.toJSON()).toMatchSnapshot();
});
