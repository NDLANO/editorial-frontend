/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Structure } from '@ndla/editor';
import { FieldHeader } from '@ndla/forms';
import { Switch } from '@ndla/switch';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Modal,
  ModalTitle,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { Node } from '@ndla/types-taxonomy';
import { fetchUserData } from '../../modules/draft/draftApi';
import ActiveTopicConnections from './ActiveTopicConnections';
import HowToHelper from '../HowTo/HowToHelper';
import StructureButtons from '../../containers/ArticlePage/LearningResourcePage/components/taxonomy/StructureButtons';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { useTaxonomyVersion } from '../../containers/StructureVersion/TaxonomyVersionProvider';
import { SubjectWithTopics } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';
import { fetchNode } from '../../modules/nodes/nodeApi';

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

interface Props {
  structure: SubjectWithTopics[];
  activeTopics: Node[];
  removeConnection: (id: string) => void;
  setPrimaryConnection: (id: string) => void;
  allowMultipleSubjectsOpen: boolean;
  primaryPath: string | undefined;
  stageTaxonomyChanges: (contexts: Node[]) => void;
  getSubjectTopics: (subjectId: string) => Promise<void>;
  setRelevance: (topicId: string, relevanceId: string) => void;
}

const TopicConnections = ({
  structure,
  activeTopics,
  removeConnection,
  setPrimaryConnection,
  allowMultipleSubjectsOpen,
  stageTaxonomyChanges,
  getSubjectTopics,
  primaryPath,
  setRelevance,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [open, setOpen] = useState(false);
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

  const addTopic = async (id: string | undefined, closeModal: () => void) => {
    if (id) {
      const topicToAdd = await fetchNode({ id, taxonomyVersion });
      stageTaxonomyChanges(activeTopics.concat(topicToAdd));
    }
    closeModal();
  };

  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <>
      <FieldHeader title={t('taxonomy.topics.title')} subTitle={t('taxonomy.topics.subTitle')}>
        <HowToHelper pageId="TaxonomySubjectConnections" tooltip={t('taxonomy.topics.helpLabel')} />
      </FieldHeader>
      <ActiveTopicConnections
        activeTopics={activeTopics}
        primaryPath={primaryPath}
        setRelevance={setRelevance}
        removeConnection={removeConnection}
        setPrimaryConnection={setPrimaryConnection}
        type="topicarticle"
      />
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger>
          <ButtonV2>{t('taxonomy.topics.filestructureButton')}</ButtonV2>
        </ModalTrigger>
        <ModalContent
          aria-label={t('taxonomy.topics.filestructureHeading')}
          animation="subtle"
          size={{ width: 'large', height: 'large' }}
        >
          <StyledModalHeader>
            <ModalTitle>{t('taxonomy.topics.filestructureHeading')}</ModalTitle>
            <Switch
              onChange={() => setShowFavorites(!showFavorites)}
              checked={showFavorites}
              label={t('taxonomy.favorites')}
              id={'favorites'}
            />
            <ModalCloseButton title={t('taxonomy.topics.filestructureClose')} />
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
        </ModalContent>
      </Modal>
    </>
  );
};

export default TopicConnections;
