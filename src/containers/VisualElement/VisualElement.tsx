/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import VisualElementEditor from '../../components/SlateEditor/VisualElementEditor';
import visualElementPlugin from '../../components/SlateEditor/plugins/visualElement';
import visualElementPickerPlugin from '../../components/SlateEditor/plugins/visualElementPicker';
import { renderBlock } from '../../components/SlateEditor/slateRendering';

interface Props {
  onChange: Function,
  changeVisualElement: Function,
  resetSelectedResource: Function,
  name: string,
  types: string[],
  value: any,
  visualElementValue: any,
}

const VisualElement = ({
  onChange,
  changeVisualElement,
  resetSelectedResource,
  name,
  types,
  value,
  visualElementValue
}: Props) => {
  const empty = !value.resource;
  const plugins = [
    empty ? 
      visualElementPickerPlugin({
        onSelect: changeVisualElement,
        types,
      })
      :
      visualElementPlugin({
        onChange,
        name,
        resetSelectedResource
      }),
  ];

  return (
    <VisualElementEditor
      value={visualElementValue}
      plugins={plugins}
      onChange={changeVisualElement}
      renderBlock={renderBlock}
    />
  )
}

export default VisualElement;