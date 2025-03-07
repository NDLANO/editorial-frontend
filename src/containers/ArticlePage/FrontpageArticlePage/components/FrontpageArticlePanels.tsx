/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageContent, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import FrontpageArticleFormContent from "./FrontpageArticleFormContent";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../../components/Accordion/FormAccordions";
import { useWideArticle } from "../../../../components/WideArticleEditorProvider";
import { STORED_HIDE_COMMENTS } from "../../../../constants";
import { getTextFromHTML } from "../../../../util/llmUtils";
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from "../../../FormikForm";
import { FrontpageArticleFormType } from "../../../FormikForm/articleFormHooks";
import { useLocalStorageBooleanState } from "../../../WelcomePage/hooks/storedFilterHooks";
import CommentSection, { RESET_COMMENTS_STATUSES } from "../../components/CommentSection";
import PanelTitleWithChangeIndicator from "../../components/PanelTitleWithChangeIndicator";
import RevisionNotes from "../../components/RevisionNotes";
import { FlatArticleKeys } from "../../components/types";

const StyledWrapper = styled("div", {
  base: {
    display: "grid",
  },
  variants: {
    showComments: {
      true: {
        gridTemplateColumns: "minmax(0, 1fr) token(spacing.surface.xxsmall)",
      },
      false: {
        gridTemplateColumns: "minmax(0, 1fr)",
      },
    },
  },
});

const StyledControls = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    justifyContent: "flex-end",
  },
});

interface Props {
  article?: IArticleDTO;
  articleHistory: IArticleDTO[] | undefined;
  articleLanguage: string;
}

const FrontpageArticlePanels = ({ article, articleHistory, articleLanguage }: Props) => {
  const [hideComments, setHideComments] = useLocalStorageBooleanState(STORED_HIDE_COMMENTS);
  const { t } = useTranslation();
  const { errors } = useFormikContext<FrontpageArticleFormType>();
  const { toggleWideArticles, isWideArticle } = useWideArticle();

  const contentTitleFields = useMemo<FlatArticleKeys[]>(
    () => ["title.title", "introduction.introduction", "content.content"],
    [],
  );
  const copyrightFields = useMemo<FlatArticleKeys[]>(() => ["copyright"], []);

  const removeComments = useMemo(
    () => RESET_COMMENTS_STATUSES.some((s) => s === article?.status.current),
    [article?.status],
  );

  const articleText = useMemo(() => {
    if (!article?.content) return " ";
    return getTextFromHTML(article.content.content);
  }, [article?.content]);

  return (
    <>
      <StyledControls>
        {!!article?.id && (
          <SwitchRoot checked={isWideArticle} onCheckedChange={() => toggleWideArticles(article.id)}>
            <SwitchLabel>{t("frontpageArticleForm.isFrontpageArticle.toggleArticle")}</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchHiddenInput />
          </SwitchRoot>
        )}
        {!removeComments && (
          <SwitchRoot checked={!hideComments} onCheckedChange={() => setHideComments(!hideComments)}>
            <SwitchLabel>{t("form.comment.showComments")}</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchHiddenInput />
          </SwitchRoot>
        )}
      </StyledControls>
      <StyledWrapper showComments={!hideComments}>
        <FormAccordions defaultOpen={["frontpage-article-content"]}>
          <FormAccordion
            id={"frontpage-article-content"}
            title={
              <PanelTitleWithChangeIndicator
                title={t("form.contentSection")}
                article={article}
                articleHistory={articleHistory}
                fieldsToIndicatedChangesFor={contentTitleFields}
              />
            }
            hasError={!!(errors.title || errors.introduction || errors.content)}
          >
            <PageContent variant={isWideArticle ? "page" : "content"}>
              <FrontpageArticleFormContent articleLanguage={articleLanguage} />
            </PageContent>
          </FormAccordion>
          <FormAccordion
            id={"frontpage-article-copyright"}
            title={
              <PanelTitleWithChangeIndicator
                title={t("form.copyrightSection")}
                article={article}
                articleHistory={articleHistory}
                fieldsToIndicatedChangesFor={copyrightFields}
              />
            }
            hasError={!!(errors.creators || errors.rightsholders || errors.processors || errors.license)}
          >
            <CopyrightFieldGroup />
          </FormAccordion>
          <FormAccordion
            id={"frontpage-article-metadata"}
            title={t("form.metadataSection")}
            hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}
          >
            <MetaDataField articleContent={articleText} articleLanguage={articleLanguage} />
          </FormAccordion>
          <FormAccordion
            id={"frontpage-article-revisions"}
            title={t("form.name.revisions")}
            hasError={!!errors.revisionMeta || !!errors.revisionError}
          >
            <RevisionNotes />
          </FormAccordion>
          {!!article && (
            <FormAccordion
              id={"frontpage-article-workflow"}
              title={t("form.workflowSection")}
              hasError={!!errors.notes}
            >
              <VersionAndNotesPanel
                article={article}
                articleHistory={articleHistory}
                type="standard"
                currentLanguage={articleLanguage}
              />
            </FormAccordion>
          )}
        </FormAccordions>
        {!hideComments && !removeComments && <CommentSection />}
      </StyledWrapper>
    </>
  );
};

export default FrontpageArticlePanels;
