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
import { Spinner } from "@ndla/primitives";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { ErrorMessage } from "@ndla/ui";
import TopicTaxonomyBlock from "./TopicTaxonomyBlock";
import { useNodes } from "../../../../modules/nodes/nodeQueries";
import { useVersions } from "../../../../modules/taxonomy/versions/versionQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

type Props = {
  article: IArticleDTO;
  articleLanguage: string;
  hasTaxEntries: boolean;
};

const partitionByValidity = (nodes: Node[]) => {
  const [validPlacements, invalidPlacements] = nodes.reduce<[Node[], Node[]]>(
    (acc, curr) => {
      if (curr.breadcrumbs?.length) {
        acc[0].push(curr);
      } else {
        acc[1].push(curr);
      }
      return acc;
    },
    [[], []],
  );

  return [validPlacements, invalidPlacements];
};

const TopicArticleTaxonomy = ({ article, articleLanguage, hasTaxEntries }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const versionsQuery = useVersions();

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
    return partitionByValidity(nodesQuery.data ?? []);
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

  return (
    <TopicTaxonomyBlock
      key={taxonomyVersion}
      article={article}
      subjects={subjectsQuery.data ?? []}
      nodes={nodesQuery.data ?? []}
      validPlacements={validPlacements}
      invalidPlacements={invalidPlacements}
      versions={versionsQuery.data ?? []}
      hasTaxEntries={hasTaxEntries}
      articleLanguage={articleLanguage}
    />
  );
};

export default TopicArticleTaxonomy;
