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
import { AccordionRoot } from "@ndla/accordion";
import { fonts, spacing } from "@ndla/core";
import { Switch } from "@ndla/switch";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { FormAccordionProps } from "./FormAccordion";
import OpenAllButton from "./OpenAllButton";
import { ARCHIVED, PUBLISHED, STORED_HIDE_COMMENTS, UNPUBLISHED } from "../../constants";
import CommentSection, { COMMENT_WIDTH, SPACING_COMMENT } from "../../containers/ArticlePage/components/CommentSection";
import { MainContent } from "../../containers/ArticlePage/styles";
import { RevisionMetaFormType } from "../../containers/FormikForm/AddRevisionDateField";
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
    display: none;
  }
`;

const StyledSwitch = styled(Switch)`
  > label {
    font-weight: ${fonts.weight.semibold};
    ${fonts.size.text.button};
  }
  min-height: 40px;
  display: flex;
  justify-content: flex-end;
`;

const FormControls = styled(MainContent)`
  display: flex;
  padding-left: ${spacing.small};
  justify-content: flex-end;
  &[data-enabled-quality-evaluation="true"] {
    justify-content: space-between;
  }
`;

const FormAccordionsWithComments = ({ defaultOpen, children, article, taxonomy, updateNotes }: Props) => {
  const { t } = useTranslation();
  const { toggleWideArticles, isWideArticle } = useWideArticle();
  const [revisionMetaField, , revisionMetaHelpers] = useField<RevisionMetaFormType>("revisionMeta");

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
          {!isTopicArticle && !isFrontPageArticle && !isTopicArticle && (
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
              <StyledSwitch
                id={article.id}
                label={t("frontpageArticleForm.isFrontpageArticle.toggleArticle")}
                checked={isWideArticle}
                onChange={() => toggleWideArticles(article.id)}
              />
            )}
            <OpenAllButton
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
              formAccordionChildren={children}
            />
          </RightFlexWrapper>
        </FormControls>
        {!disableComments && (
          <CommentWrapper>
            <StyledSwitch
              id="hide-comments"
              label={hideComments ? t("form.comment.showComments") : t("form.comment.hideComments")}
              checked={!hideComments}
              onChange={() => setHideComments(!hideComments)}
            />
          </CommentWrapper>
        )}
      </FlexWrapper>
      <FlexWrapper>
        <MainContent data-wide={isWideArticle}>
          <AccordionRoot type="multiple" value={openAccordions} onValueChange={setOpenAccordions}>
            {children}
          </AccordionRoot>
        </MainContent>
        {!disableComments && (
          <CommentWrapper data-hidden={hideComments}>
            <CommentSection />
          </CommentWrapper>
        )}
      </FlexWrapper>
    </ContentWrapper>
  );
};

export default memo(FormAccordionsWithComments);
