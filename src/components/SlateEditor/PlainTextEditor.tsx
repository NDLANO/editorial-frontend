/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useMemo } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

interface Props {
  onChange: (value: Node[]) => void;
  value: Node[];
  id: String;
  placeholder: string,
  className: String,
  dataCy: String,
}

const PlainTextEditor = (props: Props) => {
  const { value, id, placeholder } = props;
  const [val, setValue] = useState(value)
  const editor = useMemo(() => withReact(createEditor()), [])
  const onChange = (val: Node[]) => {
    setValue(val);
    props.onChange(val);
  }
  return (
    <Slate id={id} editor={editor} value={val} onChange={onChange}>
      <Editable 
        placeholder={placeholder}
      />
    </Slate>
  )
}
export default PlainTextEditor;
