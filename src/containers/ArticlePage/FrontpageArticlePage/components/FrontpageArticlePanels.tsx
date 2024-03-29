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
import { IArticle } from "@ndla/types-backend/draft-api";
import FrontpageArticleFormContent from "./FrontpageArticleFormContent";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../../components/Accordion/FormAccordions";
import { useWideArticle } from "../../../../components/WideArticleEditorProvider";
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from "../../../FormikForm";
import { FrontpageArticleFormType } from "../../../FormikForm/articleFormHooks";
import PanelTitleWithChangeIndicator from "../../components/PanelTitleWithChangeIndicator";
import RevisionNotes from "../../components/RevisionNotes";

interface Props {
  article?: IArticle;
  articleHistory: IArticle[] | undefined;
  articleLanguage: string;
}

const FrontpageArticlePanels = ({ article, articleHistory, articleLanguage }: Props) => {
  const { t } = useTranslation();
  const { errors } = useFormikContext<FrontpageArticleFormType>();
  const { isWideArticle } = useWideArticle();

  const contentTitleFields = useMemo<(keyof IArticle)[]>(() => ["title", "introduction", "content"], []);
  const copyrightFields = useMemo<(keyof IArticle)[]>(() => ["copyright"], []);

  return (
    <FormAccordions
      defaultOpen={["frontpage-article-content"]}
      articleId={article?.id}
      articleType={article?.articleType}
    >
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
        className="u-10/12 u-push-1/12"
        hasError={!!(errors.title || errors.introduction || errors.content)}
        wide={isWideArticle}
        isFrontpageArticle={article?.articleType === "frontpage-article"}
      >
        <FrontpageArticleFormContent articleLanguage={articleLanguage} />
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
        className={"u-6/6"}
        hasError={!!(errors.creators || errors.rightsholders || errors.processors || errors.license)}
      >
        <CopyrightFieldGroup />
      </FormAccordion>
      <FormAccordion
        id={"frontpage-article-metadata"}
        title={t("form.metadataSection")}
        className={"u-6/6"}
        hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}
      >
        <MetaDataField articleLanguage={articleLanguage} />
      </FormAccordion>
      <FormAccordion
        id={"frontpage-article-revisions"}
        title={t("form.name.revisions")}
        className={"u-6/6"}
        hasError={!!errors.revisionMeta || !!errors.revisionError}
      >
        <RevisionNotes />
      </FormAccordion>
      {article && (
        <FormAccordion
          id={"frontpage-article-workflow"}
          title={t("form.workflowSection")}
          className={"u-6/6"}
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
  );
};

export default FrontpageArticlePanels;
