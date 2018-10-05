/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'ndla-button';
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-icons/action';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class SlateFactAside extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
    };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded() {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  }

  render() {
    const { children, onRemoveClick, attributes } = this.props;

    return (
      <aside
        {...classes(
          'fact-aside',
          '',
          this.state.expanded ? 'c-factbox expanded' : 'c-factbox',
        )}
        {...attributes}>
        <div className="c-factbox__content">{children}</div>
        <Button
          onClick={this.toggleExpanded}
          className="c-button c-factbox__button"
        />
        <Button
          stripped
          onClick={onRemoveClick}
          data-cy="remove-fact-aside"
          {...classes('delete-button')}>
          <Cross />
        </Button>
      </aside>
    );
  }
}

SlateFactAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
};

export default SlateFactAside;
