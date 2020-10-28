/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import VisualElementEditor from '../../components/SlateEditor/VisualElementEditor';
import visualElementPlugin from '../../components/SlateEditor/plugins/visualElement';
import visualElementPickerPlugin from '../../components/SlateEditor/plugins/visualElementPicker';
import { Value } from 'slate';

interface Props {
  onChange: Function;
  changeVisualElement: Function;
  name: string;
  types: string[];
  language: string;
  resource: string;
  value: any;
}

const createPlugins = (
  empty: boolean,
  types: string[],
  changeVisualElement: Function,
  language: string,
) => {
  return [
    visualElementPickerPlugin({
      types,
      changeVisualElement,
      empty,
      language,
    }),
    visualElementPlugin({
      changeVisualElement,
      language,
    }),
  ];
};

const VisualElement = ({
  onChange,
  changeVisualElement,
  name,
  types,
  language,
  resource,
  value,
}: Props) => {

  const plugins = useMemo(() => {
    return createPlugins(
      !value.toJSON().document.nodes[0].data.resource,
      types,
      changeVisualElement,
      language,
    );
  }, [resource, language]);

  return <VisualElementEditor
    name={name}
    value={value} 
    plugins={plugins}
    onChange={onChange}
  />;
};

export default VisualElement;
