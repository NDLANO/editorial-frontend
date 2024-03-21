/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IUpdatedArticle, IArticle } from "@ndla/types-backend/draft-api";
import { Node, TaxonomyContext } from "@ndla/types-taxonomy";
import LearningResourceContent from "./LearningResourceContent";
import LearningResourceTaxonomy from "./LearningResourceTaxonomy";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../../components/Accordion/FormAccordions";
import { IsNewArticleLanguageProvider } from "../../../../components/SlateEditor/IsNewArticleLanguageProvider";
import config from "../../../../config";
import { TAXONOMY_WRITE_SCOPE } from "../../../../constants";
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from "../../../FormikForm";
import { HandleSubmitFunc, LearningResourceFormType } from "../../../FormikForm/articleFormHooks";
import GrepCodesField from "../../../FormikForm/GrepCodesField";
import { useSession } from "../../../Session/SessionProvider";
import PanelTitleWithChangeIndicator from "../../components/PanelTitleWithChangeIndicator";
import RelatedContentFieldGroup from "../../components/RelatedContentFieldGroup";
import RevisionNotes from "../../components/RevisionNotes";

interface Props {
  article?: IArticle;
  articleHistory: IArticle[] | undefined;
  taxonomy?: Node[];
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
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
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { errors } = useFormikContext<LearningResourceFormType>();
  const defaultOpen = useMemo(() => ["learning-resource-content"], []);

  const contentTitleFields = useMemo<(keyof IArticle)[]>(() => ["title", "introduction", "content"], []);
  const copyrightFields = useMemo<(keyof IArticle)[]>(() => ["copyright"], []);

  return (
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
        className="u-10/12 u-push-1/12"
        hasError={!!(errors.title || errors.introduction || errors.content)}
      >
        <IsNewArticleLanguageProvider locale={articleLanguage} article={article}>
          <LearningResourceContent
            articleLanguage={articleLanguage}
            articleId={article?.id}
            handleSubmit={handleSubmit}
          />
        </IsNewArticleLanguageProvider>
      </FormAccordion>
      {!!article && !!taxonomy && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
        <FormAccordion
          id={"learning-resource-taxonomy"}
          title={t("form.taxonomySection")}
          className={"u-6/6"}
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
        className={"u-6/6"}
        hasError={!!(errors.creators || errors.rightsholders || errors.processors || errors.license)}
      >
        <CopyrightFieldGroup />
      </FormAccordion>
      <FormAccordion
        id={"learning-resource-metadata"}
        title={t("form.metadataSection")}
        className={"u-6/6"}
        hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}
      >
        <MetaDataField articleLanguage={articleLanguage} />
      </FormAccordion>
      <FormAccordion
        id={"learning-resource-grepCodes"}
        title={t("form.name.grepCodes")}
        className={"u-6/6"}
        hasError={!!errors.grepCodes}
      >
        <GrepCodesField />
      </FormAccordion>
      {config.ndlaEnvironment === "test" && (
        <FormAccordion
          id={"learning-resource-related"}
          title={t("form.name.relatedContent")}
          className={"u-6/6"}
          hasError={!!(errors.conceptIds || errors.relatedContent)}
        >
          <RelatedContentFieldGroup />
        </FormAccordion>
      )}
      <FormAccordion
        id={"learning-resource-revisions"}
        title={t("form.name.revisions")}
        className={"u-6/6"}
        hasError={!!errors.revisionMeta || !!errors.revisionError}
      >
        <RevisionNotes />
      </FormAccordion>
      {article && (
        <FormAccordion
          id={"learning-resource-workflow"}
          title={t("form.workflowSection")}
          className={"u-6/6"}
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
  );
};

export default memo(LearningResourcePanels);
