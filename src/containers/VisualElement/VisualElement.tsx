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

interface Props {
  onChange: FormikHandlers['handleChange'];
  name: string;
  types: string[];
  language: string;
  value: EmbedElement[];
  selectedResource: string;
  resetSelectedResource: () => void;
}

const VisualElement = ({
  onChange,
  name,
  types,
  language,
  value,
  selectedResource,
  resetSelectedResource,
}: Props) => {
  const plugins = useMemo(() => {
    return [embedPlugin(language, undefined, true)];
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
