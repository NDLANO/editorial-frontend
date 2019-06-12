/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FieldHeader, Select } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import { selectedResourceTypeValue } from '../../../../util/taxonomyHelpers';
import HowToHelper from '../../../../components/HowTo/HowToHelper';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../../constants';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

const ResourceTypeSelect = ({
  t,
  resourceTypes,
  availableResourceTypes,
  onChangeSelectedResource,
}) => (
  <Fragment>
    <FieldHeader
      title={t('taxonomy.resourceTypes.title')}
      subTitle={t('taxonomy.resourceTypes.subTitle')}>
      <HowToHelper
        pageId="TaxonomyContentTypes"
        tooltip={t('taxonomy.resourceTypes.helpLabel')}
      />
    </FieldHeader>
    <Select
      value={selectedResourceTypeValue(resourceTypes)}
      onChange={onChangeSelectedResource}>
      <option value="">{t('taxonomy.resourceTypes.placeholder')}</option>
      {availableResourceTypes
        .filter(
          resourceType => !blacklistedResourceTypes.includes(resourceType.id),
        )
        .map(resourceType =>
          resourceType.subtypes ? (
            resourceType.subtypes
              .filter(
                resourceType =>
                  !blacklistedResourceTypes.includes(resourceType.id),
              )
              .map(subtype => (
                <option
                  value={`${resourceType.id},${subtype.id}`}
                  key={subtype.id}>
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
  </Fragment>
);

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

export default injectT(ResourceTypeSelect);
