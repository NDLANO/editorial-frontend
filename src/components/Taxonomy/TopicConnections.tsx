/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Structure } from '@ndla/editor';
import { FieldHeader } from '@ndla/forms';
import { Switch } from '@ndla/switch';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { ModalHeader, ModalBody, ModalCloseButton, Modal, ModalTitle } from '@ndla/modal';
import { fetchUserData } from '../../modules/draft/draftApi';
import { fetchSubjectTopics, fetchTopic, fetchTopicConnections } from '../../modules/taxonomy';
import ActiveTopicConnections from './ActiveTopicConnections';
import HowToHelper from '../HowTo/HowToHelper';
import StructureButtons from '../../containers/ArticlePage/LearningResourcePage/components/taxonomy/StructureButtons';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { StagedTopic } from '../../containers/ArticlePage/TopicArticlePage/components/TopicArticleTaxonomyFormAccordion';
import { getBreadcrumbFromPath, groupTopics } from '../../util/taxonomyHelpers';
import { LocaleType } from '../../interfaces';
import { useTaxonomyVersion } from '../../containers/StructureVersion/TaxonomyVersionProvider';
import handleError from '../../util/handleError';
import {
  LearningResourceSubjectType,
  TaxonomyChanges,
} from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomyFormAccordion';

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

interface Props {
  structure: LearningResourceSubjectType[];
  setStructure: (s: SubjectType[]) => void;
  activeTopics: StagedTopic[];
  allowMultipleSubjectsOpen: boolean;
  stageTaxonomyChanges: (properties: any) => void;
  setTaxonomyMounted: (v: boolean) => void;
  taxonomyChanges: TaxonomyChanges;
}

const TopicConnections = ({
  structure,
  setStructure,
  activeTopics,
  allowMultipleSubjectsOpen,
  stageTaxonomyChanges,
  setTaxonomyMounted,
  taxonomyChanges,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);

  useEffect(() => {
    fetchFavoriteSubjects();
    setTaxonomyMounted(true);
  }, [setTaxonomyMounted]);

  const setRelevance = (topicId: string, relevanceId: string) => {
    const { topics } = taxonomyChanges;

    stageTaxonomyChanges({
      topics: topics?.map((topic) => ({
        ...topic,
        ...(topic.id === topicId && {
          relevanceId,
        }),
      })),
    });
  };

  const setPrimaryConnection = (id: string) => {
    const { topics } = taxonomyChanges;

    stageTaxonomyChanges({
      topics: topics?.map((topic) => ({
        ...topic,
        isPrimary: topic.id === id,
      })),
    });
  };

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
    setShowFavorites(favoriteSubjects.length > 0);
  };

  const updateSubject = (subjectId: string, newSubject: Partial<LearningResourceSubjectType>) => {
    setStructure(
      structure.map((subject) =>
        subject.id === subjectId ? { ...subject, ...newSubject } : subject,
      ),
    );
  };

  const getSubjectTopics = async (subjectid: string) => {
    if (structure.some((subject) => subject.id === subjectid && subject.topics)) {
      return;
    }
    try {
      const allTopics = await fetchSubjectTopics({
        subject: subjectid,
        language: i18n.language,
        taxonomyVersion,
      });
      const groupedTopics = groupTopics(allTopics);
      updateSubject(subjectid, { topics: groupedTopics });
    } catch (err) {
      handleError(err);
    }
  };

  const getFavoriteSubjects = (subjects: SubjectType[], favoriteSubjectIds: string[]) =>
    subjects.filter((e) => favoriteSubjectIds.includes(e.id));

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

  const removeConnection = (id: string) => {
    const { topics } = taxonomyChanges;
    const updatedTopics = topics?.filter((topic) => topic.id !== id);

    // Auto set primary of only one connection.
    if (updatedTopics?.length === 1) {
      updatedTopics[0].isPrimary = true;
    }
    stageTaxonomyChanges({
      topics: updatedTopics,
    });
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
        aria-label={t('taxonomy.topics.filestructureHeading')}
        animation="subtle"
        size={{ width: 'large', height: 'large' }}
        activateButton={<ButtonV2>{t('taxonomy.topics.filestructureButton')}</ButtonV2>}
      >
        {(closeModal: () => void) => (
          <>
            <StyledModalHeader>
              <ModalTitle>{t('taxonomy.topics.filestructureHeading')}</ModalTitle>
              <Switch
                onChange={() => setShowFavorites(!showFavorites)}
                checked={showFavorites}
                label={t('taxonomy.favorites')}
                id={'favorites'}
              />
              <ModalCloseButton
                title={t('taxonomy.topics.filestructureClose')}
                onClick={closeModal}
              />
            </StyledModalHeader>
            <ModalBody>
              <hr />
              <Structure
                openedPaths={openedPaths}
                structure={
                  showFavorites ? getFavoriteSubjects(structure, favoriteSubjectIds) : structure
                }
                toggleOpen={handleOpenToggle}
                renderListItems={({ isSubject, id }: { isSubject: boolean; id: string }) => (
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
