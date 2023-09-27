/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Content, Portal as PopoverPortal, Root, Trigger } from '@radix-ui/react-popover';
import { spacing, misc, colors } from '@ndla/core';
import { ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from '@ndla/ui';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import { useFormikContext } from 'formik';
import AsyncDropdown from '../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { searchResources } from '../../modules/search/searchApi';
import { extractArticleIds } from './frontpageHelpers';
import { MenuWithArticle } from './types';

interface Props {
  articleId?: number;
  children?: ReactNode;
  onChange: (article: IMultiSearchSummary) => void;
}

const PopoverContent = styled(Content)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  border-radius: ${misc.borderRadius};
  border: 1px solid ${colors.brand.primary};
  background: ${colors.white};
  z-index: 100;
  color: ${colors.text.primary};
  padding: ${spacing.small};
`;

const FrontpageArticleSearch = ({ articleId, children, onChange }: Props) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<MenuWithArticle>();

  const selectedValues = useMemo(() => {
    const articleIds = extractArticleIds(values);
    return articleIds.map((id) => ({ id }));
  }, [values]);

  const onSearch = useCallback((query: string, page?: number) => {
    return searchResources({ 'article-types': 'frontpage-article', page, query });
  }, []);

  return (
    <Root>
      <Trigger asChild>{children}</Trigger>
      <PopoverPortal>
        <PopoverContent>
          <Heading element="h1" headingStyle="h3" margin="none">
            {articleId ? t('frontpageForm.changeArticle') : t('frontpageForm.addArticle')}
          </Heading>
          <AsyncDropdown<IMultiSearchSummary>
            idField="id"
            labelField="title"
            placeholder={t('frontpageForm.search')}
            apiAction={onSearch}
            selectedItems={selectedValues}
            disableSelected
            onChange={onChange}
            positionAbsolute
            multiSelect
            startOpen
            showPagination
            initialSearch={true}
          />
        </PopoverContent>
      </PopoverPortal>
    </Root>
  );
};

export default FrontpageArticleSearch;
