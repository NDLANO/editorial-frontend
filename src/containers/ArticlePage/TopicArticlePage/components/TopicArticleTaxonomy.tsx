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
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
  queryTopics,
  fetchTopicConnections,
  addTopicToTopic,
  addSubjectTopic,
  addTopic,
  fetchResourceTypes,
} from '../../../../modules/taxonomy';
import { sortByName, groupTopics, pathToUrnArray } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';
import SaveButton from '../../../../components/SaveButton';
import { ActionButton } from '../../../FormikForm';
import TopicArticleConnections from './TopicArticleConnections';

import { FormikFieldHelp } from '../../../../components/FormikField';
import { LocaleType } from '../../../../interfaces';
import {
  ResourceType,
  SubjectTopic,
  SubjectType,
  TaxonomyElement,
  TaxonomyMetadata,
  Topic,
  TopicConnections,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';

type Props = {
  article: any;
  setIsOpen?: (open: boolean) => void;
  locale: LocaleType;
  updateNotes: Function;
  userAccess?: string;
} & WithTranslation;

interface StructureSubject extends SubjectType {
  topics?: SubjectTopic[];
}

export interface StagedTopic extends TaxonomyElement {
  id: string;
  name: string;
  path: string;
  paths?: string[];
  topicConnections?: TopicConnections[];
  primary?: boolean;
  relevanceId?: string;
  isPrimary?: boolean;
  metadata: TaxonomyMetadata;
}

interface State {
  structure: StructureSubject[];
  status: string;
  isDirty: boolean;
  stagedTopicChanges: StagedTopic[];
  taxonomyChoices: {
    allTopics: SubjectTopic[] | Topic[];
    availableResourceTypes?: ResourceType[];
  };
  showWarning: boolean;
}

class TopicArticleTaxonomy extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      structure: [],
      status: 'loading',
      isDirty: false,
      stagedTopicChanges: [],
      taxonomyChoices: {
        allTopics: [],
      },
      showWarning: false,
    };
  }

  componentDidMount() {
    this.fetchTaxonomy();
  }

  componentDidUpdate({ article: { id: prevId } }: Props, prevState: State) {
    // We need to refresh taxonomy for when an article URL has been pasted and a new article is showing
    if (prevId !== this.props.article.id) {
      this.fetchTaxonomy();
    }
  }

  getSubjectTopics = async (subjectId: string, locale: LocaleType) => {
    if (this.state.structure.some(subject => subject.id === subjectId && subject.topics)) {
      return;
    }
    try {
      this.updateSubject(subjectId);
      const allTopics = await fetchSubjectTopics(subjectId, locale);
      const groupedTopics = groupTopics(allTopics);
      this.updateSubject(subjectId, { topics: groupedTopics });
    } catch (e) {
      handleError(e);
    }
  };

  fetchTaxonomy = async () => {
    const {
      article: { language, id },
    } = this.props;
    try {
      const [topics, allTopics, subjects, allResourceTypes] = await Promise.all([
        queryTopics(id, language),
        fetchTopics(language),
        fetchSubjects(language),
        fetchResourceTypes(language),
      ]);

      const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);
      const activeTopics = topics.filter(t => t.path);
      const sortedTopics = activeTopics.sort((a, b) => (a.id < b.id ? -1 : 1));

      const topicConnections = await Promise.all(
        sortedTopics.map(topic => fetchTopicConnections(topic.id)),
      );

      const topicsWithConnections = sortedTopics.map((topic, index) => ({
        topicConnections: topicConnections[index],
        ...topic,
      }));

      this.setState({
        status: 'initial',
        stagedTopicChanges: topicsWithConnections,
        structure: sortedSubjects,
        taxonomyChoices: {
          availableResourceTypes: allResourceTypes.filter(resourceType => resourceType.name),
          allTopics: allTopics.filter(topic => topic.name),
        },
      });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
    }
  };

  stageTaxonomyChanges = ({ path }: { path: string }) => {
    if (path) {
      const newTopic: StagedTopic = {
        id: 'staged',
        name: this.props.article.title,
        path: `${path}/staged`,
        metadata: {
          grepCodes: [],
          visible: true,
          customFields: {},
        },
      };

      this.setState(prevState => ({
        isDirty: true,
        stagedTopicChanges: [...prevState.stagedTopicChanges, newTopic],
      }));
    }
  };

  addNewTopic = async (stagedNewTopics: StagedTopic[]) => {
    const { stagedTopicChanges } = this.state;
    const existingTopics = stagedTopicChanges.filter(t => !stagedNewTopics.includes(t));
    const {
      article: { id: articleId },
    } = this.props;
    const newTopics = await Promise.all(
      stagedNewTopics.map(topic => this.createAndPlaceTopic(topic, articleId)),
    );
    this.setState({
      isDirty: false,
      stagedTopicChanges: [...existingTopics, ...newTopics],
      status: 'success',
    });
  };

  handleSubmit = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const {
      updateNotes,
      article: { id: articleId, language, revision },
    } = this.props;
    this.setState({ status: 'loading' });

    const stagedNewTopics = this.state.stagedTopicChanges.filter(topic => topic.id === 'staged');
    try {
      if (stagedNewTopics.length > 0) {
        await this.addNewTopic(stagedNewTopics);
      }
      updateNotes({
        id: articleId,
        revision,
        language,
        notes: ['Oppdatert taksonomi.'],
      });
    } catch (err) {
      handleError(err);
      this.setState({ status: 'error' });
    }
  };

  updateSubject = (subjectid: string, newSubject?: Partial<StructureSubject>) => {
    this.setState(prevState => ({
      structure: prevState.structure.map(subject => {
        if (subject.id === subjectid) {
          return { ...subject, ...newSubject };
        }
        return subject;
      }),
    }));
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

  createAndPlaceTopic = async (topic: StagedTopic, articleId: number): Promise<StagedTopic> => {
    const newTopicPath = await addTopic({
      name: topic.name,
      contentUri: `urn:article:${articleId}`,
    });

    const paths = pathToUrnArray(topic.path);
    const newTopicId = newTopicPath.split('/').pop() ?? '';

    if (paths.length > 2) {
      // we are placing it under a topic
      const parentTopicId = paths.slice(-2)[0];
      await addTopicToTopic({
        subtopicid: newTopicId,
        topicid: parentTopicId,
      });
    } else {
      // we are placing it under a subject
      await addSubjectTopic({
        topicid: newTopicId,
        subjectid: paths[0],
      });
    }
    return {
      name: topic.name,
      id: newTopicId,
      path: topic.path.replace('staged', newTopicId.replace('urn:', '')),
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
    };
  };

  render() {
    const {
      taxonomyChoices: { allTopics },
      stagedTopicChanges,
      structure,
      status,
      isDirty,
      showWarning,
    } = this.state;
    const {
      t,
      article: { title },
      locale,
    } = this.props;

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
    stagedTopicChanges.forEach(topic => {
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
        <TopicArticleConnections
          structure={structure}
          activeTopics={this.state.stagedTopicChanges}
          retriveBreadCrumbs={topicPath =>
            retriveBreadCrumbs({ topicPath, allTopics, structure, title })
          }
          locale={locale}
          getSubjectTopics={this.getSubjectTopics}
          stageTaxonomyChanges={this.stageTaxonomyChanges}
        />
        {showWarning && (
          <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>
        )}
        <Field right>
          <ActionButton outline onClick={this.onCancel} disabled={status === 'loading'}>
            {t('form.abort')}
          </ActionButton>
          <SaveButton
            formIsDirty={isDirty}
            isSaving={status === 'loading'}
            showSaved={status === 'success' && !isDirty}
            disabled={!isDirty}
            onClick={this.handleSubmit}
            defaultText="saveTax"
          />
        </Field>
      </Fragment>
    );
  }
}

export default withTranslation()(TopicArticleTaxonomy);
