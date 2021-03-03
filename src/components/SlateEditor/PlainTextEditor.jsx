/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import Types from 'slate-prop-types';
import isHotkey from 'is-hotkey';

const isSaveHotkey = isHotkey('mod+s');

class PlainTextEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(e, editor, next) {
    if (isSaveHotkey(e)) {
      e.preventDefault();
      this.props.handleSubmit();
    }
    next();
  }

  render() {
    const { onChange, value, ...rest } = this.props;
    return (
      <Editor
        value={value}
        onKeyDown={this.onKeyDown}
        onChange={val =>
          onChange({
            target: {
              name: rest.id,
              value: val.value,
              type: 'SlateEditorValue',
            },
          })
        }
        {...rest}
      />
    );
  }
}
PlainTextEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: Types.value.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default PlainTextEditor;
