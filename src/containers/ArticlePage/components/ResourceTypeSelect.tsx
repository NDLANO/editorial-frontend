/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FieldHeader } from '@ndla/forms';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, Select, SingleValue } from '@ndla/select';
import HowToHelper from '../../../components/HowTo/HowToHelper';
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
  selectedType?: string;
}
const ResourceTypeSelect = ({
  availableResourceTypes,
  resourceTypes,
  onChangeSelectedResource,
  selectedType,
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
        : selectedType
        ? options.find((o) => o.value === selectedType)
        : undefined,
    [options, resourceTypes, selectedType],
  );

  return (
    <>
      <FieldHeader
        title={t('taxonomy.resourceTypes.title')}
        subTitle={t('taxonomy.resourceTypes.subTitle')}
      >
        <HowToHelper
          pageId="TaxonomyContentTypes"
          tooltip={t('taxonomy.resourceTypes.helpLabel')}
        />
      </FieldHeader>
      <Select
        placeholder={t('taxonomy.resourceTypes.placeholder')}
        options={options}
        onChange={onChangeSelectedResource}
        isMulti={false}
        value={value}
        noOptionsMessage={() => t('form.responsible.noResults')}
        isSearchable
      />
    </>
  );
};

export default ResourceTypeSelect;
