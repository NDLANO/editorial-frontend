/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, Select, SingleValue } from '@ndla/select';
import { ResourceType } from '@ndla/types-taxonomy';
import { selectedResourceTypeValue } from '../../../util/taxonomyHelpers';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import { ResourceResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

interface Resource {
  id: string;
  name: string;
  parentId?: string;
}

interface Props {
  resourceTypes?: Resource[];
  availableResourceTypes: ResourceType[];
  isClearable?: boolean;
  stageTaxonomyChanges: (properties: any) => void;
}
const ResourceTypeSelect = ({
  availableResourceTypes,
  resourceTypes,
  isClearable = false,
  stageTaxonomyChanges,
}: Props) => {
  const { t } = useTranslation();

  const filteredResourceTypes = useMemo(
    () =>
      availableResourceTypes
        .filter((rt) => !blacklistedResourceTypes.includes(rt.id))
        .map((rt) => ({
          ...rt,
          subtype:
            rt.subtypes && rt.subtypes.filter((st) => !blacklistedResourceTypes.includes(st.id)),
        })),
    [availableResourceTypes],
  );

  const options: Option[] = useMemo(
    () =>
      filteredResourceTypes.flatMap((resourceType) =>
        resourceType.subtypes
          ? resourceType.subtypes.map((subtype) => ({
              label: `${resourceType.name} - ${subtype.name}`,
              value: `${resourceType.id},${subtype.id}`,
            }))
          : { label: resourceType.name, value: resourceType.id },
      ),
    [filteredResourceTypes],
  );

  const value = useMemo(
    () =>
      resourceTypes?.length
        ? options.find((o) => o.value === selectedResourceTypeValue(resourceTypes))
        : undefined,
    [options, resourceTypes],
  );

  const onChangeSelectedResource = (value: SingleValue) => {
    const options = value?.value?.split(',') ?? [];
    const selectedResource = availableResourceTypes.find(
      (resourceType) => resourceType.id === options[0],
    );

    if (selectedResource) {
      const resourceTypes: ResourceResourceType[] = [
        {
          name: selectedResource.name,
          id: selectedResource.id,
          parentId: '',
          connectionId: '',
        },
      ];

      if (options.length > 1) {
        const subType = selectedResource.subtypes?.find((subtype) => subtype.id === options[1]);
        if (subType)
          resourceTypes.push({
            id: subType.id,
            name: subType.name,
            parentId: selectedResource.id,
            connectionId: '',
          });
      }
      stageTaxonomyChanges({ resourceTypes });
    }
  };

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
      required
    />
  );
};

export default ResourceTypeSelect;
