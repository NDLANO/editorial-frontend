/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Structure } from '@ndla/editor';
import { FieldHeader } from '@ndla/forms';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Switch } from '@ndla/switch';
import { fetchUserData } from '../../../../modules/draft/draftApi';
import { HowToHelper } from '../../../../components/HowTo';
// import { StructureShape, TopicShape } from '../../../../shapes';
import StructureFunctionButtons from './StructureFunctionButtons';
import ActiveTopicConnections from '../../../../components/Taxonomy/ActiveTopicConnections';
import { Topic, SubjectType } from '../../../../interfaces';

const StyledTitleModal = styled('h1')`
  color: ${colors.text.primary};
`;

const TopicArticleConnections = (props: Props & tType) => {
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);

  useEffect(() => {
    const f = async () => {
      await fetchFavoriteSubjects();
    };
    f();
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
    const { allowMultipleSubjectsOpen, getSubjectTopics } = props;
    let paths = [...openedPaths];
    const index = paths.indexOf(path);
    if (index === -1) {
      if (isSubject) {
        getSubjectTopics(id, props.locale);
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
    props.stageTaxonomyChanges(path);
    closeModal();
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };
  const { t, structure, activeTopics, ...rest } = props;

  return (
    <Fragment>
      <FieldHeader
        title={t('taxonomy.topics.topicPlacement')}
        subTitle={t('taxonomy.topics.subTitleTopic')}>
        <HowToHelper pageId="TaxonomyTopicConnections" tooltip={t('taxonomy.topics.helpLabel')} />
      </FieldHeader>
      <ActiveTopicConnections activeTopics={activeTopics} type="topic-article" {...rest} />
      <Modal
        backgroundColor="white"
        animation="subtle"
        size="large"
        narrow
        minHeight="85vh"
        activateButton={<Button>{t(`taxonomy.topics.${'chooseTaxonomyPlacement'}`)}</Button>}>
        {(closeModal: () => void) => (
          <Fragment>
            <ModalHeader>
              <ModalCloseButton
                title={t('taxonomy.topics.filestructureClose')}
                onClick={closeModal}
              />
            </ModalHeader>
            <ModalBody>
              <StyledTitleModal>{t('taxonomy.topics.filestructureHeading')}:</StyledTitleModal>
              <Switch
                onChange={toggleShowFavorites}
                checked={showFavorites}
                label={t('taxonomy.favorites')}
                id={'favorites'}
                // style={{ color: colors.white, width: '15.2em' }}
              />
              <hr />
              <Structure
                openedPaths={openedPaths}
                structure={
                  showFavorites ? getFavoriteSubjects(structure, favoriteSubjectIds) : structure
                }
                toggleOpen={handleOpenToggle}
                renderListItems={(item: any) => {
                  return (
                    <StructureFunctionButtons
                      {...props}
                      activeTopics={activeTopics}
                      addTopic={() => addTopic(item.path, closeModal)}
                    />
                  );
                }}
              />
            </ModalBody>
          </Fragment>
        )}
      </Modal>
    </Fragment>
  );
};

interface TaxonomyTopic {
  contentUri?: string;
  id: string;
  name?: string;
  path: string;
}

interface Props {
  isOpened?: boolean;
  structure: SubjectType[];
  activeTopics: Topic[];
  taxonomyTopics: TaxonomyTopic[];
  allowMultipleSubjectsOpen?: boolean;
  stageTaxonomyChanges: (path: string) => void;
  getSubjectTopics: (subjectId: string, locale: string) => Promise<void>;
  setPrimaryConnection?: Function;
  locale: string;
}

TopicArticleConnections.propTypes = {
  isOpened: PropTypes.bool,
  // TypeScript error, Validator does not play nicely with array shapes. TODO: Fix.
  // structure: PropTypes.arrayOf(StructureShape).isRequired,
  // activeTopics: PropTypes.arrayOf(TopicShape).isRequired,
  // taxonomyTopics: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     contentUri: PropTypes.string,
  //     id: PropTypes.string.isRequired,
  //     name: PropTypes.string,
  //     path: PropTypes.string,
  //   }),
  // ).isRequired,
  retriveBreadcrumbs: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  allowMultipleSubjectsOpen: PropTypes.bool,
  stageTaxonomyChanges: PropTypes.func.isRequired,
  getSubjectTopics: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(TopicArticleConnections);
