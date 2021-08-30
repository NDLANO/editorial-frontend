/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Spinner } from '@ndla/editor';
import Downshift from 'downshift';
import Fuse from 'fuse.js';
import { Search } from '@ndla/icons/lib/common';
import { DropdownMenu, Input } from '@ndla/forms';
import handleError from '../../../../util/handleError';
import { itemToString } from '../../../../util/downShiftHelpers';
import RoundIcon from '../../../../components/RoundIcon';
import { StyledErrorMessage } from '../styles';
import { Topic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

const menuItemStyle = css`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

const dropdownInputStyle = css`
  margin-right: 6.5px;
  max-height: 26px;
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 90%;
`;

const PAGE_SIZE = 10;

interface Props {
  icon: React.ReactNode;
  onSubmit: (selected: Topic & { description?: string }) => Promise<void>;
  onClose: () => void;
  searchResult: (Topic & { description?: string })[];
  placeholder: string;
  filter?: string;
  smallIcon?: boolean;
  showPagination?: boolean;
}

type StatusType = 'initial' | 'loading' | 'success' | 'error';

const MenuItemDropdown = ({
  searchResult,
  filter,
  onSubmit,
  onClose,
  placeholder,
  smallIcon,
  icon,
  showPagination,
}: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<StatusType>('initial');
  const [page, setPage] = useState(1);

  const handlePageChange = (page: { page: number }) => setPage(page.page);

  const getResultItems = () => {
    const options = {
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 0,
      tokenize: true,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name'],
    };

    return new Fuse(
      filter ? searchResult.filter(it => it.path && !it.path.includes(filter)) : searchResult,
      options,
    );
  };

  const handleSubmit = async (selected: Topic & { description: string }) => {
    if (selected) {
      setStatus('loading');
      try {
        await onSubmit(selected);
        onClose();
        setStatus('success');
      } catch (error) {
        handleError(error);
        setStatus('error');
      }
    }
  };

  const allItems = getResultItems();
  return (
    <>
      <div css={menuItemStyle}>
        <RoundIcon open small smallIcon={smallIcon} icon={icon} />
        <Downshift itemToString={item => itemToString(item, 'name')} onChange={handleSubmit}>
          {({ getInputProps, getRootProps, ...downshiftProps }) => {
            const items = allItems ? allItems.search(downshiftProps.inputValue!) : [];
            return (
              <DropdownWrapper {...getRootProps()}>
                <Input
                  {...getInputProps({ placeholder })}
                  data-testid="inlineDropdownInput"
                  white
                  css={dropdownInputStyle}
                  iconRight={
                    status === 'loading' ? <Spinner size="normal" margin="0" /> : <Search />
                  }
                />
                <DropdownMenu
                  items={items.slice((page - 1) * PAGE_SIZE)}
                  idField="id"
                  labelField="name"
                  {...downshiftProps}
                  positionAbsolute
                  maxRender={PAGE_SIZE}
                  totalCount={items.length}
                  page={showPagination && page}
                  handlePageChange={handlePageChange}
                  wide={showPagination}
                />
              </DropdownWrapper>
            );
          }}
        </Downshift>
      </div>
      {status === 'error' && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">
          {t('taxonomy.errorMessage')}
        </StyledErrorMessage>
      )}
    </>
  );
};

export default memo(MenuItemDropdown);
