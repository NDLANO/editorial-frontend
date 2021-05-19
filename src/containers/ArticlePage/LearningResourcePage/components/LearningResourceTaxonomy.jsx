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
import { Spinner } from '@ndla/editor';
import { ErrorMessage } from '@ndla/ui';
import Field from '../../../../components/Field';
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
  fetchTopicConnections,
  updateTaxonomy,
  getFullResource,
  createResource,
  getResourceId,
} from '../../../../modules/taxonomy';
import { filterToSubjects, sortByName, groupTopics } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';
import TopicConnections from '../../../../components/Taxonomy/TopicConnections';
import FilterConnections from '../../../../components/Taxonomy/filter/FilterConnections';
import SaveButton from '../../../../components/SaveButton';
import { ActionButton } from '../../../FormikForm';
import ResourceTypeSelect from '../../components/ResourceTypeSelect';
import TaxonomyInfo from './taxonomy/TaxonomyInfo';
import { TAXONOMY_ADMIN_SCOPE, RESOURCE_TYPE_LEARNING_PATH } from '../../../../constants';
import { ArticleShape } from '../../../../shapes';
import { FormikFieldHelp } from '../../../../components/FormikField';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

const emptyTaxonomy = {
  resourceTypes: [],
  filter: [],
  topics: [],
  metadata: {},
};

class LearningResourceTaxonomy extends Component {
  constructor() {
    super();
    this.state = {
      resourceId: '',
      structure: [],
      status: 'loading',
      isDirty: false,
      resourceTaxonomy: {
        ...emptyTaxonomy,
      },
      taxonomyChanges: {
        ...emptyTaxonomy,
      },
      taxonomyChoices: {
        allFilters: [],
        allTopics: [],
        availableFilters: {},
        availableResourceTypes: [],
      },
    };
  }

  componentDidMount() {
    this.fetchTaxonomy();
    this.fetchTaxonomyChoices();
  }

  componentDidUpdate({ article: { id: prevId } }, prevState) {
    // We need to refresh taxonomy for when an article URL has been pasted and a new article is showing
    if (prevId !== this.props.article.id) {
      this.fetchTaxonomy();
    }
  }

  onChangeSelectedResource = evt => {
    const {
      taxonomyChoices: { availableResourceTypes },
    } = this.state;
    const options = evt.target.value.split(',');
    const selectedResource = availableResourceTypes.find(
      resourceType => resourceType.id === options[0],
    );

    if (selectedResource) {
      const resourceTypes = [
        {
          name: selectedResource.name,
          id: selectedResource.id,
        },
      ];
      if (options.length > 1) {
        const subType = selectedResource.subtypes.find(subtype => subtype.id === options[1]);
        resourceTypes.push({
          id: subType.id,
          name: subType.name,
          parentId: selectedResource.id,
        });
      }

      this.stageTaxonomyChanges({ resourceTypes });
    }
  };

  getSubjectTopics = async subjectid => {
    if (this.state.structure.some(subject => subject.id === subjectid && subject.topics)) {
      return;
    }
    try {
      this.updateSubject(subjectid, { loading: true });
      const allTopics = await fetchSubjectTopics(subjectid, this.props.locale);
      const groupedTopics = groupTopics(allTopics);
      this.updateSubject(subjectid, { loading: false, topics: groupedTopics });
    } catch (err) {
      handleError(err);
    }
  };

  setPrimaryConnection = id => {
    const { topics } = this.state.taxonomyChanges;

    this.stageTaxonomyChanges({
      topics: topics.map(topic => ({
        ...topic,
        primary: topic.id === id,
      })),
    });
  };

  fetchTaxonomy = async () => {
    const {
      article: { language, id },
    } = this.props;
    try {
      const resourceId = await getResourceId({ id, language });

      if (resourceId) {
        const fullResource = await this.fetchFullResource(resourceId, language);

        this.setState({
          resourceId,
          status: 'initial',
          resourceTaxonomy: fullResource,
          taxonomyChanges: fullResource,
        });
      } else {
        // resource does not exist in taxonomy
        this.setState(prevState => ({
          status: 'initial',
          resourceTaxonomy: {
            ...emptyTaxonomy,
          },
          taxonomyChanges: {
            ...emptyTaxonomy,
          },
        }));
      }
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
    }
  };

  fetchTaxonomyChoices = async () => {
    const {
      article: { language },
    } = this.props;
    try {
      const [allResourceTypes, allFilters, allTopics, subjects] = await Promise.all([
        fetchResourceTypes(language),
        fetchFilters(language),
        fetchTopics(language),
        fetchSubjects(language),
      ]);

      const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);

      if (this.state.status !== 'error') {
        this.setState({
          taxonomyChoices: {
            availableResourceTypes: allResourceTypes.filter(resourceType => resourceType.name),
            availableFilters: filterToSubjects(allFilters.filter(filt => filt.name)),
            allFilters: allFilters.filter(filt => filt.name),
            allTopics: allTopics.filter(topic => topic.name),
          },
          structure: sortedSubjects,
        });
      }
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
    }
  };

  stageTaxonomyChanges = properties => {
    this.setState(prevState => ({
      isDirty: true,
      taxonomyChanges: {
        ...prevState.taxonomyChanges,
        ...properties,
      },
    }));
  };

  handleSubmit = async evt => {
    evt.preventDefault();
    const { resourceTaxonomy, taxonomyChanges, resourceId } = this.state;
    let reassignedResourceId = resourceId;
    const {
      updateNotes,
      article: { language, id, title, revision },
    } = this.props;
    this.setState({ status: 'loading' });
    try {
      if (!reassignedResourceId) {
        await createResource({
          contentUri: `urn:article:${id}`,
          name: title,
        });
        reassignedResourceId = await getResourceId({ id, language });
        this.setState({
          resourceId: reassignedResourceId,
        });
      }
      if (reassignedResourceId) {
        await updateTaxonomy(reassignedResourceId, resourceTaxonomy, taxonomyChanges, language);
        updateNotes({
          id,
          revision,
          language,
          notes: ['Oppdatert taksonomi.'],
        });
        this.setState({
          status: 'success',
          isDirty: false,
        });
        this.silentlyRefetchResourceTaxonomy();
      }
    } catch (err) {
      handleError(err);
      this.setState({ status: 'error' });
    }
  };

  silentlyRefetchResourceTaxonomy = async () => {
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
    const resourceTaxonomy = await this.fetchFullResource(
      this.state.resourceId,
      this.props.article.language,
    );
    this.setState({
      resourceTaxonomy,
    });
  };

  fetchFullResource = async (resourceId, language) => {
    const { resourceTypes, filters, metadata, topics } = await getFullResource(
      resourceId,
      language,
    );

    const topicConnections = await Promise.all(
      topics.map(topic => fetchTopicConnections(topic.id)),
    );
    const topicsWithConnections = topics.map((topic, index) => ({
      topicConnections: topicConnections[index],
      ...topic,
    }));

    return {
      resourceTypes,
      filter: filters,
      topics: topicsWithConnections,
      metadata,
    };
  };

  updateSubject = (subjectId, newSubject) => {
    this.setState(prevState => ({
      structure: prevState.structure.map(subject =>
        subject.id === subjectId ? { ...subject, ...newSubject } : subject,
      ),
    }));
  };

  removeConnection = id => {
    const { topics, filter } = this.state.taxonomyChanges;
    const currentConnection = topics.find(topic => topic.id === id);
    const updatedTopics = topics.filter(topic => topic.id !== id);
    const currentConnectionSubjectId = currentConnection.path.split('/')[1];
    // 1. Check if last of connection within this subject
    // 2. If so, remove filters that subject
    if (!updatedTopics.some(topic => topic.path.indexOf(currentConnectionSubjectId) !== -1)) {
      const { availableFilters } = this.state.taxonomyChoices;
      const removeFiltersFrom = availableFilters[`urn:${currentConnectionSubjectId}`];
      const updatedFilters = filter.filter(
        checkFilter =>
          removeFiltersFrom &&
          !removeFiltersFrom.some(removeFilter => removeFilter.id === checkFilter.id),
      );
      if (updatedFilters.length !== filter.length) {
        // Need to update filters
        this.stageTaxonomyChanges({
          filter: updatedFilters,
        });
      }
    }

    // Auto set primary of only one connection.
    if (updatedTopics.length === 1) {
      updatedTopics[0].primary = true;
    }
    this.stageTaxonomyChanges({
      topics: updatedTopics,
    });
  };

  updateFilter = (resourceId, filter, relevanceId, remove) => {
    let updatedFilter = filter;
    const updatedFilters = this.state.taxonomyChanges.filter.filter(modelFilter => {
      const foundFilter = modelFilter.id === filter.id;
      if (foundFilter) {
        updatedFilter = {
          ...filter,
          ...modelFilter,
        };
      }
      return !foundFilter;
    });
    if (!remove) {
      updatedFilters.push({ ...updatedFilter, relevanceId });
    }
    this.stageTaxonomyChanges({
      filter: updatedFilters,
    });
  };

  updateMetadata = visible => {
    const updatedMetadata = {};
    const metadata = this.state.resourceTaxonomy.metadata;
    updatedMetadata.grepCodes = metadata.grepCodes;
    updatedMetadata.visible = visible;
    this.stageTaxonomyChanges({
      metadata: updatedMetadata,
    });
  };

  onCancel = () => {
    const { isDirty } = this.state;
    const { setIsOpen } = this.props;
    if (!isDirty) {
      setIsOpen(false);
    } else {
      if (this.state.showWarning) {
        setIsOpen(false);
      } else {
        this.setState({ showWarning: true });
      }
    }
  };

  render() {
    const {
      taxonomyChoices: { availableResourceTypes, availableFilters, allTopics },
      taxonomyChanges: { resourceTypes, topics, filter, metadata },
      resourceId,
      structure,
      status,
      isDirty,
      showWarning,
    } = this.state;
    const filteredResourceTypes = availableResourceTypes
      .filter(rt => !blacklistedResourceTypes.includes(rt.id))
      .map(rt => ({
        ...rt,
        subtype: rt.subtypes && rt.subtypes.filter(st => !blacklistedResourceTypes.includes(st.id)),
      }));

    const { userAccess, t } = this.props;

    if (status === 'loading') {
      return <Spinner />;
    }
    if (status === 'error') {
      return (
        <ErrorMessage
          illustration={{
            url: '/Oops.gif',
            altText: t('errorMessage.title'),
          }}
          messages={{
            title: t('errorMessage.title'),
            description: t('errorMessage.taxonomy'),
          }}
        />
      );
    }

    const breadCrumbs = [];
    topics.forEach(topic => {
      if (topic.paths) {
        topic.paths.forEach(path =>
          breadCrumbs.push(retriveBreadCrumbs({ topicPath: path, allTopics, structure })),
        );
      } else {
        breadCrumbs.push(retriveBreadCrumbs({ topicPath: topic.path, allTopics, structure }));
      }
    });

    return (
      <Fragment>
        {userAccess?.includes(TAXONOMY_ADMIN_SCOPE) && resourceId && (
          <TaxonomyInfo
            taxonomyElement={{ id: resourceId, metadata: metadata }}
            updateMetadata={this.updateMetadata}
          />
        )}
        <ResourceTypeSelect
          availableResourceTypes={filteredResourceTypes}
          resourceTypes={resourceTypes}
          onChangeSelectedResource={this.onChangeSelectedResource}
        />
        <TopicConnections
          availableFilters={availableFilters}
          structure={structure}
          allTopics={allTopics}
          activeTopics={topics}
          retriveBreadCrumbs={topicPath => retriveBreadCrumbs({ topicPath, allTopics, structure })}
          removeConnection={this.removeConnection}
          setPrimaryConnection={this.setPrimaryConnection}
          stageTaxonomyChanges={this.stageTaxonomyChanges}
          getSubjectTopics={this.getSubjectTopics}
        />
        {topics.length > 0 && (
          <FilterConnections
            breadCrumbs={breadCrumbs}
            activeFilters={filter}
            structure={structure}
            availableFilters={availableFilters}
            updateFilter={this.updateFilter}
          />
        )}
        {showWarning && (
          <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>
        )}
        <Field right>
          <ActionButton outline onClick={this.onCancel} disabled={status === 'loading'}>
            {t('form.abort')}
          </ActionButton>
          <SaveButton
            isSaving={status === 'loading'}
            showSaved={status === 'success' && !isDirty}
            disabled={!isDirty || !resourceTypes.length}
            onClick={this.handleSubmit}
            defaultText="saveTax"
          />
        </Field>
      </Fragment>
    );
  }
}

LearningResourceTaxonomy.propTypes = {
  locale: PropTypes.string,
  setIsOpen: PropTypes.func,
  article: ArticleShape,
  updateNotes: PropTypes.func,
  userAccess: PropTypes.string,
};

export default injectT(LearningResourceTaxonomy);
