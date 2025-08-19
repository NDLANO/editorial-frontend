/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, SwitchRoot, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchThumb } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { Article } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";
import { toFormArticle } from "../../../components/PreviewDraft/PreviewDraft";
import { useTransformedArticle } from "../../../components/PreviewDraft/useTransformedArticle";
import { useArticle } from "../../../modules/article/articleQueries";
import { useDraft } from "../../../modules/draft/draftQueries";
import { useNode } from "../../../modules/nodes/nodeQueries";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface ArticleStepProps {
  step: ILearningStepV2DTO;
  language: string;
  children?: ReactNode;
}

const StyledSwitchRoot = styled(SwitchRoot, {
  base: {
    marginBlock: "xsmall",
    alignSelf: "flex-end",
    justifySelf: "flex-end",
  },
});

const extractIdsFromUrl = (url: string) => {
  const parts = url.split("/");
  const [taxId, articleId] = parts.slice(-2);
  return { taxId, articleId: Number.isNaN(articleId) ? undefined : parseInt(articleId) };
};

export const ArticleStep = ({ step, children, language }: ArticleStepProps) => {
  const [showPublished, setShowPublished] = useState(false);
  const { t } = useTranslation();
  const { articleId, taxId } = step.articleId
    ? { articleId: step.articleId }
    : extractIdsFromUrl(step.embedUrl?.url ?? "");
  const { taxonomyVersion } = useTaxonomyVersion();

  const nodeQuery = useNode({ id: taxId ?? "", taxonomyVersion, language }, { enabled: !!taxId });
  const draftQuery = useDraft({ id: articleId ?? 0, language }, { enabled: !!articleId });
  const articleQuery = useArticle({ id: articleId ?? 0, language }, { enabled: !!articleId });
  const { article } = useTransformedArticle({
    language,
    draft:
      showPublished && articleQuery.data
        ? toFormArticle(articleQuery.data, language)
        : draftQuery.data
          ? toFormArticle(draftQuery.data, language)
          : undefined,
    previewAlt: false,
    useDraftConcepts: false,
  });

  if (draftQuery.isLoading || nodeQuery.isLoading) return <Spinner />;

  if (!draftQuery.data || !article) return null;

  return (
    <EmbedPageContent variant="content">
      <StyledSwitchRoot
        checked={showPublished}
        onCheckedChange={(details) => setShowPublished(details.checked)}
        disabled={!articleQuery.data}
      >
        <SwitchLabel>{t("learningpathForm.preview.showPublished")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </StyledSwitchRoot>
      {!!draftQuery.data?.metaDescription?.metaDescription && (
        <meta name="description" content={draftQuery.data.metaDescription.metaDescription} />
      )}
      <Article
        id={draftQuery.data.id.toString()}
        article={article}
        contentTypeLabel={nodeQuery.data?.resourceTypes?.[0]?.name}
        contentType={
          draftQuery.data?.articleType === "topic-article"
            ? "topic-article"
            : getContentTypeFromResourceTypes(nodeQuery.data?.resourceTypes ?? [])
        }
      >
        {children}
      </Article>
    </EmbedPageContent>
  );
};
