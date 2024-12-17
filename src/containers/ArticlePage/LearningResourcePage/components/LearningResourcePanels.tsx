/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageContent, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUpdatedArticleDTO, IArticleDTO } from "@ndla/types-backend/draft-api";
import { Node, TaxonomyContext } from "@ndla/types-taxonomy";
import LearningResourceContent from "./LearningResourceContent";
import LearningResourceTaxonomy from "./LearningResourceTaxonomy";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../../components/Accordion/FormAccordions";
import { getTextFromHTML } from "../../../../components/LLM/helpers";
import QualityEvaluation from "../../../../components/QualityEvaluation/QualityEvaluation";
import { IsNewArticleLanguageProvider } from "../../../../components/SlateEditor/IsNewArticleLanguageProvider";
import config from "../../../../config";
import { STORED_HIDE_COMMENTS, TAXONOMY_WRITE_SCOPE } from "../../../../constants";
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from "../../../FormikForm";
import { ArticleFormType, HandleSubmitFunc, LearningResourceFormType } from "../../../FormikForm/articleFormHooks";
import GrepCodesField from "../../../FormikForm/GrepCodesField";
import { useSession } from "../../../Session/SessionProvider";
import { useLocalStorageBooleanState } from "../../../WelcomePage/hooks/storedFilterHooks";
import CommentSection, { RESET_COMMENTS_STATUSES } from "../../components/CommentSection";
import PanelTitleWithChangeIndicator from "../../components/PanelTitleWithChangeIndicator";
import RelatedContentFieldGroup from "../../components/RelatedContentFieldGroup";
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
    justifyContent: "space-between",
  },
});

interface Props {
  article?: IArticleDTO;
  articleHistory: IArticleDTO[] | undefined;
  taxonomy?: Node[];
  updateNotes: (art: IUpdatedArticleDTO) => Promise<IArticleDTO>;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
  articleLanguage: string;
  contexts?: TaxonomyContext[];
}

const LearningResourcePanels = ({
  article,
  articleHistory,
  taxonomy,
  updateNotes,
  articleLanguage,
  contexts,
  handleSubmit,
}: Props) => {
  const [hideComments, setHideComments] = useLocalStorageBooleanState(STORED_HIDE_COMMENTS);
  const [revisionMetaField, , revisionMetaHelpers] = useField<ArticleFormType["revisionMeta"]>("revisionMeta");
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { errors } = useFormikContext<LearningResourceFormType>();
  const defaultOpen = useMemo(() => ["learning-resource-content"], []);

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
        <QualityEvaluation
          articleType={article?.articleType}
          article={article}
          taxonomy={taxonomy?.filter((n) => n.nodeType !== "TOPIC")}
          revisionMetaField={revisionMetaField}
          revisionMetaHelpers={revisionMetaHelpers}
          updateNotes={updateNotes}
        />
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
        <FormAccordions defaultOpen={defaultOpen}>
          <FormAccordion
            id={"learning-resource-content"}
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
            <IsNewArticleLanguageProvider locale={articleLanguage} article={article}>
              <PageContent variant="content">
                <LearningResourceContent
                  articleContent={articleText}
                  articleLanguage={articleLanguage}
                  articleId={article?.id}
                  handleSubmit={handleSubmit}
                />
              </PageContent>
            </IsNewArticleLanguageProvider>
          </FormAccordion>
          {!!article && !!taxonomy && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
            <FormAccordion
              id={"learning-resource-taxonomy"}
              title={t("form.taxonomySection")}
              hasError={!contexts?.length}
            >
              <LearningResourceTaxonomy
                article={article}
                updateNotes={updateNotes}
                articleLanguage={articleLanguage}
                hasTaxEntries={!!contexts?.length}
              />
            </FormAccordion>
          )}
          <FormAccordion
            id={"learning-resource-copyright"}
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
            id={"learning-resource-metadata"}
            title={t("form.metadataSection")}
            hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}
          >
            <MetaDataField articleContent={articleText} articleLanguage={articleLanguage} />
          </FormAccordion>
          <FormAccordion
            id={"learning-resource-grepCodes"}
            title={t("form.name.grepCodes")}
            hasError={!!errors.grepCodes}
          >
            <GrepCodesField prefixFilter={["KE", "KM", "TT"]} />
          </FormAccordion>
          {config.ndlaEnvironment === "test" && (
            <FormAccordion
              id={"learning-resource-related"}
              title={t("form.name.relatedContent")}
              hasError={!!(errors.conceptIds || errors.relatedContent)}
            >
              <RelatedContentFieldGroup />
            </FormAccordion>
          )}
          <FormAccordion
            id={"learning-resource-revisions"}
            title={t("form.name.revisions")}
            hasError={!!errors.revisionMeta || !!errors.revisionError}
          >
            <RevisionNotes />
          </FormAccordion>
          {!!article && (
            <FormAccordion
              id={"learning-resource-workflow"}
              title={t("form.workflowSection")}
              hasError={!!errors.notes}
              data-testid={"learning-resource-workflow"}
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

export default memo(LearningResourcePanels);
