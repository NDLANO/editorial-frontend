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
import { CommonFieldPropsShape, TaxonomyShape } from '../../../shapes';
import Accordion from '../../../components/Accordion';
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
} from '../../../modules/taxonomy';

class LearningResourceTaxonomy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: true,
      taxonomy: {
        resourceTypes: [],
        filters: [],
        topics: [],
      },
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  async componentWillMount() {
    const { locale } = this.props;

    try {
      const resourceTypes = await fetchResourceTypes(locale);
      const filters = await fetchFilters(locale);
      const topics = await fetchTopics(locale);
      this.setState({ taxonomy: { resourceTypes, filters, topics } });
    } catch (e) {
      throw new Error(e);
    }
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  render() {
    const { taxonomy } = this.state;
    const { t, commonFieldProps, model } = this.props;

    const defaultDropdownProps = {
      obligatory: true,
      textField: 'name',
      valueField: 'id',
    };

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.taxonomytSection')}
        hidden={this.state.hiddenContent}
        fill>
        <MultiSelectDropdown
          name="resourceTypes"
          placeholder={t('form.resourceTypes.placeholder')}
          label={t('form.resourceTypes.label')}
          selectedItems={model.resourceTypes}
          items={taxonomy.resourceTypes}
          messages={{
            emptyFilter: t('form.resourceTypes.emptyFilter'),
            emptyList: t('form.resourceTypes.emptyList'),
          }}
          {...{ ...defaultDropdownProps, ...commonFieldProps }}
        />
        <MultiSelectDropdown
          name="filter"
          placeholder={t('form.filter.placeholder')}
          items={taxonomy.filters}
          label={t('form.filter.label')}
          messages={{
            emptyFilter: t('form.filter.emptyFilter'),
            emptyList: t('form.filter.emptyList'),
          }}
          {...{ ...defaultDropdownProps, ...commonFieldProps }}
        />
        <MultiSelectDropdown
          name="topics"
          placeholder={t('form.topics.placeholder')}
          items={taxonomy.topics}
          label={t('form.topics.label')}
          messages={{
            emptyFilter: t('form.topics.emptyFilter'),
            emptyList: t('form.topics.emptyList'),
          }}
          {...{ ...defaultDropdownProps, ...commonFieldProps }}
        />
      </Accordion>
    );
  }
}

LearningResourceTaxonomy.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  taxonomy: TaxonomyShape,
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
  }),
};

export default injectT(LearningResourceTaxonomy);
