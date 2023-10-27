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
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from '@ndla/typography';
import { IArticleSummaryV2 } from '@ndla/types-backend/article-api';
import { useFormikContext } from 'formik';
import AsyncDropdown from '../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { searchArticles } from '../../modules/article/articleApi';
import { extractArticleIds } from './frontpageHelpers';
import { MenuWithArticle } from './types';

interface Props {
  articleId?: number;
  children?: ReactNode;
  onChange: (article: IArticleSummaryV2) => void;
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
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const changeSize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', changeSize);

    return () => {
      window.removeEventListener('resize', changeSize);
    };
  }, [window.innerHeight]);

  const selectedValues = useMemo(() => {
    const articleIds = extractArticleIds(values);
    return articleIds.map((id) => ({ id }));
  }, [values]);

  const onSearch = useCallback((query: string, page?: number) => {
    return searchArticles({ articleTypes: ['frontpage-article'], page, query });
  }, []);

  return (
    <Root>
      <Trigger asChild>{children}</Trigger>
      <PopoverPortal>
        <PopoverContent>
          <Heading element="h1" headingStyle="h3" margin="none">
            {articleId ? t('frontpageForm.changeArticle') : t('frontpageForm.addArticle')}
          </Heading>
          <AsyncDropdown<IArticleSummaryV2>
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
            menuHeight={windowHeight * 0.3}
          />
        </PopoverContent>
      </PopoverPortal>
    </Root>
  );
};

export default FrontpageArticleSearch;
