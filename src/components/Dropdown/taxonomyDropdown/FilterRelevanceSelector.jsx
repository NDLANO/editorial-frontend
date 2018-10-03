import React from 'react';
import PropTypes from 'prop-types';
import { tagClasses } from '../../Tag';
import ToolTip from '../../ToolTip';
import { DropdownTagPropertyItem } from '.';
import { RESOURCE_FILTER_CORE } from '../../../constants';

const FilterRelevanceSelector = ({
  currentRelevance,
  messages,
  tagProperties,
  handleSetTagProperty,
}) => {
  const tagPropertyItem = (
    <strong>{currentRelevance === RESOURCE_FILTER_CORE ? 'K' : 'T'}</strong>
  );
  return (
    <div {...tagClasses('item')}>
      {' '}
      <ToolTip
        name="filter"
        direction="right"
        messages={{ ariaLabel: 'tooltip' }}
        content={
          <div {...tagClasses('radio')} tabIndex={-1} role="radiogroup">
            <div {...tagClasses('radio', 'description')}>
              {messages.toolTipDescription}
            </div>
            {tagProperties.map(
              ({ name, id }) =>
                name ? (
                  <DropdownTagPropertyItem
                    key={id}
                    id={id}
                    name={name}
                    checked={currentRelevance === id}
                    handleSetTagProperty={handleSetTagProperty}
                  />
                ) : (
                  ''
                ),
            )}
          </div>
        }>
        {tagPropertyItem}
      </ToolTip>
    </div>
  );
};

FilterRelevanceSelector.propTypes = {
  currentRelevance: PropTypes.string,
  messages: PropTypes.objectOf(PropTypes.string),
  tagProperties: PropTypes.arrayOf(PropTypes.object),
  handleSetTagProperty: PropTypes.func,
};

export default FilterRelevanceSelector;
