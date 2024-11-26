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
import { NodeList } from "./nodes";
import { NodeSearchDropdown } from "./nodes/NodeSearchDropdown";
import { searchNodes } from "../../../modules/nodes/nodeApi";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  subjectIds: string[];
  fieldName: string;
}

const SubjectpageSubjectlinks = ({ subjectIds, fieldName }: Props) => {
  const { t } = useTranslation();
  const [subjectList, setSubjectList] = useState<Node[]>([]);
  const [, , helpers] = useField<string[]>(fieldName);
  const { taxonomyVersion } = useTaxonomyVersion();

  useEffect(() => {
    (async () => {
      if (!subjectList.length && subjectIds.length) {
        const nodes = await searchNodes({ ids: subjectIds, taxonomyVersion });
        setSubjectList(nodes.results);
      }
    })();
  }, [subjectIds, subjectList.length, taxonomyVersion]);

  const onValueChange = (node: Node) => {
    if (subjectList.includes(node)) {
      const filtered = subjectList.filter((item) => item.id !== node.id);
      onUpdateNodes(filtered);
    } else {
      onUpdateNodes(subjectList.concat(node));
    }
  };

  const onUpdateNodes = (updatedList: Node[]) => {
    setSubjectList(updatedList);
    updateFormik(updatedList.map((subject) => subject.id));
  };

  const updateFormik = (list: string[]) => {
    helpers.setTouched(true, false);
    helpers.setValue(list || null, true);
  };

  return (
    <>
      <NodeSearchDropdown
        selectedItems={subjectList}
        onChange={onValueChange}
        label={t(`subjectpageForm.${fieldName}`)}
      />
      <NodeList nodes={subjectList} onUpdate={onUpdateNodes} />
    </>
  );
};

export default SubjectpageSubjectlinks;
