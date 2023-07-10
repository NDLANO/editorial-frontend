/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, colors } from '@ndla/core';
import { Switch } from '@ndla/switch';
import { useTranslation } from 'react-i18next';
import { useFrontpageArticle } from '../../components/FrontpageArticleProvider';

const StyledSwitch = styled(Switch)`
  > label {
    ${fonts.sizes('16px', '20px')};
    font-weight: ${fonts.weight.semibold};
    color: ${colors.text.primary};
  }
`;

const StyledLabel = styled.label`
  font-size: 1.5rem;
`;

const StyledParagraph = styled.p`
  margin: 0.2em 0;
  font-size: 0.75em;
`;

const SwitchContentWrapper = styled.div`
  margin-top: 2rem;
`;

interface Props {
  articleId: number;
}

const FrontpageArticleSwitch = ({ articleId }: Props) => {
  const { isFrontpageArticle, toggleFrontpageArticle } = useFrontpageArticle();
  const { t } = useTranslation();
  return (
    <SwitchContentWrapper>
      <StyledLabel>{t('frontpageArticleForm.title')}</StyledLabel>
      <StyledParagraph>{t('frontpageArticleForm.isFrontpageArticle.description')}</StyledParagraph>
      <StyledSwitch
        id={articleId}
        label={t('frontpageArticleForm.title')}
        checked={isFrontpageArticle}
        onChange={() => toggleFrontpageArticle(articleId!)}
      />
    </SwitchContentWrapper>
  );
};

export default FrontpageArticleSwitch;
