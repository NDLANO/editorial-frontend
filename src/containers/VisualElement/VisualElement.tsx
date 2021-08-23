/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import { FormikHandlers } from 'formik';
import VisualElementEditor from '../../components/SlateEditor/VisualElementEditor';
import visualElementPlugin from '../../components/SlateEditor/plugins/visualElement';
import visualElementPickerPlugin from '../../components/SlateEditor/plugins/visualElementPicker';
import { VisualElement as VisualElementType } from '../../interfaces';

interface Props {
  onChange: FormikHandlers['handleChange'];
  changeVisualElement: (visualElement: string) => void;
  name: string;
  isSubjectPage: boolean;
  types: string[];
  language: string;
  value: VisualElementType;
}

const createPlugins = (
  empty: boolean,
  types: string[],
  changeVisualElement: (visualElement: string) => void,
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
  isSubjectPage,
  types,
  language,
  value,
}: Props) => {
  const plugins = useMemo(() => {
    const valueLength = value !== undefined ? Object.keys(value).length : 0;
    return createPlugins(!valueLength, types, changeVisualElement, language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, language, changeVisualElement]);

  if (isSubjectPage && value?.resource === 'image') {
    delete value.caption;
  }

  return <VisualElementEditor name={name} value={value} plugins={plugins} onChange={onChange} />;
};

export default VisualElement;
