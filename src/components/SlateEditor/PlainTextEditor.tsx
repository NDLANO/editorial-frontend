/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Editor as EditorType, EditorProperties, Operation, Value } from 'slate';
import Types from 'slate-prop-types';
import isHotkey from 'is-hotkey';
import { List as ImmutableList } from 'immutable';

const isSaveHotkey = isHotkey('mod+s');

interface SlateEditorProps {
  id?: string;
  autoCorrect?: boolean;
  autoFocus?: boolean;
  className?: string;
  onChange?: EditorProperties['onChange'];
  placeholder?: string | ReactElement;
  plugins?: EditorProperties['plugins'];
  readOnly?: boolean;
  role?: string;
  spellCheck?: boolean;
  taxIndex?: number;
  value?: Value;
}

interface Props extends Omit<SlateEditorProps, 'onChange'> {
  handleSubmit: () => void;
  onChange: Function;
  onBlur: Function;
}

class PlainTextEditor extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(e: Event, editor: EditorType, next: Function) {
    if (isSaveHotkey(e)) {
      e.preventDefault();
      this.props.handleSubmit();
    }
    next();
  }

  render() {
    const { onChange, value, handleSubmit, ...rest } = this.props;
    return (
      <Editor
        value={value}
        onKeyDown={this.onKeyDown}
        onChange={(val: { operations: ImmutableList<Operation>; value: Value }) =>
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

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: Types.value.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
}

export default PlainTextEditor;
