/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContent, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleRevisionHistoryDTO, ArticleDTO } from "@ndla/types-backend/draft-api";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../../components/Accordion/FormAccordions";
import config from "../../../../config";
import { STORED_HIDE_COMMENTS, TAXONOMY_WRITE_SCOPE } from "../../../../constants";
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from "../../../FormikForm";
import { TopicArticleFormType } from "../../../FormikForm/articleFormHooks";
import GrepCodesField from "../../../FormikForm/GrepCodesField";
import { onSaveAsVisualElement } from "../../../FormikForm/utils";
import { useSession } from "../../../Session/SessionProvider";
import { useLocalStorageBooleanState } from "../../../WelcomePage/hooks/storedFilterHooks";
import CommentSection from "../../components/CommentSection";
import PanelTitleWithChangeIndicator from "../../components/PanelTitleWithChangeIndicator";
import RelatedContentFieldGroup from "../../components/RelatedContentFieldGroup";
import RevisionNotes from "../../components/RevisionNotes";
import { FlatArticleKeys } from "../../components/types";
import TopicArticleContent from "./TopicArticleContent";
import TopicArticleTaxonomy from "./TopicArticleTaxonomy";

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
  article?: ArticleDTO;
  articleRevisionHistory: ArticleRevisionHistoryDTO | undefined;
  articleLanguage: string;
  hasTaxonomyEntries: boolean;
  articleChanged: boolean;
}

const TopicArticleAccordionPanels = ({
  article,
  articleRevisionHistory,
  articleLanguage,
  hasTaxonomyEntries,
  articleChanged,
}: Props) => {
  const [hideComments, setHideComments] = useLocalStorageBooleanState(STORED_HIDE_COMMENTS);
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const formikContext = useFormikContext<TopicArticleFormType>();
  const contentTitleFields = useMemo<FlatArticleKeys[]>(
    () => ["title.title", "introduction.introduction", "content.content", "visualElement.visualElement"],
    [],
  );
  const copyrightFields = useMemo<FlatArticleKeys[]>(() => ["copyright"], []);

  const { values, errors, isSubmitting } = formikContext;
  return (
    <>
      <StyledControls>
        <SwitchRoot checked={!hideComments} onCheckedChange={() => setHideComments(!hideComments)}>
          <SwitchLabel>{t("form.comment.showComments")}</SwitchLabel>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </SwitchRoot>
      </StyledControls>
      <StyledWrapper showComments={!hideComments}>
        <FormAccordions defaultOpen={["topic-article-content"]}>
          <FormAccordion
            id={"topic-article-content"}
            title={
              <PanelTitleWithChangeIndicator
                title={t("form.contentSection")}
                article={article}
                articleRevisionHistory={articleRevisionHistory}
                fieldsToIndicatedChangesFor={contentTitleFields}
              />
            }
            hasError={!!(errors.title || errors.introduction || errors.content || errors.visualElement)}
          >
            <PageContent variant="content">
              <TopicArticleContent values={values} isSubmitting={isSubmitting} />
            </PageContent>
          </FormAccordion>
          {!!article && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
            <FormAccordion
              id={"topic-article-taxonomy"}
              title={t("form.taxonomySection")}
              hasError={!hasTaxonomyEntries}
            >
              <TopicArticleTaxonomy
                article={article}
                articleLanguage={articleLanguage}
                hasTaxEntries={hasTaxonomyEntries}
              />
            </FormAccordion>
          )}
          <FormAccordion
            id={"topic-article-copyright"}
            title={
              <PanelTitleWithChangeIndicator
                title={t("form.copyrightSection")}
                article={article}
                articleRevisionHistory={articleRevisionHistory}
                fieldsToIndicatedChangesFor={copyrightFields}
              />
            }
            hasError={!!(errors.creators || errors.rightsholders || errors.processors || errors.license)}
          >
            <CopyrightFieldGroup enableLicenseNA />
          </FormAccordion>
          <FormAccordion
            id={"topic-article-metadata"}
            title={t("form.metadataSection")}
            hasError={!!(errors.metaDescription || errors.tags)}
          >
            <MetaDataField
              articleLanguage={articleLanguage}
              showCheckbox={true}
              checkboxAction={(image) => onSaveAsVisualElement(image, formikContext)}
            />
          </FormAccordion>
          <FormAccordion id={"topic-article-grepCodes"} title={t("form.name.grepCodes")} hasError={!!errors.grepCodes}>
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
            id={"topic-article-revisions"}
            title={t("form.name.revisions")}
            hasError={!!errors.revisionMeta || !!errors.revisionError}
          >
            <RevisionNotes />
          </FormAccordion>
          {!!article && (
            <FormAccordion id={"topic-article-workflow"} title={t("form.workflowSection")} hasError={!!errors.notes}>
              <VersionAndNotesPanel
                article={article}
                articleRevisionHistory={articleRevisionHistory}
                type="topic-article"
                currentLanguage={values.language}
                articleChanged={articleChanged}
              />
            </FormAccordion>
          )}
        </FormAccordions>
        {!hideComments && <CommentSection />}
      </StyledWrapper>
    </>
  );
};

export default TopicArticleAccordionPanels;
