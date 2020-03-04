/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useMemo } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

interface Props {
  onChange: Function;
  value: any;
  id: String;
  placeholder: string,
  className: String,
  dataCy: String,
}

const PlainTextEditor = (props: Props): JSX.Element => {
  const { value, id, onChange, placeholder } = props;
  const editor = useMemo(() => withReact(createEditor()), []);
  return (
    <Slate
      id={id}
      editor={editor} 
      value={value} 
      onChange={val => 
        onChange(val)
      }
      >
        <Editable placeholder={placeholder} />
    </Slate>
  )
}
export default PlainTextEditor;
