/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import { FieldHeader, Select } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import { selectedResourceTypeValue } from '../../../util/taxonomyHelpers';
import HowToHelper from '../../../components/HowTo/HowToHelper';

const ResourceTypeSelect = ({
  resourceTypes,
  availableResourceTypes,
  onChangeSelectedResource,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <FieldHeader
        title={t('taxonomy.resourceTypes.title')}
        subTitle={t('taxonomy.resourceTypes.subTitle')}>
        <HowToHelper
          pageId="TaxonomyContentTypes"
          tooltip={t('taxonomy.resourceTypes.helpLabel')}
        />
      </FieldHeader>
      <Select value={selectedResourceTypeValue(resourceTypes)} onChange={onChangeSelectedResource}>
        <option value="">{t('taxonomy.resourceTypes.placeholder')}</option>
        {availableResourceTypes.map(resourceType =>
          resourceType.subtypes ? (
            resourceType.subtypes.map(subtype => (
              <option value={`${resourceType.id},${subtype.id}`} key={subtype.id}>
                {resourceType.name} - {subtype.name}
              </option>
            ))
          ) : (
            <option key={resourceType.id} value={resourceType.id}>
              {resourceType.name}
            </option>
          ),
        )}
      </Select>
    </>
  );
};

ResourceTypeSelect.propTypes = {
  onChangeSelectedResource: PropTypes.func.isRequired,
  resourceTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      parentId: PropTypes.string,
    }),
  ).isRequired,
  availableResourceTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      subtypes: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
};

export default ResourceTypeSelect;
