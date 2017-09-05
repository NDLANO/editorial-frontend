/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import renderer from 'react-test-renderer';
import reformed from '../reformed';
import Form, { FileForm } from './testforms';

// console.log(new URL('1'));

const findInputByName = (tree, name) =>
  tree.children.find(child => child.props.name === name);

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
  const component = renderer.create(<Reformed initialModel={initialModel} />);

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC handles onChange event correctly', () => {
  const Reformed = reformed(Form);
  const component = renderer.create(<Reformed initialModel={initialModel} />);
  const tree = component.toJSON();
  const input = findInputByName(tree, 'title');

  input.props.onChange({ target: { value: 'Hombre', name: input.props.name } });

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC handles onChange event on nested property correctly', () => {
  const Reformed = reformed(Form);
  const component = renderer.create(<Reformed initialModel={initialModel} />);
  const tree = component.toJSON();
  const input = findInputByName(tree, 'image.caption');

  input.props.onChange({
    target: { value: 'El Grande', name: input.props.name },
  });

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC handles file input correctly', () => {
  URL.createObjectURL = file => `blob:${file.name}`; // Mock
  const Reformed = reformed(FileForm);
  const component = renderer.create(
    <Reformed initialModel={{ file: undefined }} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  const input = findInputByName(tree, 'file');
  const file = new File(['foo'], 'foo.txt', {
    type: 'text/plain',
  });
  input.props.onChange({
    target: { files: [file], type: 'file', name: input.props.name },
  });

  expect(component.toJSON()).toMatchSnapshot();
});
