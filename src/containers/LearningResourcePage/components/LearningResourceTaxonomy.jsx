/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { TaxonomyFieldDropdown } from '../../../components/Fields';
import { CommonFieldPropsShape, TaxonomyShape } from '../../../shapes';
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
  fetchRelevances,
} from '../../../modules/taxonomy';
import { flattenResourceTypes } from '../../../util/taxonomyHelpers';
import Spinner from '../../../components/Spinner';
import Overlay from '../../../components/Overlay';
import handleError from '../../../util/handleError';

class LearningResourceTaxonomy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxonomy: {
        resourceTypes: [],
        filters: [],
        topics: [],
        relevances: [],
      },
    };
  }

  async componentDidMount() {
    const { model } = this.props;

    try {
      const [resourceTypes, filters, topics, relevances] = await Promise.all([
        fetchResourceTypes(model.language),
        fetchFilters(model.language),
        fetchTopics(model.language),
        fetchRelevances(model.language),
      ]);

      // Filter out items with no name (is required)
      this.setState({
        taxonomy: {
          resourceTypes: flattenResourceTypes(resourceTypes).filter(
            resourceType => resourceType.name,
          ),
          filters: filters.filter(filter => filter.name),
          topics: topics.filter(topic => topic.name),
          relevances,
        },
      });
    } catch (e) {
      handleError(e);
    }
  }

  render() {
    const { taxonomy } = this.state;
    const { t, commonFieldProps, model, taxonomyIsLoading } = this.props;

    const defaultDropdownProps = {
      obligatory: true,
      textField: 'name',
      valueField: 'id',
      ...commonFieldProps,
    };
    return (
      <Fragment>
        {taxonomyIsLoading ? <Spinner cssModifier="absolute" /> : ''}
        {taxonomyIsLoading ? (
          <Overlay cssModifiers={['absolute', 'white-opacity']} />
        ) : (
          ''
        )}
        <TaxonomyFieldDropdown
          name="resourceTypes"
          placeholder={t('form.resourceTypes.placeholder')}
          label={t('form.resourceTypes.label')}
          selectedItems={model.resourceTypes}
          items={taxonomy.resourceTypes}
          messages={{
            emptyFilter: t('form.resourceTypes.emptyFilter'),
            emptyList: t('form.resourceTypes.emptyList'),
          }}
          {...defaultDropdownProps}
        />
        <TaxonomyFieldDropdown
          name="filter"
          placeholder={t('form.filter.placeholder')}
          items={taxonomy.filters}
          selectedItems={model.filter}
          tagProperties={taxonomy.relevances}
          label={t('form.filter.label')}
          messages={{
            toolTipDescription: t('form.filter.setRelevance'),
            emptyFilter: t('form.filter.emptyFilter'),
            emptyList: t('form.filter.emptyList'),
          }}
          {...defaultDropdownProps}
        />
        <TaxonomyFieldDropdown
          name="topics"
          placeholder={t('form.topics.placeholder')}
          items={taxonomy.topics}
          selectedItems={model.topics}
          label={t('form.topics.label')}
          messages={{
            toolTipDescription: t('form.topics.setPrimaryTopic'),
            emptyFilter: t('form.topics.emptyFilter'),
            emptyList: t('form.topics.emptyList'),
          }}
          {...defaultDropdownProps}
        />
      </Fragment>
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
    resourceTypes: PropTypes.arrayOf(PropTypes.shape({})),
    filter: PropTypes.arrayOf(PropTypes.shape({})),
    topics: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  taxonomyIsLoading: PropTypes.bool,
};

export default injectT(LearningResourceTaxonomy);
