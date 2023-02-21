/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
//@ts-ignore
import { Structure } from '@ndla/editor';
import { FieldHeader } from '@ndla/forms';
import { Switch } from '@ndla/switch';
import { colors } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { fetchUserData } from '../../modules/draft/draftApi';
import { fetchTopic, fetchTopicConnections } from '../../modules/taxonomy';
import ActiveTopicConnections from './ActiveTopicConnections';
import HowToHelper from '../HowTo/HowToHelper';
import StructureButtons from '../../containers/ArticlePage/LearningResourcePage/components/taxonomy/StructureButtons';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { StagedTopic } from '../../containers/ArticlePage/TopicArticlePage/components/TopicArticleTaxonomy';
import { getBreadcrumbFromPath } from '../../util/taxonomyHelpers';
import { LocaleType } from '../../interfaces';
import { useTaxonomyVersion } from '../../containers/StructureVersion/TaxonomyVersionProvider';

const StyledTitleModal = styled('h1')`
  color: ${colors.text.primary};
`;

const ModalTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface Props {
  structure: SubjectType[];
  activeTopics: StagedTopic[];
  onChangeShowFavorites: () => void;
  // showFavorites: boolean;
  removeConnection: (id: string) => void;
  setPrimaryConnection: (id: string) => void;
  allowMultipleSubjectsOpen: boolean;
  stageTaxonomyChanges: (properties: any) => void;
  getSubjectTopics: (subjectId: string) => Promise<void>;
  setRelevance: (topicId: string, relevanceId: string) => void;
}

const TopicConnections = ({
  structure,
  activeTopics,
  onChangeShowFavorites,
  // showFavorites,
  removeConnection,
  setPrimaryConnection,
  allowMultipleSubjectsOpen,
  stageTaxonomyChanges,
  getSubjectTopics,
  setRelevance,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);

  useEffect(() => {
    fetchFavoriteSubjects();
  }, []);

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
    setShowFavorites(favoriteSubjects.length > 0);
  };

  const getFavoriteSubjects = (subjects: SubjectType[], favoriteSubjectIds: string[]) =>
    subjects.filter(e => favoriteSubjectIds.includes(e.id));

  const handleOpenToggle = ({
    path,
    isSubject,
    id,
  }: {
    path: string;
    isSubject: Boolean;
    id: string;
  }) => {
    let paths = [...openedPaths];
    const index = paths.indexOf(path);
    if (index === -1) {
      // Has other subjects open and !allowMultipleSubjectsOpen?
      if (isSubject) {
        getSubjectTopics(id);
        if (!allowMultipleSubjectsOpen) {
          paths = [];
        }
      }
      paths.push(path);
    } else {
      paths.splice(index, 1);
    }
    setOpenedPaths(paths);
  };

  const addTopic = async (id: string | undefined, closeModal: () => void, locale?: LocaleType) => {
    if (id) {
      const topicToAdd = await fetchTopic({ id, taxonomyVersion });
      const topicConnections = await fetchTopicConnections({ id: topicToAdd.id, taxonomyVersion });
      const breadcrumb = await getBreadcrumbFromPath(topicToAdd.path, taxonomyVersion, locale);
      stageTaxonomyChanges({
        topics: [
          ...activeTopics,
          {
            ...topicToAdd,
            breadcrumb,
            topicConnections,
            primary: activeTopics.length === 0,
          },
        ],
      });
    }
    closeModal();
  };

  return (
    <>
      <FieldHeader title={t('taxonomy.topics.title')} subTitle={t('taxonomy.topics.subTitle')}>
        <HowToHelper pageId="TaxonomySubjectConnections" tooltip={t('taxonomy.topics.helpLabel')} />
      </FieldHeader>
      <ActiveTopicConnections
        activeTopics={activeTopics}
        setRelevance={setRelevance}
        removeConnection={removeConnection}
        setPrimaryConnection={setPrimaryConnection}
        type="topicarticle"
      />
      <Modal
        label={t('taxonomy.topics.filestructureHeading')}
        backgroundColor="white"
        animation="subtle"
        size="large"
        narrow
        minHeight="85vh"
        activateButton={<ButtonV2>{t('taxonomy.topics.filestructureButton')}</ButtonV2>}>
        {(closeModal: () => void) => (
          <>
            <ModalHeader>
              <ModalCloseButton
                title={t('taxonomy.topics.filestructureClose')}
                onClick={closeModal}
              />
            </ModalHeader>
            <ModalBody>
              <ModalTitleRow>
                <StyledTitleModal>{t('taxonomy.topics.filestructureHeading')}:</StyledTitleModal>
                <Switch
                  onChange={() => setShowFavorites(!showFavorites)}
                  checked={showFavorites}
                  label={t('taxonomy.favorites')}
                  id={'favorites'}
                />
              </ModalTitleRow>
              <hr />
              <Structure
                openedPaths={openedPaths}
                structure={
                  showFavorites ? getFavoriteSubjects(structure, favoriteSubjectIds) : structure
                }
                toggleOpen={handleOpenToggle}
                renderListItems={({
                  isSubject,
                  isOpen,
                  id,
                }: {
                  isSubject: boolean;
                  isOpen: boolean;
                  id: string;
                }) => (
                  <StructureButtons
                    id={id}
                    isSubject={isSubject}
                    closeModal={closeModal}
                    activeTopics={activeTopics}
                    addTopic={addTopic}
                  />
                )}
              />
            </ModalBody>
          </>
        )}
      </Modal>
    </>
  );
};

export default TopicConnections;
