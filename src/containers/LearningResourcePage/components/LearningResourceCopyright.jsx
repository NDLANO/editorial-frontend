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
        header={t('learningResourceForm.copyrightAccordion')}
        hidden={this.state.hiddenContent}
        fill>
        <MultiSelectField
          name="authors"
          label={t('learningResourceForm.fields.authors.label')}
          messages={{
            createNew: t('learningResourceForm.fields.authors.createNew'),
            emptyFilter: t('learningResourceForm.fields.authors.emptyFilter'),
            emptyList: t('learningResourceForm.fields.authors.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          name="licensees"
          label={t('learningResourceForm.fields.licensees.label')}
          messages={{
            createNew: t('learningResourceForm.fields.licensees.createNew'),
            emptyFilter: t('learningResourceForm.fields.licensees.emptyFilter'),
            emptyList: t('learningResourceForm.fields.licensees.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          name="contributors"
          label={t('learningResourceForm.fields.contributors.label')}
          messages={{
            createNew: t('learningResourceForm.fields.contributors.createNew'),
            emptyFilter: t(
              'learningResourceForm.fields.contributors.emptyFilter',
            ),
            emptyList: t('learningResourceForm.fields.contributors.emptyList'),
          }}
          {...commonFieldProps}
        />
        <SelectObjectField
          name="license"
          label={t('learningResourceForm.fields.license.label')}
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
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
    bindInput: PropTypes.func.isRequired,
  }),
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(LearningResourceCopyright);
