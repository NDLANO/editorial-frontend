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
import { Embed } from '../../interfaces';

interface Props {
  onChange: Function;
  changeVisualElement: Function;
  name: string;
  types: string[];
  language: string;
  value: Embed;
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
  value,
}: Props) => {
  const plugins = useMemo(() => {
    return createPlugins(
      !Object.keys(value).length,
      types,
      changeVisualElement,
      language,
    );
  }, [value, language]);

  return (
    <VisualElementEditor
      name={name}
      value={value}
      plugins={plugins}
      onChange={onChange}
    />
  );
};

export default VisualElement;
