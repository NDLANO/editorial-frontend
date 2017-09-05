/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Form = props => {
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

export default Form;
