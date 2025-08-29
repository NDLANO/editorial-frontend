/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ExpandableBox, ExpandableBoxSummary, Spinner, Text, UnOrderedList } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ErrorMessage } from "@ndla/ui";
import { partition, sortBy } from "@ndla/util";
import { TaxonomyBlock } from "../../../../components/Taxonomy/TaxonomyBlock";
import { TaxonomyConnections } from "../../../../components/Taxonomy/TaxonomyConnections";
import { TAXONOMY_ADMIN_SCOPE } from "../../../../constants";
import { useNodes } from "../../../../modules/nodes/nodeQueries";
import { useVersions } from "../../../../modules/taxonomy/versions/versionQueries";
import { useSession } from "../../../Session/SessionProvider";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

type Props = {
  article: IArticleDTO;
  articleLanguage: string;
  hasTaxEntries: boolean;
};

const StyledLi = styled("li", {
  base: {
    color: "text.error",
  },
});

const TopicArticleTaxonomy = ({ article, articleLanguage, hasTaxEntries }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const versionsQuery = useVersions();
  const { userPermissions } = useSession();
  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  const nodesQuery = useNodes({
    language: articleLanguage,
    contentURI: `urn:article:${article.id}`,
    taxonomyVersion,
    includeContexts: true,
  });

  const [validPlacements, invalidPlacements] = useMemo(() => {
    return partition(
      sortBy(nodesQuery.data ?? [], (n) => n.id),
      (node) => !!node.breadcrumbs.length,
    );
  }, [nodesQuery.data]);

  if (nodesQuery.isError || versionsQuery.isError) {
    changeVersion("");
    return (
      <ErrorMessage
        illustration={{
          url: "/Oops.gif",
          altText: t("errorMessage.title"),
        }}
        messages={{
          title: t("errorMessage.title"),
          description: t("errorMessage.taxonomy"),
          back: t("errorMessage.back"),
          goToFrontPage: t("errorMessage.goToFrontPage"),
        }}
      />
    );
  } else if (nodesQuery.isLoading || versionsQuery.isLoading) {
    return <Spinner />;
  }

  const node = nodesQuery.data?.[0];

  return (
    <TaxonomyBlock
      nodes={nodesQuery.data ?? []}
      hasTaxEntries={hasTaxEntries}
      nodeType="topic"
      versions={versionsQuery.data ?? []}
      resourceId={article.id}
      resourceTitle={article.title?.title ?? ""}
      resourceLanguage={articleLanguage}
    >
      <TaxonomyConnections
        taxonomyVersion={taxonomyVersion}
        type="topic"
        resourceType="article"
        resourceId={article.id}
        resourceTitle={article.title?.title ?? ""}
        language={articleLanguage}
        placements={validPlacements}
        node={node}
      />
      {!!invalidPlacements.length && !!isTaxonomyAdmin && (
        <ExpandableBox>
          <ExpandableBoxSummary>{t("errorMessage.invalidTopicPlacements")}</ExpandableBoxSummary>
          <Text>{t("errorMessage.invalidTopicPlacementsDescription")}</Text>
          <UnOrderedList>
            {invalidPlacements.map((placement) => (
              <StyledLi key={placement.id}>{placement.id}</StyledLi>
            ))}
          </UnOrderedList>
        </ExpandableBox>
      )}
    </TaxonomyBlock>
  );
};

export default TopicArticleTaxonomy;
