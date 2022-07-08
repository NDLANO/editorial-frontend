/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, Component, MouseEvent } from 'react';

import { withTranslation, CustomWithTranslation } from 'react-i18next';
import { Spinner } from '@ndla/icons';
import { ErrorMessage } from '@ndla/ui';
import { IUpdatedArticle, IArticle } from '@ndla/types-draft-api';
import Field from '../../../../components/Field';
import {
  fetchResourceTypes,
  fetchSubjects,
  fetchSubjectTopics,
  fetchTopicConnections,
  fetchTopicResources,
  updateTaxonomy,
  fetchFullResource,
  createResource,
  getResourceId,
} from '../../../../modules/taxonomy';
import { sortByName, groupTopics, getBreadcrumbFromPath } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
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
  ResourceType,
  ResourceResourceType,
  SubjectType,
  SubjectTopic,
  ParentTopicWithRelevanceAndConnections,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../../interfaces';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { SessionProps } from '../../../Session/SessionProvider';
import withSession from '../../../Session/withSession';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

const emptyTaxonomy = {
  resourceTypes: [],
  topics: [],
  metadata: undefined,
};

interface FullResource {
  name: string;
  resourceTypes: ResourceResourceType[];
  topics: ParentTopicWithRelevanceAndConnections[];
  metadata?: TaxonomyMetadata;
}

type Props = {
  article: IArticle;
  taxonomy: ArticleTaxonomy;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  setIsOpen?: (open: boolean) => void;
  taxonomyVersion: string;
} & CustomWithTranslation &
  SessionProps;

interface LearningResourceSubjectType extends SubjectType {
  topics?: SubjectTopic[];
}

interface State {
  resourceId: string;
  structure: LearningResourceSubjectType[];
  status: string;
  isDirty: boolean;

  resourceTaxonomy: {
    resourceTypes: ResourceResourceType[];
    topics: ParentTopicWithRelevanceAndConnections[];
    id?: string;
    name?: string;
    metadata?: TaxonomyMetadata;
  };
  taxonomyChanges: {
    resourceTypes: ResourceResourceType[];
    topics: ParentTopicWithRelevanceAndConnections[];
    metadata?: TaxonomyMetadata;
  };

  taxonomyChoices: {
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

  onChangeSelectedResource = (evt: FormEvent<HTMLSelectElement>) => {
    const {
      taxonomyChoices: { availableResourceTypes },
    } = this.state;
    const options = evt.currentTarget?.value?.split(',');
    const selectedResource = availableResourceTypes.find(
      resourceType => resourceType.id === options[0],
    );

    if (selectedResource) {
      const resourceTypes: ResourceResourceType[] = [
        {
          name: selectedResource.name,
          id: selectedResource.id,
          parentId: '',
          connectionId: '',
        },
      ];

      if (options.length > 1) {
        const subType = selectedResource.subtypes?.find(subtype => subtype.id === options[1]);
        if (subType)
          resourceTypes.push({
            id: subType.id,
            name: subType.name,
            parentId: selectedResource.id,
            connectionId: '',
          });
      }

      this.stageTaxonomyChanges({ resourceTypes });
    }
  };

  getSubjectTopics = async (subjectid: string) => {
    if (this.state.structure.some(subject => subject.id === subjectid && subject.topics)) {
      return;
    }
    try {
      const { taxonomyVersion } = this.props;
      const allTopics = await fetchSubjectTopics({
        subject: subjectid,
        language: this.props.i18n.language,
        taxonomyVersion,
      });
      const groupedTopics = groupTopics(allTopics);
      this.updateSubject(subjectid, { topics: groupedTopics });
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
      article: { id },
      i18n,
      taxonomy,
    } = this.props;
    if (!id) return;

    try {
      const resourceId = taxonomy.resources.length === 1 && taxonomy.resources[0].id;

      if (taxonomy.resources.length > 1) {
        this.setState({ status: 'error' });
      } else if (resourceId) {
        const fullResource = await this.fetchFullResource(resourceId, i18n.language);

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
    const { i18n, taxonomyVersion } = this.props;
    try {
      const [allResourceTypes, subjects] = await Promise.all([
        fetchResourceTypes({ language: i18n.language, taxonomyVersion }),
        fetchSubjects({ language: i18n.language, taxonomyVersion }),
      ]);

      const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);

      if (this.state.status !== 'error') {
        this.setState({
          taxonomyChoices: {
            availableResourceTypes: allResourceTypes.filter(resourceType => resourceType.name),
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

  handleSubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const { taxonomyVersion } = this.props;
    const { resourceTaxonomy, taxonomyChanges, resourceId } = this.state;
    let reassignedResourceId = resourceId;
    const {
      updateNotes,
      article: { id, title, revision },
    } = this.props;
    if (!title?.language || !id) return;
    this.setState({ status: 'loading' });
    try {
      if (!reassignedResourceId) {
        await createResource({
          body: { contentUri: `urn:article:${id}`, name: title.title },
          taxonomyVersion,
        });
        reassignedResourceId = await getResourceId({
          id,
          language: title.language,
          taxonomyVersion,
        });
        this.setState({
          resourceId: reassignedResourceId,
        });
      }
      if (reassignedResourceId) {
        await updateTaxonomy({
          resourceId: reassignedResourceId,
          resourceTaxonomy,
          taxonomyChanges,
          taxonomyVersion,
        });
        updateNotes({
          revision: revision ?? 0,
          language: title.language,
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
      this.props.i18n.language ?? '',
    );
    this.setState({
      resourceTaxonomy,
    });
  };

  fetchFullResource = async (resourceId: string, locale: LocaleType): Promise<FullResource> => {
    const { taxonomyVersion } = this.props;
    const { resourceTypes, metadata, parentTopics, name } = await fetchFullResource({
      id: resourceId,
      language: locale,
      taxonomyVersion,
    });
    const sortedParents = parentTopics.filter(pt => pt.path).sort((a, b) => (a.id < b.id ? -1 : 1));

    const topicConnections = await Promise.all(
      sortedParents.map(topic => fetchTopicConnections({ id: topic.id, taxonomyVersion })),
    );
    const topicResources = await Promise.all(
      sortedParents.map(topic => fetchTopicResources({ topicUrn: topic.id, taxonomyVersion })),
    );
    const topicsWithConnectionsAndRelevanceId = sortedParents.map(async (topic, index) => {
      const foundRelevanceId = topicResources[index]?.find(resource => resource.id === resourceId)
        ?.relevanceId;
      const breadcrumb = await getBreadcrumbFromPath(topic.path, taxonomyVersion, locale);
      return {
        ...topic,
        topicConnections: topicConnections[index],
        relevanceId: foundRelevanceId ?? RESOURCE_FILTER_CORE,
        breadcrumb,
      };
    });
    const topics = await Promise.all(topicsWithConnectionsAndRelevanceId);

    return {
      name,
      resourceTypes,
      topics,
      metadata,
    };
  };

  updateSubject = (subjectId: string, newSubject: Partial<LearningResourceSubjectType>) => {
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
      taxonomyChoices,
      taxonomyChanges,
      structure,
      status,
      isDirty,
      showWarning,
      resourceId,
    } = this.state;
    const filteredResourceTypes = taxonomyChoices.availableResourceTypes
      .filter(rt => !blacklistedResourceTypes.includes(rt.id))
      .map(rt => ({
        ...rt,
        subtype: rt.subtypes && rt.subtypes.filter(st => !blacklistedResourceTypes.includes(st.id)),
      }));

    const { userPermissions, t, article } = this.props;

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

    const mainResource = this.props.taxonomy.resources?.[0];
    const mainEntity = mainResource && {
      id: mainResource.id,
      name: mainResource.name,
      metadata: taxonomyChanges.metadata,
    };

    const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

    return (
      <>
        {isTaxonomyAdmin && (
          <TaxonomyConnectionErrors
            articleType={article.articleType ?? 'standard'}
            taxonomy={this.props.taxonomy}
          />
        )}
        {isTaxonomyAdmin && resourceId && (
          <TaxonomyInfo taxonomyElement={mainEntity} updateMetadata={this.updateMetadata} />
        )}
        <ResourceTypeSelect
          availableResourceTypes={filteredResourceTypes}
          resourceTypes={taxonomyChanges.resourceTypes}
          onChangeSelectedResource={this.onChangeSelectedResource}
        />
        <TopicConnections
          structure={structure}
          activeTopics={taxonomyChanges.topics}
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
            disabled={!isDirty || !taxonomyChanges.resourceTypes.length}
            onClick={this.handleSubmit}
            defaultText="saveTax"
            formIsDirty={isDirty}
          />
        </Field>
      </>
    );
  }
}

export default withTranslation()(withSession(LearningResourceTaxonomy));
