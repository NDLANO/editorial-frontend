/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { CheckLine } from "@ndla/icons";
import { Text, ComboboxLabel, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../../components/Form/GenericSearchCombobox";
import { fetchDraft, updateDraft } from "../../../../modules/draft/draftApi";
import { TOPIC_NODE } from "../../../../modules/nodes/nodeApiTypes";
import { usePutNodeMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useSearch } from "../../../../modules/search/searchQueries";
import { usePaginatedQuery } from "../../../../util/usePaginatedQuery";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  node: Node;
  rootNodeId: string;
}

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    width: "100%",
  },
});

const StyledCheckLine = styled(CheckLine, {
  base: {
    fill: "stroke.success",
  },
});

const SwapTopicArticle = ({ node, rootNodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const putNodeMutation = usePutNodeMutation();
  const [error, setError] = useState<string | undefined>(undefined);
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();

  const searchQuery = useSearch(
    { query: delayedQuery, language: i18n.language, page, resultTypes: ["draft"], articleTypes: ["topic-article"] },
    { placeholderData: (prev) => prev },
  );

  const handleSubmit = async (topic: MultiSearchSummaryDTO) => {
    setError(undefined);
    try {
      await putNodeMutation.mutateAsync({
        id: node.id,
        nodeType: TOPIC_NODE,
        language: node.language,
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

  return (
    <Wrapper>
      <GenericSearchCombobox
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => item.id.toString()}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onPageChange={(details) => setPage(details.page)}
        onValueChange={(details) => handleSubmit(details.items[0])}
        css={{ width: "100%" }}
        renderItem={(item) => (
          <GenericComboboxItemContent
            title={item.title.title}
            description={item.metaDescription.metaDescription}
            image={{ url: item.metaImage?.url, alt: "" }}
            useFallbackImage
          />
        )}
      >
        <ComboboxLabel>{t("taxonomy.swapTopicArticle.info")}</ComboboxLabel>
        <GenericComboboxInput
          placeholder={t("taxonomy.swapTopicArticle.placeholder")}
          isFetching={searchQuery.isFetching}
        />
      </GenericSearchCombobox>
      <>
        {!!putNodeMutation.isPending && <Spinner size="small" />}
        {!!putNodeMutation.isSuccess && (
          <Text>
            <StyledCheckLine />
            {t("taxonomy.swapTopicArticle.success")}
          </Text>
        )}
        {!!error && (
          <Text color="text.error" data-testid="failedToSwapTopicArticle">
            {error}
          </Text>
        )}
      </>
    </Wrapper>
  );
};

export default SwapTopicArticle;
