/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import {
  MultiSelectField,
  SelectObjectField,
  TextField,
} from '../../../components/Fields';
import Accordion from '../../../components/Accordion';
import { CommonFieldPropsShape } from '../../../shapes';

class AudioMetaData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenMetadata: true,
    };
    this.toggleMetadata = this.toggleMetadata.bind(this);
  }

  toggleMetadata() {
    this.setState(prevState => ({
      hiddenMetadata: !prevState.hiddenMetadata,
    }));
  }

  render() {
    const { t, commonFieldProps, tags, licenses } = this.props;
    return (
      <Accordion
        fill
        handleToggle={this.toggleMetadata}
        header={t('form.metadataSection')}
        hidden={this.state.hiddenMetadata}>
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
        <MultiSelectField
          obligatory
          name="creators"
          label={t('form.authors.label')}
          description={t('form.authors.description')}
          messages={{
            createOption: t('form.authors.createOption'),
            emptyFilter: t('form.authors.emptyFilter'),
            emptyList: t('form.authors.emptyList'),
          }}
          {...commonFieldProps}
        />
        <TextField
          label={t('form.origin.label')}
          name="origin"
          {...commonFieldProps}
        />
        <SelectObjectField
          name="license"
          label={t('form.license.label')}
          options={licenses}
          idKey="license"
          labelKey="description"
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

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
