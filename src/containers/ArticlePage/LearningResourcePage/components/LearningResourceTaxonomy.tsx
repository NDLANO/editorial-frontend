/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortBy } from "lodash-es";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import TaxonomyBlock from "./taxonomy/TaxonomyBlock";
import { useNodes } from "../../../../modules/nodes/nodeQueries";
import { useAllResourceTypes } from "../../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import { useVersions } from "../../../../modules/taxonomy/versions/versionQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  article: IArticleDTO;
  articleLanguage: string;
  hasTaxEntries: boolean;
}

const LearningResourceTaxonomy = ({ article, articleLanguage, hasTaxEntries }: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const nodesQuery = useNodes({
    contentURI: `urn:article:${article.id}`,
    taxonomyVersion,
    language: articleLanguage,
    includeContexts: true,
  });

  const subjectsQuery = useNodes(
    { language: i18n.language, taxonomyVersion, nodeType: "SUBJECT" },
    {
      select: (subject) =>
        sortBy(
          subject.filter((s) => !!s.name),
          (s) => s.name,
        ),
    },
  );

  const allResourceTypesQuery = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    { select: (rts) => rts },
  );

  const versionsQuery = useVersions();

  if (nodesQuery.isLoading || subjectsQuery.isLoading || allResourceTypesQuery.isLoading || versionsQuery.isLoading) {
    return <Spinner />;
  }

  return (
    <TaxonomyBlock
      key={taxonomyVersion}
      nodes={nodesQuery.data ?? []}
      subjects={subjectsQuery.data ?? []}
      hasTaxEntries={hasTaxEntries}
      resourceTypes={allResourceTypesQuery.data ?? []}
      article={article}
      articleLanguage={articleLanguage}
      versions={versionsQuery.data ?? []}
    />
  );
};

export default memo(LearningResourceTaxonomy);
