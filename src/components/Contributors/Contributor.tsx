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

interface ContributorTypeItem {
  translation: string;
  type: string;
}

interface Props {
  showError: boolean;
  placeholder?: string;
  disabled: boolean;
  labelRemove?: string;
  contributor: {
    name: string;
    type: string;
    focusOnMount: boolean;
  };
  handleContributorChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    name: 'type' | 'name',
    index: number,
  ) => void;
  removeContributor: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  contributorTypeItems: Array<ContributorTypeItem>;
  index: number;
  errorMessages: Array<string>;
}

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
}: Props) => (
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContributorChange(e, 'name', index)
          }
        />
        <Select
          value={contributor.type}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContributorChange(e, 'type', index)
          }
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContributorChange(e, 'type', index)
          }
          data-cy="contributor-selector">
          <option value="" />
          {contributorTypeItems.map((item: ContributorTypeItem) => (
            <option value={item.type} key={item.type}>
              {item.translation}
            </option>
          ))}
        </Select>
      </FieldSplitter>
    </div>
    <div>
      <FieldRemoveButton
        onClick={(evt: React.ChangeEvent<HTMLInputElement>) => removeContributor(evt, index)}>
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
