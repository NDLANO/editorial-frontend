/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Children, ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { AccordionRoot } from '@ndla/accordion';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { FormAccordionProps } from './FormAccordion';

type ChildType = ReactElement<FormAccordionProps> | undefined | false;

interface Props {
  defaultOpen: string[];
  children: ChildType | ChildType[];
}

const AccordionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const OpenAllButton = styled(ButtonV2)`
  align-self: flex-end;
`;

const FormAccordions = ({ defaultOpen, children }: Props) => {
  const { t } = useTranslation();
  const [openAccordions, setOpenAccordions] = useState<string[]>(defaultOpen);
  const allOpen = useMemo(() => {
    const allOpen = Children.map(children, (child) => (!child ? false : child?.props?.id))?.filter(
      Boolean,
    );
    return allOpen?.length === openAccordions.length;
  }, [children, openAccordions.length]);

  const onChangeAll = useCallback(() => {
    if (allOpen) {
      setOpenAccordions([]);
    } else {
      setOpenAccordions(
        Children.map(children, (child) => (!child ? false : child?.props?.id))?.filter(Boolean) ??
          [],
      );
    }
  }, [allOpen, children]);

  return (
    <AccordionsWrapper>
      <OpenAllButton onClick={onChangeAll} variant="ghost">
        {allOpen ? t('accordion.closeAll') : t('accordion.openAll')}
      </OpenAllButton>
      <AccordionRoot type="multiple" value={openAccordions} onValueChange={setOpenAccordions}>
        {children}
      </AccordionRoot>
    </AccordionsWrapper>
  );
};

export default FormAccordions;
