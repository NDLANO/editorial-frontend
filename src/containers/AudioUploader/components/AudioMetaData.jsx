/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { MultiSelectField, TextField } from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import Contributors from '../../../components/Contributors';
import FormLicense from '../../Form/components/FormLicense';

const AudioMetaData = props => {
  const { t, commonFieldProps, tags, licenses } = props;
  return (
    <Fragment>
      <MultiSelectField
        obligatory
        name="tags"
        data={tags}
        label={t('form.tags.label')}
        description={t('form.tags.description')}
        messages={{
          createOption: t('form.tags.createOption'),
          emptyFilter: t('form.tags.emptyFilter'),
          emptyList: t('form.tags.emptyList'),
        }}
        {...commonFieldProps}
      />
      <FormLicense licenses={licenses} commonFieldProps={commonFieldProps} />
      <TextField
        label={t('form.origin.label')}
        name="origin"
        {...commonFieldProps}
      />
      <Contributors
        name="creators"
        label={t('form.creators.label')}
        {...commonFieldProps}
      />
      <Contributors
        name="rightsholders"
        label={t('form.rightsholders.label')}
        {...commonFieldProps}
      />
      <Contributors
        name="processors"
        label={t('form.processors.label')}
        {...commonFieldProps}
      />
    </Fragment>
  );
};

AudioMetaData.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(AudioMetaData);
