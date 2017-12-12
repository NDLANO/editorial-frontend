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
import { MultiSelectField } from '../../../components/Fields';
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
    const { t, commonFieldProps, resourceType, filter, topics } = this.props;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.taxonomytSection')}
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
      </Accordion>
    );
  }
}

LearningResourceCopyright.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  resourceType: PropTypes.arrayOf(PropTypes.string).isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  filter: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(LearningResourceCopyright);
