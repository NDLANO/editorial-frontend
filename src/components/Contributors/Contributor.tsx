/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
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
    event: FormEvent<HTMLSelectElement> | FormEvent<HTMLInputElement>,
    name: ContributorFieldName,
    index: number,
  ) => void;
  removeContributor: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
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
              : undefined
          }
          type="text"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={!!contributor.focusOnMount}
          placeholder={placeholder}
          disabled={disabled}
          value={contributor.name}
          onChange={(e) => handleContributorChange(e, 'name', index)}
        />
        <Select
          value={contributor.type}
          onChange={(e) => handleContributorChange(e, 'type', index)}
          onBlur={(e) => handleContributorChange(e, 'type', index)}
          data-cy="contributor-selector"
        >
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
      <FieldRemoveButton onClick={(evt) => removeContributor(evt, index)}>
        {labelRemove}
      </FieldRemoveButton>
    </div>
  </FieldSection>
);

export default Contributor;
