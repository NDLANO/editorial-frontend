/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';
import reformed from '../reformed';

export const FileForm = props => {
  const { bindInput } = props;

  const fileInfo = bindInput('file').value;
  const filePath = bindInput('filepath').value;
  return (
    <form>
      <input type="file" {...bindInput('file', true)} />
      {fileInfo
        ? <span>
            {`${fileInfo.name} ${fileInfo.type} ${fileInfo.size}`}
          </span>
        : null}
      {filePath
        ? <span>
            {filePath}
          </span>
        : null}
    </form>
  );
};

FileForm.propTypes = {
  bindInput: PropTypes.func.isRequired,
};

test('reformed HOC renders file input correctly', () => {
  const Reformed = reformed(FileForm);

  const component = renderer.create(
    <Reformed initialModel={{ file: undefined }} />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('reformed HOC handles file input change correctly', () => {
  URL.createObjectURL = file => `blob:${file.name}`; // Mock
  const Reformed = reformed(FileForm);

  const component = renderer.create(
    <Reformed initialModel={{ file: undefined }} />,
  );
  const tree = component.toJSON();

  const input = tree.children[0];
  const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

  input.props.onChange({
    target: { files: [file], type: 'file', name: input.props.name },
  });

  expect(component.toJSON()).toMatchSnapshot();
});
