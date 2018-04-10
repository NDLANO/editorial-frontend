/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Done } from 'ndla-icons/editor';
import Downshift from 'downshift';
import Fuse from 'fuse.js';
import { Cross } from 'ndla-icons/action';
import { Search } from 'ndla-icons/common';
import { itemToString } from '../../../util/downShiftHelpers';
import {
  DropdownMenu,
  DropdownInput,
  dropDownClasses,
} from '../../../components/Dropdown/common';

import Spinner from '../../../components/Spinner';

class InlineDropdown extends PureComponent {
  constructor() {
    super();
    this.state = {
      status: 'initial',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async componentDidMount() {
    const res = await this.props.fetchItems();
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
    this.setState({ items: new Fuse(res, options) }); // eslint-disable-line
  }

  async handleSubmit() {
    if (this.state.selected) {
      this.setState({ status: 'loading' });
      try {
        await this.props.onSubmit(this.state.selected.id);
        this.props.onClose();
        this.setState({ status: 'success' });
      } catch (e) {
        this.setState({ status: 'error' });
      }
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Escape') {
      this.setState({ status: 'initial' });
    }
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    const { icon, classes, t } = this.props;
    const { selected, items, status } = this.state;
    return (
      <React.Fragment>
        <div {...classes('menuItem')}>
          <div {...classes('iconButton', 'open item')}>{icon}</div>
          <Downshift
            selectedItem={selected}
            itemToString={item => itemToString(item, 'name')}
            onChange={selectedItem => this.setState({ selected: selectedItem })}
            render={downshiftProps => (
              <div {...dropDownClasses()}>
                <DropdownInput {...downshiftProps} />
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
                {selected ? (
                  <Button
                    {...dropDownClasses('action')}
                    onClick={downshiftProps.clearSelection}
                    stripped>
                    <Cross className="c-icon--medium" />
                  </Button>
                ) : (
                  <div {...dropDownClasses('action')}>
                    <Search className="c-icon--medium" />
                  </div>
                )}
              </div>
            )}
          />
          <Button
            {...classes('saveButton')}
            data-testid="inlineEditSaveButton"
            onClick={this.handleSubmit}>
            {status === 'loading' ? (
              <Spinner cssModifier="small" />
            ) : (
              <Done className="c-icon--small" />
            )}
          </Button>
        </div>
        {status === 'error' && (
          <div
            data-testid="inlineEditErrorMessage"
            {...classes('errorMessage')}>
            {t('taxonomy.errorMessage')}
          </div>
        )}
      </React.Fragment>
    );
  }
}

InlineDropdown.propTypes = {
  icon: PropTypes.node,
  onSubmit: PropTypes.func,
  currentVal: PropTypes.string,
  classes: PropTypes.func,
  onClose: PropTypes.func,
  fetchItems: PropTypes.func,
};

export default InlineDropdown;
