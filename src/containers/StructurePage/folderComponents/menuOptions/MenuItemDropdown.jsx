/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
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

class MenuItemDropdown extends PureComponent {
  constructor() {
    super();
    this.state = {
      status: 'initial',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getResultItems = this.getResultItems.bind(this);
  }

  getResultItems() {
    const { searchResult, filter } = this.props;
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
  }

  async handleSubmit(selected) {
    if (selected) {
      const { onSubmit, onClose } = this.props;
      this.setState({ status: 'loading' });
      try {
        await onSubmit(selected);
        onClose();
        this.setState({ status: 'success' });
      } catch (error) {
        handleError(error);
        this.setState({ status: 'error' });
      }
    }
  }

  render() {
    const { icon, t, placeholder, smallIcon } = this.props;
    const { selected, status } = this.state;
    const items = this.getResultItems();
    return (
      <Fragment>
        <div css={menuItemStyle}>
          <RoundIcon open small smallIcon={smallIcon} icon={icon} />
          <Downshift
            selectedItem={selected}
            itemToString={item => itemToString(item, 'name')}
            onChange={this.handleSubmit}>
            {({ getInputProps, getRootProps, ...downshiftProps }) => (
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
                  items={items ? items.search(downshiftProps.inputValue) : []}
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
      </Fragment>
    );
  }
}

MenuItemDropdown.propTypes = {
  icon: PropTypes.node,
  onSubmit: PropTypes.func,
  currentVal: PropTypes.string,
  classes: PropTypes.func,
  onClose: PropTypes.func,
  searchResult: PropTypes.array,
  placeholder: PropTypes.string,
  filter: PropTypes.string,
  smallIcon: PropTypes.bool,
};

export default injectT(MenuItemDropdown);
