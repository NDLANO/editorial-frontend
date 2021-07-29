/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
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

interface Props {
  icon: React.ReactNode;
  onSubmit: (selected: Topic & { description?: string }[]) => Promise<void>;
  onClose: () => void;
  searchResult: (Topic & { description?: string })[];
  placeholder: string;
  filter?: string;
  smallIcon?: boolean;
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
  t,
}: Props & tType) => {
  const [status, setStatus] = useState<StatusType>('initial');

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

  const handleSubmit = async (selected: any) => {
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

  const items = getResultItems();
  return (
    <>
      <div css={menuItemStyle}>
        <RoundIcon open small smallIcon={smallIcon} icon={icon} />
        <Downshift itemToString={item => itemToString(item, 'name')} onChange={handleSubmit}>
          {({ getInputProps, getRootProps, ...downshiftProps }) => (
            <DropdownWrapper {...getRootProps()}>
              <Input
                {...getInputProps({ placeholder })}
                data-testid="inlineDropdownInput"
                white
                css={dropdownInputStyle}
                iconRight={status === 'loading' ? <Spinner size="normal" margin="0" /> : <Search />}
              />
              <DropdownMenu
                items={items ? items.search(downshiftProps.inputValue!) : []}
                idField="id"
                labelField="name"
                {...downshiftProps}
                positionAbsolute
              />
            </DropdownWrapper>
          )}
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

export default memo(injectT(MenuItemDropdown));
