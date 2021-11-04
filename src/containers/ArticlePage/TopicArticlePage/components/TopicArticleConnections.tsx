/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
//@ts-ignore
import { Structure } from '@ndla/editor';
import { FieldHeader } from '@ndla/forms';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Switch } from '@ndla/switch';
import { fetchUserData } from '../../../../modules/draft/draftApi';
import { HowToHelper } from '../../../../components/HowTo';
import StructureFunctionButtons from './StructureFunctionButtons';
import ActiveTopicConnections from '../../../../components/Taxonomy/ActiveTopicConnections';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../../interfaces';
import { StagedTopic } from './TopicArticleTaxonomy';

interface Props {
  structure: SubjectType[];
  activeTopics: StagedTopic[];
  allowMultipleSubjectsOpen?: boolean;
  stageTaxonomyChanges: ({ path, language }: { path: string; language?: string }) => void;
  getSubjectTopics: (subjectId: string, locale: LocaleType) => Promise<void>;
  locale: LocaleType;
}

const StyledTitleModal = styled('h1')`
  color: ${colors.text.primary};
`;

const ModalTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopicArticleConnections = ({
  structure,
  activeTopics,
  allowMultipleSubjectsOpen,
  stageTaxonomyChanges,
  getSubjectTopics,
  locale,
}: Props) => {
  const { t } = useTranslation();
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

  const getFavoriteSubjects = (subjects: SubjectType[], favoriteSubjectIds: string[]) => {
    return subjects.filter(e => favoriteSubjectIds.includes(e.id));
  };

  const handleOpenToggle = async ({
    path,
    isSubject,
    id,
  }: {
    path: string;
    isSubject: boolean;
    id: string;
  }) => {
    let paths = [...openedPaths];
    const index = paths.indexOf(path);
    if (index === -1) {
      if (isSubject) {
        getSubjectTopics(id, locale);
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

  const addTopic = async (path: string, closeModal: () => void, language?: string) => {
    stageTaxonomyChanges({ path, language });
    closeModal();
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };
  return (
    <>
      <FieldHeader
        title={t('taxonomy.topics.topicPlacement')}
        subTitle={t('taxonomy.topics.subTitleTopic')}>
        <HowToHelper pageId="TaxonomyTopicConnections" tooltip={t('taxonomy.topics.helpLabel')} />
      </FieldHeader>
      <ActiveTopicConnections activeTopics={activeTopics} type="topic-article" />
      <Modal
        backgroundColor="white"
        animation="subtle"
        size="large"
        narrow
        minHeight="85vh"
        activateButton={<Button>{t(`taxonomy.topics.${'chooseTaxonomyPlacement'}`)}</Button>}>
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
                  onChange={toggleShowFavorites}
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
                  path,
                  isSubject,
                  isOpen,
                  id,
                }: {
                  path: string;
                  isSubject: boolean;
                  isOpen: boolean;
                  id: string;
                }) => {
                  return (
                    <StructureFunctionButtons
                      isOpen={isOpen}
                      id={id}
                      isSubject={isSubject}
                      activeTopics={activeTopics}
                      addTopic={() => addTopic(path, closeModal, locale)}
                    />
                  );
                }}
              />
            </ModalBody>
          </>
        )}
      </Modal>
    </>
  );
};

export default TopicArticleConnections;
