/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { DropdownTag } from './';
import ToolTip from '../../ToolTip';

const InputItems = props => {
  const { onRemoveItem, tagProps, name, selectedItem, messages } = props;
  const { handlePopupClick } = tagProps;
  return selectedItem.map(
    (tag, index) =>
      name === 'topics' ? (
        <ToolTip
          key={`${name}-tooptip-${tag.id}`}
          name={name}
          onPopupClick={() => handlePopupClick({ ...tag, primary: true })}
          noPopup={tag.primary}
          messages={{ ariaLabel: 'tooltip' }}
          content={messages.toolTipDescription}>
          <DropdownTag
            key={`${name}-tag-${tag.id}`}
            onRemoveItem={onRemoveItem}
            {...{ messages, tag, name, index, ...tagProps }}
          />
        </ToolTip>
      ) : (
        <DropdownTag
          key={`${name}-tag-${tag.id}`}
          onRemoveItem={onRemoveItem}
          {...{ messages, tag, name, index, ...tagProps }}
        />
      ),
  );
};

InputItems.propTypes = {
  multiSelect: PropTypes.bool,
  onRemoveItem: PropTypes.func,
  selectedItem: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  name: PropTypes.string,
  tagProps: PropTypes.shape({
    handlePopupClick: PropTypes.func.isRequired,
  }),
  messages: PropTypes.shape({}),
};

export default InputItems;
