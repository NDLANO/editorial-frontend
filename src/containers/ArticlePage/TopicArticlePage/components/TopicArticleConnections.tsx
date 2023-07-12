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
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { ModalHeader, ModalBody, ModalCloseButton, Modal, ModalTitle } from '@ndla/modal';
import { Switch } from '@ndla/switch';
import { fetchUserData } from '../../../../modules/draft/draftApi';
import { HowToHelper } from '../../../../components/HowTo';
import StructureFunctionButtons from './StructureFunctionButtons';
import ActiveTopicConnections from '../../../../components/Taxonomy/ActiveTopicConnections';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../../interfaces';
import { StagedTopic } from './TopicArticleTaxonomyFormAccordion';

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

interface Props {
  structure: SubjectType[];
  activeTopics: StagedTopic[];
  allowMultipleSubjectsOpen?: boolean;
  stageTaxonomyChanges: ({ path, locale }: { path: string; locale?: LocaleType }) => void;
  getSubjectTopics: (subjectId: string, locale: LocaleType) => Promise<void>;
  setTaxonomyMounted: (v: boolean) => void;
}

const TopicArticleConnections = ({
  structure,
  activeTopics,
  allowMultipleSubjectsOpen,
  stageTaxonomyChanges,
  getSubjectTopics,
  setTaxonomyMounted,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);
  useEffect(() => {
    fetchFavoriteSubjects();
    setTaxonomyMounted(true);
  }, [setTaxonomyMounted]);

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
    setShowFavorites(favoriteSubjects.length > 0);
  };

  const getFavoriteSubjects = (subjects: SubjectType[], favoriteSubjectIds: string[]) => {
    return subjects.filter((e) => favoriteSubjectIds.includes(e.id));
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
        getSubjectTopics(id, i18n.language);
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

  const addTopic = async (path: string, closeModal: () => void, locale?: LocaleType) => {
    stageTaxonomyChanges({ path, locale });
    closeModal();
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };
  return (
    <>
      <FieldHeader
        title={t('taxonomy.topics.topicPlacement')}
        subTitle={t('taxonomy.topics.subTitleTopic')}
      >
        <HowToHelper pageId="TaxonomyTopicConnections" tooltip={t('taxonomy.topics.helpLabel')} />
      </FieldHeader>
      <ActiveTopicConnections activeTopics={activeTopics} type="topic-article" />
      <Modal
        animation="subtle"
        size={{ width: 'large', height: 'large' }}
        activateButton={<ButtonV2>{t(`taxonomy.topics.${'chooseTaxonomyPlacement'}`)}</ButtonV2>}
      >
        {(closeModal: () => void) => (
          <>
            <StyledModalHeader>
              <ModalTitle>{t('taxonomy.topics.filestructureHeading')}</ModalTitle>
              <Switch
                onChange={toggleShowFavorites}
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
                      addTopic={() => addTopic(path, closeModal, i18n.language)}
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
