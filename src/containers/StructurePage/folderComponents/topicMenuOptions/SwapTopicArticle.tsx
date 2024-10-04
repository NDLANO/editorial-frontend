/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { spacing, colors } from "@ndla/core";
import { SubjectMaterial } from "@ndla/icons/contentType";
import { Done } from "@ndla/icons/editor";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import { OldSpinner } from "../../../../components/OldSpinner";
import RoundIcon from "../../../../components/RoundIcon";
import { fetchDraft, updateDraft } from "../../../../modules/draft/draftApi";
import { TOPIC_NODE } from "../../../../modules/nodes/nodeApiTypes";
import { usePutNodeMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useSearch } from "../../../../modules/search/searchQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";
import MenuItemButton from "../sharedMenuOptions/components/MenuItemButton";
import SearchDropdown from "../sharedMenuOptions/components/SearchDropdown";
import { StyledErrorMessage } from "../styles";

interface Props {
  node: Node;
  rootNodeId: string;
  editModeHandler: EditModeHandler;
}

const StyledSpinner = styled(OldSpinner)`
  margin: 0px 4px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing.small};
`;

const StyledMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledActionContent = styled.div`
  padding-left: ${spacing.normal};
`;

const StyledSuccessIcon = styled(Done)`
  border-radius: 90px;
  margin: 5px;
  background-color: ${colors.support.green};
  color: ${colors.white};
`;

const SwapTopicArticle = ({ node, rootNodeId, editModeHandler: { editMode, toggleEditMode } }: Props) => {
  const { t, i18n } = useTranslation();
  const putNodeMutation = usePutNodeMutation();
  const toggleEditModeFunc = () => toggleEditMode("swapTopicArticle");
  const [error, setError] = useState<string | undefined>(undefined);
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();

  useEffect(() => {
    setError(undefined);
  }, [editMode]);

  const handleSubmit = async (topic: IMultiSearchSummary) => {
    setError(undefined);
    toggleEditModeFunc();
    try {
      await putNodeMutation.mutateAsync({
        id: node.id,
        nodeType: TOPIC_NODE,
        contentUri: `urn:article:${topic.id}`,
        taxonomyVersion,
      });
      qc.invalidateQueries({
        queryKey: nodeQueryKeys.childNodes({
          taxonomyVersion,
          language: i18n.language,
          id: rootNodeId,
        }),
      });
      const draft = await fetchDraft(topic.id, i18n.language);
      await updateDraft(
        draft.id,
        {
          revision: draft.revision,
          notes: draft.notes.map((n) => n.note).concat("Artikkel satt som nytt emne"),
          metaImage: undefined,
          responsibleId: undefined,
        },
        taxonomyVersion,
      );
    } catch (e) {
      setError("taxonomy.swapTopicArticle.failed");
    }
  };

  if (editMode === "swapTopicArticle") {
    return (
      <Wrapper>
        <RoundIcon open small smallIcon icon={<SubjectMaterial />} />
        <SearchDropdown
          useQuery={useSearch}
          onChange={handleSubmit}
          placeholder={t("taxonomy.swapTopicArticle.placeholder")}
          params={{ contextTypes: ["topic-article"], language: i18n.language }}
          transform={(res) => {
            return {
              ...res,
              results: res.results.map((r) => ({
                originalItem: r,
                name: r.title.title,
                id: r.id,
                image: r.metaImage?.url,
                description: r.metaDescription.metaDescription,
              })),
            };
          }}
        />
      </Wrapper>
    );
  }

  return (
    <StyledMenuWrapper>
      <MenuItemButton onClick={toggleEditModeFunc}>
        <RoundIcon small icon={<SubjectMaterial />} />
        {t("taxonomy.swapTopicArticle.info")}
      </MenuItemButton>
      <StyledActionContent>
        {putNodeMutation.isPending && (
          <MenuContent>
            <StyledSpinner />
          </MenuContent>
        )}
        {putNodeMutation.isSuccess && (
          <MenuContent>
            <StyledSuccessIcon />
            {t("taxonomy.swapTopicArticle.success")}
          </MenuContent>
        )}
        {error && <StyledErrorMessage data-testid="failedToSwapTopicArticle">{t(error)}</StyledErrorMessage>}
      </StyledActionContent>
    </StyledMenuWrapper>
  );
};

export default SwapTopicArticle;
