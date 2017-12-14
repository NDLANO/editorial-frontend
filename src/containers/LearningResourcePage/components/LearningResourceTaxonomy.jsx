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
import { MultiSelectDropdown } from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import Accordion from '../../../components/Accordion';

class LearningResourceTaxonomy extends Component {
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
    const { t, commonFieldProps, resourceTypes, filter, topics } = this.props;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.taxonomytSection')}
        hidden={this.state.hiddenContent}
        fill>
        <MultiSelectDropdown
          obligatory
          name="resourceTypes"
          textField="name"
          valueField="id"
          placeholder={t('form.resourceTypes.placeholder')}
          label={t('form.resourceTypes.label')}
          items={resourceTypes}
          messages={{
            emptyFilter: t('form.resourceTypes.emptyFilter'),
            emptyList: t('form.resourceTypes.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectDropdown
          obligatory
          name="filter"
          placeholder={t('form.filter.placeholder')}
          items={filter}
          label={t('form.filter.label')}
          messages={{
            emptyFilter: t('form.filter.emptyFilter'),
            emptyList: t('form.filter.emptyList'),
          }}
          {...commonFieldProps}
        />
        <MultiSelectDropdown
          obligatory
          name="topics"
          placeholder={t('form.topics.placeholder')}
          items={topics}
          label={t('form.topics.label')}
          messages={{
            emptyFilter: t('form.topics.emptyFilter'),
            emptyList: t('form.topics.emptyList'),
          }}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

LearningResourceTaxonomy.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  resourceTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  topics: PropTypes.arrayOf(PropTypes.object).isRequired,
  filter: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default injectT(LearningResourceTaxonomy);
