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
import { EmbedElements, embedPlugin } from '../../components/SlateEditor/plugins/embed';
import { audioPlugin } from '../../components/SlateEditor/plugins/audio';
import { h5pPlugin } from '../../components/SlateEditor/plugins/h5p';

interface Props {
  onChange: FormikHandlers['handleChange'];
  name: string;
  types: string[];
  language: string;
  value: EmbedElements[];
  selectedResource: string;
  resetSelectedResource: () => void;
  allowDecorative: boolean;
}

const VisualElement = ({
  onChange,
  name,
  types,
  language,
  value,
  selectedResource,
  resetSelectedResource,
  allowDecorative = false,
}: Props) => {
  const plugins = useMemo(() => {
    return [
      audioPlugin(language, true),
      h5pPlugin(language, true),
      embedPlugin(language, true, allowDecorative),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResource]);

  return (
    <VisualElementEditor
      types={types}
      name={name}
      value={value}
      plugins={plugins}
      onChange={onChange}
      language={language}
      selectedResource={selectedResource}
      resetSelectedResource={resetSelectedResource}
    />
  );
};

export default VisualElement;
