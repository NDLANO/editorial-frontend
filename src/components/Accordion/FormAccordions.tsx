/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Children, ReactElement, memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { AccordionRoot } from '@ndla/accordion';
import { ButtonV2 } from '@ndla/button';
import { fonts, spacing } from '@ndla/core';
import { Switch } from '@ndla/switch';
import { FormAccordionProps } from './FormAccordion';
import { useFrontpageArticle } from '../FrontpageArticleProvider';

type ChildType = ReactElement<FormAccordionProps> | undefined | false;

interface Props {
  defaultOpen: string[];
  children: ChildType | ChildType[];
  articleId?: number;
  articleType?: string;
}

const AccordionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const OpenAllButton = styled(ButtonV2)`
  align-self: flex-end;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  vertical-align: center;
`;

const StyledSwitch = styled(Switch)`
  > label {
    font-weight: ${fonts.weight.semibold};
    ${fonts.sizes('16px')};
  }
  padding-right: ${spacing.small};
`;

const FormAccordions = ({ defaultOpen, children, articleId, articleType }: Props) => {
  const { t } = useTranslation();
  const [openAccordions, setOpenAccordions] = useState<string[]>(defaultOpen);
  const { toggleFrontpageArticle, isFrontpageArticle } = useFrontpageArticle();
  const accordionChildren = useMemo(
    () => Children.map(children, (c) => (!c ? false : c?.props?.id))?.filter(Boolean) ?? [],
    [children],
  );
  const allOpen = useMemo(
    () => accordionChildren.length === openAccordions.length,
    [accordionChildren, openAccordions.length],
  );

  const onChangeAll = useCallback(() => {
    if (allOpen) {
      setOpenAccordions([]);
    } else {
      setOpenAccordions(accordionChildren);
    }
  }, [allOpen, accordionChildren]);

  return (
    <AccordionsWrapper>
      <FlexWrapper>
        {!!articleId && articleType === 'frontpage-article' && (
          <StyledSwitch
            id={articleId}
            label={t('frontpageArticleForm.isFrontpageArticle.toggleArticle')}
            checked={isFrontpageArticle}
            onChange={() => toggleFrontpageArticle(articleId!)}
          />
        )}
        <OpenAllButton onClick={onChangeAll} variant="ghost">
          {allOpen ? t('accordion.closeAll') : t('accordion.openAll')}
        </OpenAllButton>
      </FlexWrapper>
      <AccordionRoot type="multiple" value={openAccordions} onValueChange={setOpenAccordions}>
        {children}
      </AccordionRoot>
    </AccordionsWrapper>
  );
};

export default memo(FormAccordions);
