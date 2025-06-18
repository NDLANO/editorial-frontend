/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { memo, useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { SwitchCheckedChangeDetails } from "@ark-ui/react";
import { inlineNavigationPlugin } from "@ndla/editor";
import { PageContent, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IUpdatedArticleDTO, IArticleDTO } from "@ndla/types-backend/draft-api";
import { Node, TaxonomyContext } from "@ndla/types-taxonomy";
import LearningResourceContent from "./LearningResourceContent";
import LearningResourceTaxonomy from "./LearningResourceTaxonomy";
import FormAccordion from "../../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../../components/Accordion/FormAccordions";
import QualityEvaluation from "../../../../components/QualityEvaluation/QualityEvaluation";
import { SlatePlugin } from "../../../../components/SlateEditor/interfaces";
import { IsNewArticleLanguageProvider } from "../../../../components/SlateEditor/IsNewArticleLanguageProvider";
import { breakPlugin } from "../../../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../../../components/SlateEditor/plugins/break/render";
import { contentLinkPlugin, linkPlugin } from "../../../../components/SlateEditor/plugins/link";
import { linkRenderer } from "../../../../components/SlateEditor/plugins/link/render";
import { markPlugin } from "../../../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../../../components/SlateEditor/plugins/paragraph/render";
import { pastePlugin } from "../../../../components/SlateEditor/plugins/paste";
import saveHotkeyPlugin from "../../../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../../components/SlateEditor/plugins/toolbar";
import { createToolbarDefaultValues } from "../../../../components/SlateEditor/plugins/toolbar/toolbarState";
import { unsupportedElementRenderer } from "../../../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import {
  DISCLAIMER_TEMPLATES_URL,
  DisclaimerField,
} from "../../../../components/SlateEditor/plugins/uuDisclaimer/DisclaimerField";
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

const toolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  block: { hidden: true },
  inline: {
    hidden: true,
    "content-link": { hidden: false },
  },
});

export const disclaimerPlugins: SlatePlugin[] = [
  inlineNavigationPlugin,
  spanPlugin,
  paragraphPlugin,
  toolbarPlugin.configure({ options: { options: toolbarOptions } }),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin.configure({
    options: {
      supportedMarks: { value: ["bold", "italic", "sub", "sup"], override: true },
    },
  }),
  noopPlugin,
  linkPlugin,
  contentLinkPlugin,
  unsupportedPlugin,
  pastePlugin,
];

const renderers: SlatePlugin[] = [
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  spanRenderer,
  linkRenderer,
  unsupportedElementRenderer,
];

const plugins = disclaimerPlugins.concat(renderers);

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
  submitted: boolean;
}

const LearningResourcePanels = ({
  article,
  articleHistory,
  taxonomy,
  updateNotes,
  articleLanguage,
  contexts,
  handleSubmit,
  submitted,
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

  const onCheckedChange = useCallback(
    (details: SwitchCheckedChangeDetails) => {
      setHideComments(!details.checked);
    },
    [setHideComments],
  );

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
          <SwitchRoot checked={!hideComments} onCheckedChange={onCheckedChange}>
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
            <MetaDataField articleLanguage={articleLanguage} />
          </FormAccordion>
          <FormAccordion
            id={"learning-resource-grepCodes"}
            title={t("form.name.grepCodes")}
            hasError={!!errors.grepCodes}
          >
            <GrepCodesField prefixFilter={["KE", "KM", "TT"]} />
          </FormAccordion>
          <FormAccordion
            id="learning-resource-disclaimer"
            title={t("form.name.disclaimer")}
            hasError={!!errors.disclaimer}
          >
            <DisclaimerField
              submitted={submitted}
              title={t("form.articleDisclaimer.title")}
              description={
                <Trans i18nKey={"form.articleDisclaimer.description"}>
                  <SafeLink to={DISCLAIMER_TEMPLATES_URL} target="_blank" />
                </Trans>
              }
              plugins={plugins}
            />
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
