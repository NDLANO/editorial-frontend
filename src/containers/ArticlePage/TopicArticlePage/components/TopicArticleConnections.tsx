/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
// @ts-ignore
import { Structure } from '@ndla/editor';
import { FieldHeader } from '@ndla/forms';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Switch } from '@ndla/switch';
import { fetchUserData } from '../../../../modules/draft/draftApi';
import { HowToHelper } from '../../../../components/HowTo';
import StructureFunctionButtons from './StructureFunctionButtons';
import ActiveTopicConnections from '../../../../components/Taxonomy/ActiveTopicConnections';
import { PathArray } from '../../../../util/retriveBreadCrumbs';
import { TopicShape, StructureShape } from '../../../../shapes';
import {
  ResourceWithTopicConnection,
  SubjectType,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  structure: SubjectType[];
  activeTopics: ResourceWithTopicConnection[];
  allowMultipleSubjectsOpen?: boolean;
  stageTaxonomyChanges: ({ path }: { path: string }) => void;
  getSubjectTopics: (subjectId: string, locale: string) => Promise<void>;
  retriveBreadCrumbs: (path: string) => PathArray;
  locale: string;
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
  retriveBreadCrumbs,
  locale,
  t,
}: Props & tType) => {
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

  const addTopic = async (path: string, closeModal: () => void) => {
    stageTaxonomyChanges({ path });
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
      <ActiveTopicConnections
        activeTopics={activeTopics}
        type="topic-article"
        retriveBreadCrumbs={retriveBreadCrumbs}
      />
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
                      addTopic={() => addTopic(path, closeModal)}
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

TopicArticleConnections.propTypes = {
  isOpened: PropTypes.bool,
  structure: PropTypes.arrayOf<SubjectType>(StructureShape).isRequired,
  activeTopics: PropTypes.arrayOf<ResourceWithTopicConnection>(TopicShape).isRequired,
  retriveBreadcrumbs: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  allowMultipleSubjectsOpen: PropTypes.bool,
  stageTaxonomyChanges: PropTypes.func.isRequired,
  getSubjectTopics: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(TopicArticleConnections);
