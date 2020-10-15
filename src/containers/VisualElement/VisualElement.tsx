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

interface Props {
  onChange: Function;
  changeVisualElement: Function;
  resetSelectedResource: Function;
  name: string;
  types: string[];
  language: string;
  value: any;
  visualElementValue: any;
}

const createPlugins = (
  empty: boolean,
  types: string[],
  onRemove: Function,
  onSelect: Function,
  language: string,
) => {
  return [
    visualElementPickerPlugin({
      types,
      onSelect,
      empty,
      language,
    }),
    visualElementPlugin({
      onRemove,
      onSelect,
      language,
    }),
  ];
};

const VisualElement = ({
  onChange,
  changeVisualElement,
  resetSelectedResource,
  name,
  types,
  language,
  value,
  visualElementValue,
}: Props) => {
  const onRemove = () => {
    onChange({ target: { name, value: {} } });
    resetSelectedResource();
  };

  const plugins = useMemo(() => {
    return createPlugins(
      !value.resource,
      types,
      onRemove,
      changeVisualElement,
      language,
    );
  }, [value.resource, language]);

  return (
    <VisualElementEditor
      value={visualElementValue}
      plugins={plugins}
      onChange={onChange}
    />
  );
};

export default VisualElement;
