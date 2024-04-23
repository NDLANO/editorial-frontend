/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { AccordionRoot } from "@ndla/accordion";
import { fonts, spacing } from "@ndla/core";
import { Switch } from "@ndla/switch";
import { IStatus } from "@ndla/types-backend/concept-api";
import { FormAccordionProps } from "./FormAccordion";
import OpenAllButton from "./OpenAllButton";
import { ARCHIVED, PUBLISHED, STORED_HIDE_COMMENTS, UNPUBLISHED } from "../../constants";
import CommentSection, { COMMENT_WIDTH, SPACING_COMMENT } from "../../containers/ArticlePage/components/CommentSection";
import { MainContent } from "../../containers/ArticlePage/styles";
import { useLocalStorageBooleanState } from "../../containers/WelcomePage/hooks/storedFilterHooks";
import { useWideArticle } from "../WideArticleEditorProvider";

export type ChildType = ReactElement<FormAccordionProps> | undefined | false;

interface Props {
  defaultOpen: string[];
  children: ChildType | ChildType[];
  articleId?: number;
  articleType?: string;
  articleStatus?: IStatus;
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const FlexWrapper = styled.div`
  display: flex;
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
    font-size: ${fonts.size.text.button};
  }
  min-height: 40px;
  display: flex;
  justify-content: flex-end;
`;

const FormControls = styled(MainContent)`
  display: flex;
  justify-content: flex-end;
`;

const FormAccordionsWithComments = ({ defaultOpen, children, articleId, articleType, articleStatus }: Props) => {
  const { t } = useTranslation();
  const { toggleWideArticles, isWideArticle } = useWideArticle();

  const [openAccordions, setOpenAccordions] = useState<string[]>(defaultOpen);
  const [hideComments, setHideComments] = useLocalStorageBooleanState(STORED_HIDE_COMMENTS);

  const disableComments = useMemo(
    () =>
      articleType !== "topic-article" && [PUBLISHED, ARCHIVED, UNPUBLISHED].some((s) => s === articleStatus?.current),
    [articleStatus, articleType],
  );

  return (
    <ContentWrapper>
      <FlexWrapper>
        <FormControls data-wide={isWideArticle}>
          {!!articleId && articleType === "frontpage-article" && (
            <StyledSwitch
              id={articleId}
              label={t("frontpageArticleForm.isFrontpageArticle.toggleArticle")}
              checked={isWideArticle}
              onChange={() => toggleWideArticles(articleId)}
            />
          )}
          <OpenAllButton openAccordions={openAccordions} setOpenAccordions={setOpenAccordions} childs={children} />
        </FormControls>
        {!disableComments && (
          <CommentWrapper>
            <StyledSwitch
              id="hide-comments"
              label={t("form.comment.hideComments")}
              checked={hideComments}
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
