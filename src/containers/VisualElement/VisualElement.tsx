/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { FormikHandlers } from 'formik';
import VisualElementEditor from '../../components/SlateEditor/VisualElementEditor';
import { embedPlugin, EmbedElement } from '../../components/SlateEditor/plugins/embed';
import { visualElementPickerPlugin } from '../../components/SlateEditor/plugins/visualElementPicker';

interface Props {
  onChange: FormikHandlers['handleChange'];
  changeVisualElement: (visualElement: string) => void;
  name: string;
  types: string[];
  language: string;
  value: EmbedElement[];
  selectedResource: string;
  resetSelectedResource: () => void;
}

const VisualElement = ({
  onChange,
  changeVisualElement,
  name,
  types,
  language,
  value,
  selectedResource,
  resetSelectedResource,
}: Props) => {
  const plugins = useMemo(() => {
    return [embedPlugin(language, undefined, true), visualElementPickerPlugin(language, types)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResource]);

  return (
    <VisualElementEditor
      name={name}
      value={value}
      plugins={plugins}
      onChange={onChange}
      changeVisualElement={changeVisualElement}
      language={language}
      selectedResource={selectedResource}
      resetSelectedResource={resetSelectedResource}
    />
  );
};

export default VisualElement;
