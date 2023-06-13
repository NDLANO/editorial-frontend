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
import FormikField from '../../components/FormikField';
import { useFrontpageArticle } from '../ArticlePage/FrontpageArticlePage/components/FrontpageArticleProvider';

const StyledSwitch = styled(Switch)`
  > label {
    ${fonts.sizes('16px', '20px')};
    font-weight: ${fonts.weight.semibold};
    color: ${colors.text.primary};
  }
`;

interface Props {
  articleId: number;
}

const FrontpageArticleSwitch = ({ articleId }: Props) => {
  const { isFrontpageArticle, toggleFrontpageArticle } = useFrontpageArticle();
  const { t } = useTranslation();
  return (
    <FormikField
      name="frontpageArticle"
      label={t('frontpageArticleForm.title')}
      description={t('frontpageArticleForm.isFrontpageArticle.description')}
    >
      {() => (
        <StyledSwitch
          id={articleId}
          label={t('frontpageArticleForm.title')}
          checked={isFrontpageArticle}
          onChange={() => toggleFrontpageArticle(articleId!)}
        />
      )}
    </FormikField>
  );
};

export default FrontpageArticleSwitch;
