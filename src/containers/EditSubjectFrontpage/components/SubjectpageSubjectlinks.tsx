/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Node } from "@ndla/types-taxonomy";
import { NodeList, NodeSearchDropdown } from "./nodes";
import FieldHeader from "../../../components/Field/FieldHeader";

interface Props {
  subjects: Node[];
  fieldName: string;
}

const SubjectpageSubjectlinks = ({ subjects, fieldName }: Props) => {
  const { t } = useTranslation();
  const [subjectList, setSubjectList] = useState<Node[]>([]);
  const [field, _meta, helpers] = useField<string[]>(fieldName);

  useEffect(() => {
    setSubjectList(subjects);
  }, [subjects]);

  const handleAddToList = (node: Node) => {
    const updatedList = [...subjectList, node];
    setSubjectList(updatedList);
    updateFormik(updatedList.map((subject) => subject.id));
  };

  const onUpdateNodes = (updatedList: Node[]) => {
    setSubjectList(updatedList);
    updateFormik(updatedList.map((subject) => subject.id));
  };

  const updateFormik = (list: string[]) => {
    helpers.setTouched(true, false);
    field.onChange({
      target: {
        name: fieldName,
        value: list || null,
      },
    });
  };

  return (
    <>
      <FieldHeader title={t(`subjectpageForm.${fieldName}`)} />
      <NodeList nodes={subjectList} nodeSet={fieldName} onUpdate={onUpdateNodes} />
      <NodeSearchDropdown selectedItems={subjectList} onChange={handleAddToList} wide={false} />
    </>
  );
};

export default SubjectpageSubjectlinks;
