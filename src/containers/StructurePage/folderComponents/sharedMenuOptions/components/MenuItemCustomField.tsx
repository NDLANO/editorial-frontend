/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons";
import { Button, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, Metadata } from "@ndla/types-taxonomy";
import CustomFieldComponent from "./CustomFieldComponent";
import SubjectForwardField from "./SubjectForwardField";
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

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const Wrapper = styled("div", {
  base: {
    width: "100%",
  },
});

const StyledButton = styled(Button, { base: { alignSelf: "flex-end" } });

interface Props {
  node: Node;
  onCurrentNodeChanged: (node: Node) => void;
}

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

  const programmeSettings = <ToggleProgrammeSubject customFields={customFields} updateFields={setCustomFields} />;

  const topicSettings = (
    <GroupTopicResources
      node={node}
      onChanged={(partialMeta) =>
        onCurrentNodeChanged({
          ...node,
          metadata: { ...node.metadata, ...partialMeta },
        })
      }
    />
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
      <SubjectForwardField
        onSubmit={setCustomFields}
        initialVal={metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]}
      />
    </>
  );

  return (
    <Wrapper>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.metadata.customFields.alterFields")}</h2>
      </Heading>
      <ContentWrapper>
        {nodeType === PROGRAMME && programmeSettings}
        {nodeType === SUBJECT_NODE && subjectSettings}
        {nodeType === TOPIC_NODE && topicSettings}
        {filterHardcodedMetadataValues()
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, value]) => (
            <CustomFieldComponent
              key={`unique-${key}`}
              onSubmit={setCustomFields}
              initialKey={key}
              initialVal={value}
            />
          ))}
        {isOpen ? (
          <CustomFieldComponent onSubmit={setCustomFields} onClose={() => setOpen(false)} />
        ) : (
          <StyledButton variant="secondary" size="small" onClick={() => setOpen(true)}>
            <AddLine />
            {t("taxonomy.metadata.customFields.addField")}
          </StyledButton>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

export default MenuItemCustomField;
