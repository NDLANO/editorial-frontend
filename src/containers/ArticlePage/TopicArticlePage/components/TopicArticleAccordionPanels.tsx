/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageContent } from "@ndla/primitives";
import { IUpdatedArticle, IArticle } from "@ndla/types-backend/draft-api";
import TopicArticleContent from "./TopicArticleContent";
import TopicArticleTaxonomy from "./TopicArticleTaxonomy";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordionsWithComments from "../../../../components/Accordion/FormAccordionsWithComments";
import config from "../../../../config";
import { TAXONOMY_WRITE_SCOPE } from "../../../../constants";
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from "../../../FormikForm";
import { TopicArticleFormType } from "../../../FormikForm/articleFormHooks";
import GrepCodesField from "../../../FormikForm/GrepCodesField";
import { onSaveAsVisualElement } from "../../../FormikForm/utils";
import { useSession } from "../../../Session/SessionProvider";
import PanelTitleWithChangeIndicator from "../../components/PanelTitleWithChangeIndicator";
import RelatedContentFieldGroup from "../../components/RelatedContentFieldGroup";
import RevisionNotes from "../../components/RevisionNotes";
import { FlatArticleKeys } from "../../components/types";

interface Props {
  article?: IArticle;
  articleHistory: IArticle[] | undefined;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
  hasTaxonomyEntries: boolean;
}

const TopicArticleAccordionPanels = ({
  article,
  articleHistory,
  updateNotes,
  articleLanguage,
  hasTaxonomyEntries,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const formikContext = useFormikContext<TopicArticleFormType>();
  const contentTitleFields = useMemo<FlatArticleKeys[]>(
    () => ["title.title", "introduction.introduction", "content.content", "visualElement.visualElement"],
    [],
  );
  const copyrightFields = useMemo<FlatArticleKeys[]>(() => ["copyright"], []);

  const { values, errors } = formikContext;
  return (
    <FormAccordionsWithComments defaultOpen={["topic-article-content"]} article={article}>
      <FormAccordion
        id={"topic-article-content"}
        title={
          <PanelTitleWithChangeIndicator
            title={t("form.contentSection")}
            article={article}
            articleHistory={articleHistory}
            fieldsToIndicatedChangesFor={contentTitleFields}
          />
        }
        hasError={!!(errors.title || errors.introduction || errors.content || errors.visualElement)}
      >
        <PageContent variant="content">
          <TopicArticleContent values={values} />
        </PageContent>
      </FormAccordion>
      {article && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
        <FormAccordion id={"topic-article-taxonomy"} title={t("form.taxonomySection")} hasError={!hasTaxonomyEntries}>
          <TopicArticleTaxonomy
            article={article}
            updateNotes={updateNotes}
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
            articleHistory={articleHistory}
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
        <GrepCodesField />
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
      {article && (
        <FormAccordion id={"topic-article-workflow"} title={t("form.workflowSection")} hasError={!!errors.notes}>
          <VersionAndNotesPanel
            article={article}
            articleHistory={articleHistory}
            type="topic-article"
            currentLanguage={values.language}
          />
        </FormAccordion>
      )}
    </FormAccordionsWithComments>
  );
};

export default TopicArticleAccordionPanels;
