/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, colors } from "@ndla/core";
import { AddLine } from "@ndla/icons/action";
import { Node, Metadata } from "@ndla/types-taxonomy";
import ConstantMetaField from "./ConstantMetaField";
import CustomFieldComponent from "./CustomFieldComponent";
import {
  TAXONOMY_CUSTOM_FIELD_LANGUAGE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_SA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_DA,
} from "../../../../../constants";
import { PROGRAMME, SUBJECT_NODE, TOPIC_NODE } from "../../../../../modules/nodes/nodeApiTypes";
import { useUpdateNodeMetadataMutation } from "../../../../../modules/nodes/nodeMutations";
import { getNodeTypeFromNodeId, getRootIdForNode, isRootNode } from "../../../../../modules/nodes/nodeUtil";
import { useTaxonomyVersion } from "../../../../StructureVersion/TaxonomyVersionProvider";
import SubjectCategorySelector from "../../subjectMenuOptions/SubjectCategorySelector";
import SubjectDASelector from "../../subjectMenuOptions/SubjectDASelector";
import SubjectLMASelector from "../../subjectMenuOptions/SubjectLMASelector";
import SubjectSASelector from "../../subjectMenuOptions/SubjectSASelector";
import SubjectTypeSelector from "../../subjectMenuOptions/SubjectTypeSelector";
import TaxonomyMetadataLanguageSelector from "../../subjectMenuOptions/TaxonomyMetadataLanguageSelector";
import ToggleExplanationSubject from "../../subjectMenuOptions/ToggleExplanationSubject";
import ToggleProgrammeSubject from "../../subjectMenuOptions/ToggleProgrammeSubject";
import GroupTopicResources from "../../topicMenuOptions/GroupTopicResources";

interface Props {
  node: Node;
  onCurrentNodeChanged: (node: Node) => void;
}

const StyledFilterWrapper = styled.div`
  background-color: white;
  padding: calc(${spacing.small} / 2);
  position: relative;
`;

const StyledButton = styled(ButtonV2)`
  color: ${colors.brand.greyDark};
`;

const MenuItemCustomField = ({ node, onCurrentNodeChanged }: Props) => {
  const { t } = useTranslation();
  const { id, metadata } = node;
  const nodeType = getNodeTypeFromNodeId(id);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const [customFields, setCustomFields] = useState<Metadata["customFields"]>(metadata.customFields);

  const { mutateAsync: updateMetadata } = useUpdateNodeMetadataMutation();

  useEffect(() => {
    if (customFields !== metadata.customFields) {
      updateMetadata({
        id,
        metadata: { customFields },
        rootId: isRootNode(node) ? undefined : getRootIdForNode(node),
        taxonomyVersion,
      });
    }
  }, [customFields]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredProgrammeFields = [TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT];
  const filteredSubjectFields = [
    TAXONOMY_CUSTOM_FIELD_LANGUAGE,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_SA,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_DA,
  ];
  const filteredTopicFields = [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];

  const filterHardcodedMetadataValues = () => {
    return Object.entries(customFields).filter(([taxonomyMetadataField, _]) => {
      let fieldsToFilter = filteredTopicFields;
      if (nodeType === SUBJECT_NODE) {
        fieldsToFilter = filteredSubjectFields;
      } else if (nodeType === PROGRAMME) {
        fieldsToFilter = filteredProgrammeFields;
      }
      return !fieldsToFilter.includes(taxonomyMetadataField);
    });
  };

  const programmeSettings = (
    <>
      <ToggleProgrammeSubject customFields={customFields} updateFields={setCustomFields} />
    </>
  );

  const topicSettings = (
    <>
      <GroupTopicResources
        node={node}
        onChanged={(partialMeta) =>
          onCurrentNodeChanged({
            ...node,
            metadata: { ...node.metadata, ...partialMeta },
          })
        }
      />
    </>
  );

  const subjectSettings = (
    <>
      <TaxonomyMetadataLanguageSelector customFields={customFields} updateCustomFields={setCustomFields} />
      <SubjectLMASelector customFields={customFields} updateCustomFields={setCustomFields} />
      <SubjectSASelector customFields={customFields} updateCustomFields={setCustomFields} />
      <SubjectDASelector customFields={customFields} updateCustomFields={setCustomFields} />
      <SubjectCategorySelector customFields={customFields} updateCustomFields={setCustomFields} />
      <SubjectTypeSelector customFields={customFields} updateCustomFields={setCustomFields} />
      <ToggleExplanationSubject customFields={customFields} updateFields={setCustomFields} />
      <ConstantMetaField
        keyPlaceholder={t("taxonomy.metadata.customFields.oldSubjectId")}
        valuePlaceholder={"urn:subject:***"}
        fieldKey={TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID}
        onSubmit={setCustomFields}
        initialVal={metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]}
      />
    </>
  );

  return (
    <>
      {nodeType === PROGRAMME && programmeSettings}
      {nodeType === SUBJECT_NODE && subjectSettings}
      {nodeType === TOPIC_NODE && topicSettings}
      {filterHardcodedMetadataValues()
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => (
          <CustomFieldComponent key={`unique-${key}`} onSubmit={setCustomFields} initialKey={key} initialVal={value} />
        ))}
      {isOpen ? (
        <CustomFieldComponent onSubmit={setCustomFields} onClose={() => setOpen(false)} />
      ) : (
        <StyledFilterWrapper>
          <StyledButton
            variant="link"
            colorTheme="greyLighter"
            data-testid="addCustomFieldButton"
            onClick={() => setOpen(true)}
          >
            <AddLine />
            {t("taxonomy.metadata.customFields.addField")}
          </StyledButton>
        </StyledFilterWrapper>
      )}
    </>
  );
};

export default MenuItemCustomField;
