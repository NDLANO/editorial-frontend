/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, colors } from '@ndla/core';
import { Switch } from '@ndla/switch';
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
  return (
    <FormikField
      name="frontpageArticle"
      label="Forside artikkel"
      description="Her styrer du om artikkelen som skal vises er forside artikkel"
    >
      {() => (
        <StyledSwitch
          id={1}
          label={'Forside artikkel'}
          checked={isFrontpageArticle}
          onChange={() => toggleFrontpageArticle(articleId!)}
        />
      )}
    </FormikField>
  );
};

export default FrontpageArticleSwitch;
