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
import { css } from 'react-emotion';
import { Done } from '@ndla/icons/editor';
import Downshift from 'downshift';
import Fuse from 'fuse.js';
import { Cross } from '@ndla/icons/action';
import handleError from '../../../../util/handleError';
import { itemToString } from '../../../../util/downShiftHelpers';
import {
  DropdownMenu,
  DropdownInput,
  DropdownActionButton,
  dropDownClasses,
} from '../../../../components/Dropdown/common';
import RoundIcon from '../../../../components/RoundIcon';
import Spinner from '../../../../components/Spinner';
import MenuItemSaveButton from './MenuItemSaveButton';
import { StyledErrorMessage } from './MenuItemEditField';

const menuItemStyle = css`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

const dropdownInputStyle = css`
  margin-right: 6.5px;
  max-height: 26px;
`;

class MenuItemDropdown extends PureComponent {
  constructor() {
    super();
    this.state = {
      status: 'initial',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setResultItems = this.setResultItems.bind(this);
  }

  componentDidMount() {
    this.setResultItems();
  }

  async setResultItems() {
    const { fetchItems, filter } = this.props;
    const res = await fetchItems();
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
    this.setState({
      items: new Fuse(
        filter ? res.filter(it => it.path && !it.path.includes(filter)) : res,
        options,
      ),
    });
  }

  async handleSubmit() {
    const { selected } = this.state;
    if (selected) {
      const { onSubmit, onClose } = this.props;
      this.setState({ status: 'loading' });
      try {
        await onSubmit(selected.id);
        onClose();
        this.setState({ status: 'success' });
      } catch (error) {
        handleError(error);
        this.setState({ status: 'error' });
      }
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Escape') {
      this.setState({ status: 'initial' });
    } else if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    const { icon, t, placeholder } = this.props;
    const { selected, items, status } = this.state;
    return (
      <Fragment>
        <div className={menuItemStyle}>
          <RoundIcon open small icon={icon} />
          <Downshift
            selectedItem={selected}
            itemToString={item => itemToString(item, 'name')}
            onChange={selectedItem =>
              this.setState({ selected: selectedItem })
            }>
            {downshiftProps => (
              <div {...dropDownClasses()}>
                <DropdownInput
                  css={dropdownInputStyle}
                  testid="inlineDropdownInput"
                  {...downshiftProps}
                  inputProps={{ placeholder }}
                />
                <DropdownMenu
                  items={items ? items.search(downshiftProps.inputValue) : []}
                  {...downshiftProps}
                  textField="name"
                  valueField="id"
                  fuzzy
                  dontShowOnEmptyFilter
                  messages={{
                    emptyFilter: t('taxonomy.emptyFilter'),
                    emptyList: t('taxonomy.emptyFilter'),
                  }}
                />
                {selected && (
                  <DropdownActionButton
                    onClick={downshiftProps.clearSelection}
                    stripped>
                    <Cross className="c-icon--medium" />
                  </DropdownActionButton>
                )}
              </div>
            )}
          </Downshift>
          <MenuItemSaveButton
            data-testid="inlineEditSaveButton"
            onClick={this.handleSubmit}>
            {status === 'loading' ? (
              <Spinner appearance="small" />
            ) : (
              <Done className="c-icon--small" />
            )}
          </MenuItemSaveButton>
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
  fetchItems: PropTypes.func,
  placeholder: PropTypes.string,
};

export default injectT(MenuItemDropdown);
