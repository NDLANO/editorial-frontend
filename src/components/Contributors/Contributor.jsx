/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FieldSection, FieldSplitter, Input, Select, FieldRemoveButton } from '@ndla/forms';

const Contributor = ({
  labelRemove,
  showError,
  placeholder,
  disabled,
  contributor,
  errorMessages,
  handleContributorChange,
  index,
  contributorTypeItems,
  removeContributor,
}) => (
  <FieldSection>
    <div>
      <FieldSplitter>
        <Input
          warningText={
            showError && (contributor.name === '' || contributor.type === '')
              ? errorMessages[0]
              : null
          }
          container="div"
          type="text"
          focusOnMount={contributor.focusOnMount}
          placeholder={placeholder}
          disabled={disabled}
          value={contributor.name}
          onChange={e => handleContributorChange(e, 'name', index)}
        />
        <Select
          value={contributor.type}
          onChange={e => handleContributorChange(e, 'type', index)}
          onBlur={e => handleContributorChange(e, 'type', index)}
          data-cy="contributor-selector">
          <option value="" />
          {contributorTypeItems.map(item => (
            <option value={item.type} key={item.type}>
              {item.translation}
            </option>
          ))}
        </Select>
      </FieldSplitter>
    </div>
    <div>
      <FieldRemoveButton onClick={evt => removeContributor(evt, index)}>
        {labelRemove}
      </FieldRemoveButton>
    </div>
  </FieldSection>
);

Contributor.defaultProps = {
  errorMessages: [],
  disabled: false,
};

Contributor.propTypes = {
  showError: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  labelRemove: PropTypes.string,
  contributor: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    focusOnMount: PropTypes.bool,
  }).isRequired,
  handleContributorChange: PropTypes.func.isRequired,
  removeContributor: PropTypes.func.isRequired,
  contributorTypeItems: PropTypes.arrayOf(
    PropTypes.shape({
      translation: PropTypes.string,
      type: PropTypes.string,
    }),
  ).isRequired,
  index: PropTypes.number.isRequired,
  errorMessages: PropTypes.arrayOf(PropTypes.string),
};

export default Contributor;
