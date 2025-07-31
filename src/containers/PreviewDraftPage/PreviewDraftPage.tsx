/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { HeroBackground, HeroContent, PageContent } from "@ndla/primitives";
import { ArticleWrapper, ContentTypeHero } from "@ndla/ui";
import LanguageSelector from "./LanguageSelector";
import PreviewDraft from "../../components/PreviewDraft/PreviewDraft";
import { articleIsWide } from "../../components/WideArticleEditorProvider";
import { useDraft } from "../../modules/draft/draftQueries";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { getContentTypeFromResourceTypes } from "../../util/resourceHelpers";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

export const Component = () => <PrivateRoute component={<PreviewDraftPage />} />;

const PreviewDraftPage = () => {
  const params = useParams<"draftId" | "language">();
  const draftId = Number(params.draftId!);
  const language = params.language!;
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const draft = useDraft({ id: draftId, language });
  const resources = useNodes({
    contentURI: `urn:article:${draftId}`,
    taxonomyVersion,
    language,
    nodeType: "RESOURCE",
  });
  const isWide = useMemo(() => articleIsWide(draftId), [draftId]);

  if (resources.isLoading || draft.isLoading) {
    return null;
  }

  const contentType = resources.data?.length
    ? getContentTypeFromResourceTypes(resources.data[0].resourceTypes)
    : undefined;

  const isFrontpage = draft.data?.articleType === "frontpage-article";

  if (isWide) {
    return (
      <PageContent variant="page">
        <LanguageSelector supportedLanguages={draft.data?.supportedLanguages ?? []} />
        <ArticleWrapper>
          <PreviewDraft
            type="article"
            draft={draft.data!}
            contentType={contentType}
            language={language}
            previewAlt={false}
          />
        </ArticleWrapper>
        <title>{`${draft.data?.title?.title} ${t("htmlTitles.titleTemplate")}`}</title>
      </PageContent>
    );
  }

  return (
    <ContentTypeHero contentType={isFrontpage ? "subject-material" : contentType}>
      <HeroBackground />
      <PageContent variant="article" asChild>
        <HeroContent>
          <LanguageSelector supportedLanguages={draft.data?.supportedLanguages ?? []} />
        </HeroContent>
      </PageContent>
      <PageContent variant="article" gutters="tabletUp">
        <PageContent variant="content" asChild>
          <ArticleWrapper>
            <PreviewDraft
              type="article"
              draft={draft.data!}
              contentType={contentType}
              language={language}
              previewAlt={false}
            />
          </ArticleWrapper>
        </PageContent>
      </PageContent>
      <title>{`${draft.data?.title?.title} ${t("htmlTitles.titleTemplate")}`}</title>
    </ContentTypeHero>
  );
};
