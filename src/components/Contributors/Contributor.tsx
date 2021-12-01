/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import { FieldSection, FieldSplitter, Input, Select, FieldRemoveButton } from '@ndla/forms';
import { ContributorType, ContributorFieldName } from './types';

interface ContributorTypeItem {
  translation: string;
  type: string;
}

interface Props {
  showError: boolean;
  placeholder?: string;
  disabled?: boolean;
  labelRemove?: string;
  contributor: ContributorType;
  handleContributorChange: (
    event: ChangeEvent<HTMLInputElement>,
    name: ContributorFieldName,
    index: number,
  ) => void;
  removeContributor: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  contributorTypeItems: ContributorTypeItem[];
  index: number;
  errorMessages?: string[];
}

const Contributor = ({
  labelRemove,
  showError,
  placeholder,
  disabled = false,
  contributor,
  errorMessages = [],
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleContributorChange(e, 'name', index)}
        />
        <Select
          value={contributor.type}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleContributorChange(e, 'type', index)}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => handleContributorChange(e, 'type', index)}
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
        onClick={(evt: ChangeEvent<HTMLInputElement>) => removeContributor(evt, index)}>
        {labelRemove}
      </FieldRemoveButton>
    </div>
  </FieldSection>
);

Contributor.propTypes = {
  showError: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  labelRemove: PropTypes.string,
  contributor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
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
