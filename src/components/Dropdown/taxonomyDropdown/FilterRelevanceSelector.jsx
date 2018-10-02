import React, { Component } from 'react';
import { tagClasses } from '../../Tag';
import ToolTip from '../../ToolTip';
import { DropdownTagPropertyItem } from '.';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';

import PropTypes from 'prop-types';

const FilterRelevanceSelector = ({
  currentRelevance,
  messages,
  tagProperties,
  handleSetTagProperty,
}) => {
  console.log(currentRelevance);
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
              property =>
                property.name ? (
                  <DropdownTagPropertyItem
                    key={property.id}
                    itemProperty={currentRelevance}
                    tagProperty={property}
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

FilterRelevanceSelector.propTypes = {};

export default FilterRelevanceSelector;
