/* eslint-disable react/prop-types */
/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OneColumn } from '@ndla/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Taxonomy } from '@ndla/icons/editor';
import { Structure } from '@ndla/editor';
import { Switch } from '@ndla/switch';
import { colors } from '@ndla/core';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import handleError from '../../util/handleError';
import StructureResources from './resourceComponents/StructureResources';
import FolderItem from './folderComponents/FolderItem';
import { removeLastItemFromUrl, getPathsFromUrl } from '../../util/routeHelpers';
import InlineAddButton from '../../components/InlineAddButton';
import Accordion from '../../components/Accordion';
import ErrorBoundary from '../../components/ErrorBoundary';
import {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject as addSubjectApi,
  updateTopicSubtopic,
  updateSubjectTopic,
} from '../../modules/taxonomy';
import { groupTopics, getCurrentTopic, getSubtopics } from '../../util/taxonomyHelpers';
import { fetchUserData, updateUserData } from '../../modules/draft/draftApi';
import { REMEMBER_FAVOURITE_SUBJECTS, TAXONOMY_ADMIN_SCOPE } from '../../constants';
import Footer from '../App/components/Footer';
import { ButtonAppearance } from '../../components/Accordion/types';
import {
  SubjectTopic,
  SubjectType,
  TaxonomyElement,
  TaxonomyMetadata,
} from '../../modules/taxonomy/taxonomyApiInterfaces';
import { UserAccessContext } from '../App/App';
import StructureErrorIcon from './folderComponents/StructureErrorIcon';

interface Props extends RouteComponentProps<StructureRouteParams> {}

export interface StructureRouteParams {
  subject?: string;
  subtopics?: string;
  topic?: string;
}

interface RouteProps {
  params: StructureRouteParams;
  location: { pathname: string };
}

export const StructureContainer = ({ match, location, history }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const userAccess = useContext(UserAccessContext);
  const [editStructureHidden, setEditStructureHidden] = useState(false);
  const [subjects, setSubjects] = useState<(SubjectType & { topics?: SubjectTopic[] })[]>([]);
  const [topics, setTopics] = useState<SubjectTopic[]>([]);
  const [resourcesUpdated, setResourcesUpdated] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const resourceSection = useRef<HTMLDivElement>(null);
  const prevRouteParams = useRef<RouteProps | undefined>(undefined);

  const { params } = match;
  const topicId = params.subtopics?.split('/')?.pop() || params.topic;
  const currentTopic = getCurrentTopic({
    params,
    allTopics: topics,
  });
  const grouped = currentTopic?.metadata?.customFields['topic-resources'] || 'grouped';

  useEffect(() => {
    (async () => {
      const subjects = await fetchSubjects(locale);
      setSubjects(subjects.sort((a, b) => a.name?.localeCompare(b.name)));
      const { subject } = match.params;
      if (subject) {
        getSubjectTopics(subject, locale);
      }
      await fetchFavoriteSubjects();
      const shouldShowFavorites = window.localStorage.getItem(REMEMBER_FAVOURITE_SUBJECTS);
      setShowFavorites(shouldShowFavorites === 'true');
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    (async () => {
      if (!prevRouteParams.current) {
        prevRouteParams.current = { params, location };
        return;
      }
      if (location.pathname !== prevRouteParams.current!.location.pathname) {
        prevRouteParams.current = { params, location };
        const currentSub = subjects.find(sub => sub.id === params.subject);
        if (currentSub) {
          await getSubjectTopics(params.subject!, locale);
        }
      }
    })();
  });

  const getAllSubjects = async () => {
    try {
      const subjects = await fetchSubjects(locale);
      setSubjects(subjects.sort((a, b) => a.name?.localeCompare(b.name)));
    } catch (e) {
      handleError(e);
    }
  };

  const getSubjectTopics = async (subjectid: string, locale: string) => {
    try {
      saveSubjectItems(subjectid, { loading: true });
      const allTopics = await fetchSubjectTopics(subjectid, locale);
      setTopics(allTopics);
      const topics = groupTopics(allTopics);
      saveSubjectItems(subjectid, { topics, loading: false });
    } catch (e) {
      handleError(e);
    }
  };

  const saveSubjectItems = (
    subjectid: string,
    saveItems: { topics?: SubjectTopic[]; loading?: boolean; metadata?: TaxonomyMetadata },
  ) => {
    setSubjects(prevSubjects => {
      return prevSubjects.map(subject => {
        if (subject.id === subjectid) {
          return {
            ...subject,
            ...saveItems,
          };
        }
        return subject;
      });
    });
  };

  const saveSubjectTopicItems = (topicId: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => {
    setTopics(prevTopics =>
      prevTopics.map(topic => (topic.id === topicId ? { ...topic, ...saveItems } : topic)),
    );
  };

  const addSubject = async (name: string) => {
    const newPath = await addSubjectApi({ name });
    getAllSubjects();
    return newPath;
  };

  const refreshTopics = async () => {
    if (match.params.subject) {
      getSubjectTopics(match.params.subject, locale);
    }
  };

  const toggleStructure = () => {
    setEditStructureHidden(!editStructureHidden);
  };

  const handleStructureToggle = (input: { path: string }) => {
    const { path } = input;
    const { url, params } = match;
    const { search } = location;
    const currentPath = url.replace('/structure/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.subject && !newPath.includes(params.subject);
    history.push(`/structure/${newPath.concat(deleteSearch ? '' : search)}`);
  };

  const onDragEnd = async ({ draggableId, source, destination }: DropResult) => {
    if (!destination) {
      return;
    }
    const { params } = match;
    const currentSubject = subjects.find(sub => sub.id === params.subject);

    const currentTopic = getCurrentTopic({
      params,
      allTopics: topics,
    });
    const localTopics = (currentTopic?.id
      ? getSubtopics(currentTopic.id, topics)
      : currentSubject?.topics)!;
    const currentRank = localTopics[source.index].rank;
    const destinationRank = topics[destination.index].rank;
    const newRank = currentRank > destinationRank ? destinationRank : destinationRank + 1;
    if (currentRank === destinationRank) return;
    saveSubjectItems(params.subject!, { loading: true });

    if (draggableId.includes('topic-subtopic')) {
      await updateTopicSubtopic(draggableId, {
        rank: newRank,
      });
    } else {
      await updateSubjectTopic(draggableId, { rank: newRank });
    }
    refreshTopics();
  };

  const toggleFavorite = (subjectId: string) => {
    let updatedFavorites;
    const favSubjects = favoriteSubjects;
    if (favSubjects.includes(subjectId)) {
      updatedFavorites = favSubjects.filter(s => s !== subjectId);
    } else {
      updatedFavorites = [...favSubjects, subjectId];
    }
    setFavoriteSubjects(updatedFavorites);
    updateUserData({ favoriteSubjects: updatedFavorites });
  };

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favSubjects = result.favoriteSubjects || [];
    setFavoriteSubjects(favSubjects);
  };

  const getFavoriteSubjects = (subjects: SubjectType[], favoriteSubjectIds: string[]) => {
    return subjects.filter(e => favoriteSubjectIds.includes(e.id));
  };

  const toggleShowFavorites = () => {
    window.localStorage.setItem(REMEMBER_FAVOURITE_SUBJECTS, (!showFavorites).toString());
    setShowFavorites(!showFavorites);
  };

  const isTaxonomyAdmin = userAccess?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ErrorBoundary>
      <OneColumn>
        <Accordion
          handleToggle={toggleStructure}
          header={
            <>
              <Taxonomy className="c-icon--medium" />
              {t('taxonomy.editStructure')}
            </>
          }
          appearance={ButtonAppearance.TAXONOMY}
          addButton={
            isTaxonomyAdmin && (
              <InlineAddButton title={t('taxonomy.addSubject')} action={addSubject} />
            )
          }
          toggleSwitch={
            <Switch
              onChange={toggleShowFavorites}
              checked={showFavorites}
              label={t('taxonomy.favorites')}
              id={'favorites'}
              // @ts-ignore
              style={{ color: colors.white, width: '15.2em' }}
            />
          }
          hidden={editStructureHidden}>
          <div id="plumbContainer">
            <Structure
              DND
              onDragEnd={onDragEnd}
              openedPaths={getPathsFromUrl(match.url)}
              structure={showFavorites ? getFavoriteSubjects(subjects, favoriteSubjects) : subjects}
              toggleOpen={handleStructureToggle}
              highlightMainActive
              toggleFavorite={toggleFavorite}
              favoriteSubjectIds={favoriteSubjects}
              renderBeforeTitles={isTaxonomyAdmin ? StructureErrorIcon : undefined}
              renderListItems={({
                pathToString,
                parent,
                subjectId,
                id,
                name,
                metadata,
                isMainActive,
              }: {
                pathToString: string;
                parent?: string;
                subjectId: string;
                id: string;
                name: string;
                metadata: TaxonomyMetadata;
                isMainActive: boolean;
              }) => (
                <FolderItem
                  id={id}
                  subjectId={subjectId}
                  parent={parent || ''}
                  pathToString={pathToString}
                  key={id}
                  name={name}
                  metadata={metadata}
                  isMainActive={isMainActive}
                  getAllSubjects={getAllSubjects}
                  refreshTopics={refreshTopics}
                  structure={subjects}
                  resourcesLoading={resourcesLoading}
                  jumpToResources={() =>
                    resourceSection && resourceSection.current?.scrollIntoView()
                  }
                  locale={locale}
                  userAccess={userAccess}
                  setResourcesUpdated={setResourcesUpdated}
                  saveSubjectItems={saveSubjectItems}
                  saveSubjectTopicItems={saveSubjectTopicItems}
                />
              )}
            />
          </div>
        </Accordion>
        {topicId && currentTopic && (
          <StructureResources
            setResourcesLoading={setResourcesLoading}
            locale={locale}
            params={params}
            resourceRef={resourceSection}
            currentTopic={currentTopic}
            refreshTopics={refreshTopics}
            saveSubjectTopicItems={saveSubjectTopicItems}
            resourcesUpdated={resourcesUpdated}
            setResourcesUpdated={setResourcesUpdated}
            grouped={grouped}
          />
        )}
      </OneColumn>
      <Footer showLocaleSelector />
    </ErrorBoundary>
  );
};

export default withRouter(StructureContainer);
