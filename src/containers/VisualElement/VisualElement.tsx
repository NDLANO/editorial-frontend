/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import { FormikHandlers } from 'formik';
import { Descendant } from 'slate';
import VisualElementEditor from '../../components/SlateEditor/VisualElementEditor';
import { embedPlugin } from '../../components/SlateEditor/plugins/embed';

interface Props {
  onChange: FormikHandlers['handleChange'];
  changeVisualElement: (visualElement: string) => void;
  name: string;
  isSubjectPage: boolean;
  types: string[];
  language: string;
  value: Descendant[];
}

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
    return [embedPlugin(language)];
  }, [language]);

  /*if (isSubjectPage && value.resource === 'image') {
    delete value.caption;
  }*/
  // TODO: Upgrade to slate 0.62
  return (
    <VisualElementEditor
      name={name}
      value={value}
      plugins={plugins}
      onChange={onChange}
      changeVisualElement={changeVisualElement}
      types={types}
      language={language}
    />
  );
};

export default VisualElement;
