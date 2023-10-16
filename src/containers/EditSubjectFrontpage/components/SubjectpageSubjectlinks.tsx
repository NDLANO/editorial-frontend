/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useField, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldHeader } from '@ndla/forms';
import { Node } from '@ndla/types-taxonomy';

import { NodeList, NodeSearchDropdown } from './nodes';
import { useSearchNodes } from '../../../modules/nodes/nodeQueries';

interface Props {
  subjects: string[];
  fieldName: string;
}

const SubjectpageSubjectlinks = ({ subjects, fieldName }: Props) => {
  const { t } = useTranslation();
  const [subjectList, setSubjectList] = useState<Node[]>([]);
  const { setFieldTouched } = useFormikContext();
  const [FieldInputProps] = useField<string[]>(fieldName);
  const { onChange } = FieldInputProps;

  const { data } = useSearchNodes({
    page: 1,
    taxonomyVersion: 'default',
    nodeType: 'SUBJECT',
    ids: subjects,
  });

  useEffect(() => {
    setSubjectList(data ? data.results.filter((node) => subjects.includes(node.id)) : []);
  }, [data, subjects]);

  const handleDeleteFromList = (id: string) => {
    const updatedList = subjectList.filter((item) => item.id !== id);
    setSubjectList(updatedList);
    updateFormik(updatedList.map((subject) => subject.id));
  };

  const handleAddToList = (node: Node) => {
    const updatedList = [...subjectList, node];
    setSubjectList(updatedList);
    updateFormik(updatedList.map((subject) => subject.id));
  };

  const updateFormik = (list: string[]) => {
    setFieldTouched(fieldName, true, false);
    onChange({
      target: {
        name: fieldName,
        value: list || null,
      },
    });
  };

  return (
    <>
      <FieldHeader title={t(`subjectpageForm.${fieldName}`)} />
      <NodeList nodes={subjectList} nodeSet={fieldName} onDelete={handleDeleteFromList} />
      <NodeSearchDropdown selectedItems={subjectList} onChange={handleAddToList} />
    </>
  );
};

export default SubjectpageSubjectlinks;
