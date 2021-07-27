/* eslint-disable react/prop-types */
/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Taxonomy, Star } from '@ndla/icons/editor';
import { Structure } from '@ndla/editor';
import { Switch } from '@ndla/switch';
import { colors } from '@ndla/core';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { connectLinkItems, JsPlumbInstanceConnection } from '../../util/jsPlumbHelpers';
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
  fetchTopicConnections,
  updateTopicSubtopic,
  updateSubjectTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../modules/taxonomy';
import { groupTopics, getCurrentTopic } from '../../util/taxonomyHelpers';
import { fetchUserData, updateUserData } from '../../modules/draft/draftApi';
import RoundIcon from '../../components/RoundIcon';
import { REMEMBER_FAVOURITE_SUBJECTS, TAXONOMY_ADMIN_SCOPE } from '../../constants';
import Footer from '../App/components/Footer';
import { ButtonAppearance } from '../../components/Accordion/types';
import {
  SubjectTopic,
  SubjectType,
  TaxonomyElement,
  TaxonomyMetadata,
  TopicConnections,
} from '../../modules/taxonomy/taxonomyApiInterfaces';

interface Props
  extends RouteComponentProps<{ subject?: string; subtopics?: string; topic?: string }> {
  locale: string;
  userAccess?: string;
}

export const StructureContainer = ({
  locale,
  userAccess,
  match,
  location,
  history,
  t,
}: Props & tType) => {
  const [editStructureHidden, setEditStructureHidden] = useState(false);
  const [subjects, setSubjects] = useState<(SubjectType & { topics?: SubjectTopic[] })[]>([]);
  const [topics, setTopics] = useState<SubjectTopic[]>([]);
  const [jsPlumbConnections, setJsPlumbConnections] = useState<JsPlumbInstanceConnection[]>([]);
  const [activeConnections, setActiveConnections] = useState<TopicConnections[]>([]);
  const [resourcesUpdated, setResourcesUpdated] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>([]);
  const starButton = useRef<HTMLDivElement>(null);
  const resourceSection = useRef<HTMLDivElement>(null);
  const prevRouteParams = useRef<
    | {
        params: { subject?: string; subtopics?: string; topic?: string };
        location: { pathname: string };
      }
    | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const subjects = await fetchSubjects(locale);
      setSubjects(subjects.sort((a, b) => a.name?.localeCompare(b.name)));
      const { subject } = match.params;
      if (subject) {
        getSubjectTopics(subject, locale);
      }
      showLink();
      fetchFavoriteSubjects();
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
        deleteConnections();
        const currentSub = subjects.find(sub => sub.id === params.subject);
        if (currentSub) {
          getSubjectTopics(params.subject!, locale);
        }
        if (location.pathname.includes('topic')) {
          showLink();
        }
      }
      prevRouteParams.current = { params, location };
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

  const setPrimary = async (subjectId: string) => {
    const connection = activeConnections.find(conn =>
      conn.paths.some(path => path.includes(subjectId.replace('urn:', ''))),
    )!;

    if (connection.connectionId.includes('topic-subtopic')) {
      updateTopicSubtopic(connection.connectionId, {
        id: connection.targetId,
        primary: true,
      }).then(() => deleteConnections());
    } else {
      updateSubjectTopic(connection.connectionId, {
        id: connection.targetId,
        primary: true,
      }).then(() => deleteConnections());
    }
  };

  const addSubject = async (name: string) => {
    const newPath = await addSubjectApi({ name });
    getAllSubjects();
    return newPath;
  };

  const deleteConnections = () => {
    if (jsPlumbConnections.length > 0) {
      jsPlumbConnections[0].instance.deleteEveryConnection();
      setJsPlumbConnections([]);
      setActiveConnections([]);
    }
  };

  const deleteTopicLink = async (subjectId: string) => {
    const connectionToDelete = activeConnections.find(conn =>
      conn.paths.some(path => path.includes(subjectId.replace('urn:', ''))),
    )!;
    const { connectionId } = connectionToDelete;
    try {
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
      deleteConnections();
      getSubjectTopics(subjectId, locale);
    } catch (e) {
      handleError(e);
    }
  };

  const showLink = async () => {
    const paths = match.url.split('/');

    if (paths.length < 4) return;
    const topicId: string = paths.pop()!;
    const parentId = paths.pop();
    try {
      const connectionArray = await fetchTopicConnections(topicId);
      if (connectionArray.length < 2) {
        return;
      }
      const uniqueId = parentId ? `${parentId}/${topicId}` : topicId;
      const connections = await connectLinkItems(uniqueId, connectionArray, parentId, starButton);
      setJsPlumbConnections(connections);
      setActiveConnections(connectionArray);
    } catch (e) {
      handleError(e);
    }
  };

  const refreshTopics = async () => {
    if (match.params.subject) {
      getSubjectTopics(match.params.subject, locale);
    }
  };

  const toggleStructure = () => {
    setEditStructureHidden(!editStructureHidden);
  };

  const handleStructureToggle = ({ path }: { path: string }) => {
    const { url, params } = match;
    const { search } = location;
    const currentPath = url.replace('/structure/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = params.subject ? !newPath.includes(params.subject) : true; // consider this later.
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
    const localTopics = (currentTopic?.subtopics || currentSubject!.topics)!;
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

  const { params } = match;
  const topicId = params.subtopics?.split('/')?.pop() || params.topic;
  const currentTopic = getCurrentTopic({
    params,
    allTopics: topics,
  });
  const grouped = currentTopic?.metadata?.customFields['topic-resources'] || 'grouped';
  const linkViewOpen = jsPlumbConnections.length > 0;

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
            userAccess &&
            userAccess.includes(TAXONOMY_ADMIN_SCOPE) && (
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
                parent: string;
                subjectId: string;
                id: string;
                name: string;
                metadata: TaxonomyMetadata;
                isMainActive: boolean;
              }) => (
                <FolderItem
                  id={id}
                  subjectId={subjectId}
                  parent={parent}
                  pathToString={pathToString}
                  key={id}
                  name={name}
                  metadata={metadata}
                  isMainActive={isMainActive}
                  getAllSubjects={getAllSubjects}
                  refreshTopics={refreshTopics}
                  setPrimary={setPrimary}
                  deleteTopicLink={deleteTopicLink}
                  structure={subjects}
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
            <div ref={starButton}>{linkViewOpen && <RoundIcon icon={<Star />} />}</div>
          </div>
        </Accordion>
        {topicId && currentTopic && (
          <StructureResources
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

export default withRouter(injectT(StructureContainer));
