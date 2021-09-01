/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Spinner } from '@ndla/editor';
import { ErrorMessage } from '@ndla/ui';
import Field from '../../../../components/Field';
import {
  fetchResourceTypes,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
  fetchTopicConnections,
  fetchTopicResources,
  updateTaxonomy,
  fetchFullResource,
  createResource,
  getResourceId,
} from '../../../../modules/taxonomy';
import { sortByName, groupTopics } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';
import TopicConnections from '../../../../components/Taxonomy/TopicConnections';
import SaveButton from '../../../../components/SaveButton';
import { ActionButton } from '../../../FormikForm';
import ResourceTypeSelect from '../../components/ResourceTypeSelect';
import TaxonomyInfo from './taxonomy/TaxonomyInfo';
import {
  TAXONOMY_ADMIN_SCOPE,
  RESOURCE_FILTER_CORE,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../../../constants';
import { FormikFieldHelp } from '../../../../components/FormikField';
import {
  TaxonomyMetadata,
  Topic,
  ResourceType,
  ResourceResourceType,
  SubjectType,
  ParentTopic,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { ConvertedDraftType, LocaleType } from '../../../../interfaces';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

const emptyTaxonomy = {
  resourceTypes: [],
  topics: [],
  metadata: undefined,
};

interface FullResource {
  name: string;
  resourceTypes: ResourceResourceType[];
  topics: ParentTopic[];
  metadata?: TaxonomyMetadata;
}

type Props = {
  article: Partial<ConvertedDraftType>;
  updateNotes: Function; // TODO:
  locale: LocaleType;
  setIsOpen?: (open: boolean) => void;
  userAccess?: string;
} & WithTranslation;

interface State {
  resourceId: string;
  structure: SubjectType[];
  status: string;
  isDirty: boolean;

  resourceTaxonomy: {
    resourceTypes: ResourceResourceType[];
    topics: ParentTopic[];
    name?: string;
    metadata?: TaxonomyMetadata;
  };
  taxonomyChanges: {
    resourceTypes: Partial<ResourceResourceType>[];
    topics: (ParentTopic & { paths?: string[] })[];
    metadata?: TaxonomyMetadata;
  };

  taxonomyChoices: {
    allTopics: Topic[];
    availableResourceTypes: ResourceType[];
  };
  showWarning: boolean;
}

class LearningResourceTaxonomy extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
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
        allTopics: [],
        availableResourceTypes: [],
      },
      showWarning: false,
    };
  }

  componentDidMount() {
    this.fetchTaxonomy();
    this.fetchTaxonomyChoices();
  }

  componentDidUpdate({ article: { id: prevId } }: Props, prevState: State) {
    // We need to refresh taxonomy for when an article URL has been pasted and a new article is showing
    if (prevId !== this.props.article.id) {
      this.fetchTaxonomy();
    }
  }

  onChangeSelectedResource = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      taxonomyChoices: { availableResourceTypes },
    } = this.state;
    const options = evt.target?.value?.split(',');
    const selectedResource = availableResourceTypes.find(
      resourceType => resourceType.id === options[0],
    );

    if (selectedResource) {
      const resourceTypes: {
        id?: string;
        name?: string;
        parentId?: string;
      }[] = [
        {
          name: selectedResource.name,
          id: selectedResource.id,
        },
      ];

      if (options.length > 1) {
        const subType = selectedResource.subtypes.find(subtype => subtype.id === options[1]);
        if (subType)
          resourceTypes.push({
            id: subType.id,
            name: subType.name,
            parentId: selectedResource.id,
          });
      }

      this.stageTaxonomyChanges({ resourceTypes });
    }
  };

  getSubjectTopics = async (subjectid: string) => {
    if (this.state.structure.some((subject: any) => subject.id === subjectid && subject.topics)) {
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

  setPrimaryConnection = (id: string) => {
    const { topics } = this.state.taxonomyChanges;

    this.stageTaxonomyChanges({
      topics: topics?.map(topic => ({
        ...topic,
        primary: topic.id === id,
      })),
    });
  };

  setRelevance = (topicId: string, relevanceId: string) => {
    const { topics } = this.state.taxonomyChanges;

    this.stageTaxonomyChanges({
      topics: topics?.map(topic => ({
        ...topic,
        ...(topic.id === topicId && {
          relevanceId,
        }),
      })),
    });
  };

  fetchTaxonomy = async () => {
    const {
      article: { language, id },
    } = this.props;
    if (!language || !id) return;

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
        this.setState(() => ({
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
    if (!language) return;
    try {
      const [allResourceTypes, allTopics, subjects] = await Promise.all([
        fetchResourceTypes(language),
        fetchTopics(language),
        fetchSubjects(language),
      ]);

      const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);

      if (this.state.status !== 'error') {
        this.setState({
          taxonomyChoices: {
            availableResourceTypes: allResourceTypes.filter(resourceType => resourceType.name),
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

  stageTaxonomyChanges = (properties: Partial<State['taxonomyChanges']>) => {
    this.setState(prevState => ({
      isDirty: true,
      taxonomyChanges: {
        ...prevState.taxonomyChanges,
        ...properties,
      },
    }));
  };

  handleSubmit = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const { resourceTaxonomy, taxonomyChanges, resourceId } = this.state;
    let reassignedResourceId = resourceId;
    const {
      updateNotes,
      article: { language, id, title, revision },
    } = this.props;
    if (!language || !id) return;
    this.setState({ status: 'loading' });
    try {
      if (!reassignedResourceId) {
        await createResource({
          contentUri: `urn:article:${id}`,
          name: title ?? '',
        });
        reassignedResourceId = await getResourceId({ id, language });
        this.setState({
          resourceId: reassignedResourceId,
        });
      }
      if (reassignedResourceId) {
        // @ts-ignore TODO: denne må du fikse jonas
        await updateTaxonomy(reassignedResourceId, resourceTaxonomy, taxonomyChanges);
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
      this.props.article.language ?? '',
    );
    this.setState({
      resourceTaxonomy,
    });
  };

  fetchFullResource = async (resourceId: string, language: string): Promise<FullResource> => {
    const { resourceTypes, metadata, parentTopics, name } = await fetchFullResource(
      resourceId,
      language,
    );
    const sortedParents = parentTopics.filter(pt => pt.path).sort((a, b) => (a.id < b.id ? -1 : 1));

    const topicConnections = await Promise.all(
      sortedParents.map(topic => fetchTopicConnections(topic.id)),
    );
    const topicResources = await Promise.all(
      sortedParents.map(topic => fetchTopicResources(topic.id)),
    );
    const topicsWithConnectionsAndRelevanceId = sortedParents.map((topic, index) => {
      const foundRelevanceId = topicResources[index]?.find(resource => resource.id === resourceId)
        ?.relevanceId;
      return {
        topicConnections: topicConnections[index],
        relevanceId: foundRelevanceId ?? RESOURCE_FILTER_CORE,
        ...topic,
      };
    });

    return {
      name,
      resourceTypes,
      topics: topicsWithConnectionsAndRelevanceId,
      metadata,
    };
  };

  updateSubject = (subjectId: string, newSubject: any) => {
    this.setState(prevState => ({
      structure: prevState.structure.map(subject =>
        subject.id === subjectId ? { ...subject, ...newSubject } : subject,
      ),
    }));
  };

  removeConnection = (id: string) => {
    const { topics } = this.state.taxonomyChanges;
    const updatedTopics = topics?.filter(topic => topic.id !== id);

    // Auto set primary of only one connection.
    if (updatedTopics?.length === 1) {
      updatedTopics[0].primary = true;
    }
    this.stageTaxonomyChanges({
      topics: updatedTopics,
    });
  };

  updateMetadata = (visible: boolean) => {
    const metadata = this.state.resourceTaxonomy.metadata;
    this.stageTaxonomyChanges({
      metadata: {
        customFields: {},
        grepCodes: metadata?.grepCodes ?? [],
        visible,
      },
    });
  };

  onCancel = () => {
    const { isDirty } = this.state;
    const { setIsOpen } = this.props;
    if (!isDirty) {
      setIsOpen?.(false);
    } else {
      if (this.state.showWarning) {
        setIsOpen?.(false);
      } else {
        this.setState({ showWarning: true });
      }
    }
  };

  render() {
    const {
      taxonomyChoices: { availableResourceTypes, allTopics },
      taxonomyChanges: { resourceTypes, topics, metadata },
      resourceId,
      resourceTaxonomy,
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
            back: t('errorMessage.back'),
            goToFrontPage: t('errorMessage.goToFrontPage'),
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
            taxonomyElement={{
              id: resourceId,
              name: resourceTaxonomy.name ?? '',
              metadata: metadata,
            }}
            updateMetadata={this.updateMetadata}
          />
        )}
        <ResourceTypeSelect
          availableResourceTypes={filteredResourceTypes}
          resourceTypes={resourceTypes}
          onChangeSelectedResource={this.onChangeSelectedResource}
        />
        <TopicConnections
          structure={structure}
          allTopics={allTopics}
          // @ts-ignore TODO:
          activeTopics={topics}
          retriveBreadCrumbs={topicPath => retriveBreadCrumbs({ topicPath, allTopics, structure })}
          removeConnection={this.removeConnection}
          setPrimaryConnection={this.setPrimaryConnection}
          setRelevance={this.setRelevance}
          stageTaxonomyChanges={this.stageTaxonomyChanges}
          getSubjectTopics={this.getSubjectTopics}
          allowMultipleSubjectsOpen={false}
          onChangeShowFavorites={() => {}}
        />
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
            formIsDirty={isDirty}
          />
        </Field>
      </Fragment>
    );
  }
}

export default withTranslation()(LearningResourceTaxonomy);
