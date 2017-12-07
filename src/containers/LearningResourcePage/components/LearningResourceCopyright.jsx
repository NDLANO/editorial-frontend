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
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import Accordion from '../../../components/Accordion';

class LearningResourceCopyright extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: true,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  render() {
    const { t, commonFieldProps, licenses } = this.props;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.copyrightSection')}
        hidden={this.state.hiddenContent}
        fill>
        <MultiSelectField
          name="creators"
          label={t('form.creators.label')}
          messages={{
            createOption: t('form.creators.createOption'),
            emptyFilter: t('form.creators.emptyFilter'),
            emptyList: t('form.creators.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          name="processors"
          label={t('form.processors.label')}
          messages={{
            createOption: t('form.processors.createOption'),
            emptyFilter: t('form.processors.emptyFilter'),
            emptyList: t('form.processors.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          name="rightsholders"
          label={t('form.rightsholders.label')}
          messages={{
            createOption: t('form.rightsholders.createOption'),
            emptyFilter: t('form.rightsholders.emptyFilter'),
            emptyList: t('form.rightsholders.emptyList'),
          }}
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

LearningResourceCopyright.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(LearningResourceCopyright);
