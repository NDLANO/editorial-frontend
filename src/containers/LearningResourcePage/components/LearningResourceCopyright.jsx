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
        header={t('learningResourceForm.copyrightSection')}
        hidden={this.state.hiddenContent}
        fill>
        <MultiSelectField
          name="authors"
          label={t('form.authors.label')}
          messages={{
            createOption: t('form.authors.createOption'),
            emptyFilter: t('form.authors.emptyFilter'),
            emptyList: t('form.authors.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          name="licensees"
          label={t('form.licensees.label')}
          messages={{
            createOption: t('form.licensees.createOption'),
            emptyFilter: t('form.licensees.emptyFilter'),
            emptyList: t('form.licensees.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          name="contributors"
          label={t('form.contributors.label')}
          messages={{
            createOption: t('form.contributors.createOption'),
            emptyFilter: t('form.contributors.emptyFilter'),
            emptyList: t('form.contributors.emptyList'),
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
