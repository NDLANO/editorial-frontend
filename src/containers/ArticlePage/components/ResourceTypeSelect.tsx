/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, Select, SingleValue } from '@ndla/select';
import { selectedResourceTypeValue } from '../../../util/taxonomyHelpers';

interface ResourceType {
  id: string;
  name: string;
  parentId?: string;
}

interface ResourceTypeWithSubtypes extends ResourceType {
  subtypes?: ResourceType[];
}

interface Props {
  onChangeSelectedResource: (value: SingleValue) => void;
  resourceTypes?: ResourceType[];
  availableResourceTypes: ResourceTypeWithSubtypes[];
  isClearable?: boolean;
}
const ResourceTypeSelect = ({
  availableResourceTypes,
  resourceTypes,
  onChangeSelectedResource,
  isClearable = false,
}: Props) => {
  const { t } = useTranslation();

  const options: Option[] = useMemo(
    () =>
      availableResourceTypes.flatMap((resourceType) =>
        resourceType.subtypes
          ? resourceType.subtypes.map((subtype) => ({
              label: `${resourceType.name} - ${subtype.name}`,
              value: `${resourceType.id},${subtype.id}`,
            }))
          : { label: resourceType.name, value: resourceType.id },
      ),
    [availableResourceTypes],
  );

  const value = useMemo(
    () =>
      resourceTypes?.length
        ? options.find((o) => o.value === selectedResourceTypeValue(resourceTypes))
        : undefined,
    [options, resourceTypes],
  );

  return (
    <Select
      placeholder={t('taxonomy.resourceTypes.placeholder')}
      options={options}
      onChange={onChangeSelectedResource}
      isMulti={false}
      value={value}
      noOptionsMessage={() => t('form.responsible.noResults')}
      isSearchable
      isClearable={isClearable}
      id="select-resource-type"
    />
  );
};

export default ResourceTypeSelect;
