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
import { PageContent } from "@ndla/primitives";
import { IArticle } from "@ndla/types-backend/draft-api";
import FrontpageArticleFormContent from "./FrontpageArticleFormContent";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordionsWithComments from "../../../../components/Accordion/FormAccordionsWithComments";
import { useWideArticle } from "../../../../components/WideArticleEditorProvider";
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from "../../../FormikForm";
import { FrontpageArticleFormType } from "../../../FormikForm/articleFormHooks";
import PanelTitleWithChangeIndicator from "../../components/PanelTitleWithChangeIndicator";
import RevisionNotes from "../../components/RevisionNotes";
import { FlatArticleKeys } from "../../components/types";

interface Props {
  article?: IArticle;
  articleHistory: IArticle[] | undefined;
  articleLanguage: string;
}

const FrontpageArticlePanels = ({ article, articleHistory, articleLanguage }: Props) => {
  const { t } = useTranslation();
  const { errors } = useFormikContext<FrontpageArticleFormType>();
  const { isWideArticle } = useWideArticle();

  const contentTitleFields = useMemo<FlatArticleKeys[]>(
    () => ["title.title", "introduction.introduction", "content.content"],
    [],
  );
  const copyrightFields = useMemo<FlatArticleKeys[]>(() => ["copyright"], []);

  return (
    <FormAccordionsWithComments defaultOpen={["frontpage-article-content"]} article={article}>
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
        <PageContent variant={isWideArticle ? "wide" : "content"}>
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
        <MetaDataField articleLanguage={articleLanguage} />
      </FormAccordion>
      <FormAccordion
        id={"frontpage-article-revisions"}
        title={t("form.name.revisions")}
        hasError={!!errors.revisionMeta || !!errors.revisionError}
      >
        <RevisionNotes />
      </FormAccordion>
      {article && (
        <FormAccordion id={"frontpage-article-workflow"} title={t("form.workflowSection")} hasError={!!errors.notes}>
          <VersionAndNotesPanel
            article={article}
            articleHistory={articleHistory}
            type="standard"
            currentLanguage={articleLanguage}
          />
        </FormAccordion>
      )}
    </FormAccordionsWithComments>
  );
};

export default FrontpageArticlePanels;
