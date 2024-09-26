/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { ReactElement, memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import {
  AccordionRoot,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from "@ndla/primitives";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { FormAccordionProps } from "./FormAccordion";
import OpenAllButton from "./OpenAllButton";
import { ARCHIVED, PUBLISHED, STORED_HIDE_COMMENTS, UNPUBLISHED } from "../../constants";
import CommentSection, { COMMENT_WIDTH, SPACING_COMMENT } from "../../containers/ArticlePage/components/CommentSection";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import { useLocalStorageBooleanState } from "../../containers/WelcomePage/hooks/storedFilterHooks";
import QualityEvaluation from "../QualityEvaluation/QualityEvaluation";
import { useWideArticle } from "../WideArticleEditorProvider";

export type ChildType = ReactElement<FormAccordionProps> | undefined | false;

interface Props {
  defaultOpen: string[];
  children: ChildType | ChildType[];
  article?: IArticle;
  taxonomy?: Node[];
  updateNotes?: (art: IUpdatedArticle) => Promise<IArticle>;
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const FlexWrapper = styled.div`
  display: flex;
`;

const RightFlexWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const CommentWrapper = styled.div`
  width: 100%;
  max-width: ${COMMENT_WIDTH}px;
  margin-left: ${SPACING_COMMENT}px;
  display: flex;
  flex-direction: column;
  &[data-hidden="true"] {
    visibility: none;
  }
  &[data-none="true"] {
    display: none;
  }
`;

const StyledSwitchRoot = styled(SwitchRoot)`
  min-height: 40px;
`;

const FormControls = styled.div`
  display: flex;
  width: 100%;
  padding-left: ${spacing.small};
  justify-content: flex-end;
  &[data-enabled-quality-evaluation="true"] {
    justify-content: space-between;
  }
`;

const StyledAccordionRoot = styled(AccordionRoot)`
  width: 100%;
`;

const FormAccordionsWithComments = ({ defaultOpen, children, article, taxonomy, updateNotes }: Props) => {
  const { t } = useTranslation();
  const { toggleWideArticles, isWideArticle } = useWideArticle();
  const [revisionMetaField, , revisionMetaHelpers] = useField<ArticleFormType["revisionMeta"]>("revisionMeta");

  const [openAccordions, setOpenAccordions] = useState<string[]>(defaultOpen);
  const [hideComments, setHideComments] = useLocalStorageBooleanState(STORED_HIDE_COMMENTS);

  const isTopicArticle = article?.articleType === "topic-article";
  const isFrontPageArticle = article?.articleType === "frontpage-article";

  const disableComments = useMemo(
    () => !isTopicArticle && [PUBLISHED, ARCHIVED, UNPUBLISHED].some((s) => s === article?.status.current),
    [article?.status, isTopicArticle],
  );

  // Topics are updated from structure edit page
  const withoutTopics = taxonomy?.filter((n) => n.nodeType !== "TOPIC");

  return (
    <ContentWrapper>
      <FlexWrapper>
        <FormControls data-enabled-quality-evaluation={!isTopicArticle && !isFrontPageArticle}>
          {!isTopicArticle && !isFrontPageArticle && (
            <QualityEvaluation
              articleType={article?.articleType}
              article={article}
              taxonomy={withoutTopics}
              revisionMetaField={revisionMetaField}
              revisionMetaHelpers={revisionMetaHelpers}
              updateNotes={updateNotes}
            />
          )}
          <RightFlexWrapper>
            {!!article?.id && isFrontPageArticle && (
              <StyledSwitchRoot checked={isWideArticle} onCheckedChange={() => toggleWideArticles(article.id)}>
                <SwitchLabel>{t("frontpageArticleForm.isFrontpageArticle.toggleArticle")}</SwitchLabel>
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchHiddenInput />
              </StyledSwitchRoot>
            )}
            <OpenAllButton
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
              formAccordionChildren={children}
            />
          </RightFlexWrapper>
        </FormControls>
        <CommentWrapper>
          {!disableComments && (
            <StyledSwitchRoot checked={!hideComments} onCheckedChange={() => setHideComments(!hideComments)}>
              <SwitchLabel>{t("form.comment.showComments")}</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </StyledSwitchRoot>
          )}
        </CommentWrapper>
      </FlexWrapper>
      <FlexWrapper>
        <StyledAccordionRoot
          multiple
          value={openAccordions}
          onValueChange={(details) => setOpenAccordions(details.value)}
          lazyMount
          unmountOnExit
        >
          {children}
        </StyledAccordionRoot>
        <CommentWrapper
          data-hidden={hideComments || disableComments}
          data-none={isWideArticle && (hideComments || disableComments)}
        >
          {!hideComments && !disableComments && <CommentSection />}
        </CommentWrapper>
      </FlexWrapper>
    </ContentWrapper>
  );
};

export default memo(FormAccordionsWithComments);
