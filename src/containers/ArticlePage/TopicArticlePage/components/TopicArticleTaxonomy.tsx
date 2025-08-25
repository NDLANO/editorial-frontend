/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortBy } from "lodash-es";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ExpandableBox, ExpandableBoxSummary, Spinner, UnOrderedList } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ErrorMessage } from "@ndla/ui";
import { partition } from "@ndla/util";
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

  const subjectsQuery = useNodes(
    { language: articleLanguage, taxonomyVersion, nodeType: "SUBJECT" },
    {
      select: (subject) =>
        sortBy(
          subject.filter((s) => !!s.name),
          (s) => s.name,
        ),
    },
  );

  const nodesQuery = useNodes({
    language: articleLanguage,
    contentURI: `urn:article:${article.id}`,
    taxonomyVersion,
    includeContexts: true,
  });

  const [validPlacements, invalidPlacements] = useMemo(() => {
    return partition(nodesQuery.data ?? [], (node) => !!node.breadcrumbs.length);
  }, [nodesQuery.data]);

  if (nodesQuery.isError || subjectsQuery.isError || versionsQuery.isError) {
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
  } else if (nodesQuery.isLoading || subjectsQuery.isLoading || versionsQuery.isLoading) {
    return <Spinner />;
  }

  const node = nodesQuery.data?.[0];

  if (!node) return;

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
        subjects={subjectsQuery.data ?? []}
        taxonomyVersion={taxonomyVersion}
        type="topic"
        article={article}
        language={articleLanguage}
        placements={validPlacements}
        node={node}
      />
      {!!invalidPlacements.length && !!isTaxonomyAdmin && (
        <ExpandableBox>
          <ExpandableBoxSummary>{t("errorMessage.invalidTopicPlacements")}</ExpandableBoxSummary>
          <UnOrderedList>
            {invalidPlacements.map((placement) => (
              <StyledLi key={placement.id}>{placement.id}</StyledLi>
            ))}
          </UnOrderedList>
        </ExpandableBox>
      )}
    </TaxonomyBlock>
  );

  // return (
  //   <TopicTaxonomyBlock
  //     key={taxonomyVersion}
  //     article={article}
  //     subjects={subjectsQuery.data ?? []}
  //     nodes={nodesQuery.data ?? []}
  //     validPlacements={validPlacements}
  //     invalidPlacements={invalidPlacements}
  //     versions={versionsQuery.data ?? []}
  //     hasTaxEntries={hasTaxEntries}
  //     articleLanguage={articleLanguage}
  //   />
  // );
};

export default TopicArticleTaxonomy;
