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

class LearningResourceAffiliation extends Component {
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
    const {
      t,
      commonFieldProps,
      licenses,
      resourceType,
      topics,
      filter,
    } = this.props;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.affiliationtSection')}
        hidden={this.state.hiddenContent}>
        <MultiSelectField
          obligatory
          disableCreate
          name="resourceType"
          data={resourceType}
          label={t('form.resourceType.label')}
          description={t('form.resourceType.description')}
          messages={{
            createOption: t('form.resourceType.createOption'),
            emptyFilter: t('form.resourceType.emptyFilter'),
            emptyList: t('form.resourceType.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          obligatory
          disableCreate
          name="filter"
          data={filter}
          label={t('form.filter.label')}
          description={t('form.filter.description')}
          messages={{
            createOption: t('form.filter.createOption'),
            emptyFilter: t('form.filter.emptyFilter'),
            emptyList: t('form.filter.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectField
          obligatory
          disableCreate
          name="topics"
          data={topics}
          label={t('form.topics.label')}
          description={t('form.topics.description')}
          messages={{
            createOption: t('form.topics.createOption'),
            emptyFilter: t('form.topics.emptyFilter'),
            emptyList: t('form.topics.emptyList'),
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
      </Accordion>
    );
  }
}

LearningResourceAffiliation.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  resourceType: PropTypes.arrayOf(PropTypes.string).isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  filter: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(LearningResourceAffiliation);
