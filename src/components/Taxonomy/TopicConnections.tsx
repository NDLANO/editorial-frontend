/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { FieldHeader } from '@ndla/forms';
import { Switch } from '@ndla/switch';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { ModalHeader, ModalBody, ModalCloseButton, Modal, ModalTitle } from '@ndla/modal';
import { Node, NodeChild } from '@ndla/types-taxonomy';
import { fetchUserData } from '../../modules/draft/draftApi';
import ActiveTopicConnections from './ActiveTopicConnections';
import HowToHelper from '../HowTo/HowToHelper';
import RootNode, { NodeWithChildren } from './TaxonomyBlockNode';
import { MinimalNodeChild } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

interface Props {
  structure: NodeWithChildren[];
  selectedNodes: MinimalNodeChild[];
  addConnection: (node: NodeChild) => void;
  removeConnection: (id: string) => void;
  setPrimaryConnection: (connectionId: string) => void;
  primaryPath: string | undefined;
  getSubjectTopics: (subjectId: string) => Promise<void>;
  setRelevance: (topicId: string, relevanceId: string) => void;
}

const TopicConnections = ({
  structure,
  selectedNodes,
  removeConnection,
  setPrimaryConnection,
  addConnection,
  getSubjectTopics,
  primaryPath,
  setRelevance,
}: Props) => {
  const { t } = useTranslation();
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);

  const nodes = useMemo(
    () =>
      showFavorites ? structure.filter((node) => favoriteSubjectIds.includes(node.id)) : structure,
    [favoriteSubjectIds, showFavorites, structure],
  );

  useEffect(() => {
    fetchFavoriteSubjects();
  }, []);

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
    setShowFavorites(favoriteSubjects.length > 0);
  };

  const handleOpenToggle = ({ id }: Node) => {
    let paths = [...openedPaths];
    const index = paths.indexOf(id);
    const isSubject = id.includes('subject');
    if (index === -1) {
      if (isSubject) {
        getSubjectTopics(id);
        paths = [];
      }
      paths.push(id);
    } else {
      paths.splice(index, 1);
    }
    setOpenedPaths(paths);
  };

  const addNode = useCallback((node: NodeChild) => addConnection(node), [addConnection]);

  return (
    <>
      <FieldHeader title={t('taxonomy.topics.title')} subTitle={t('taxonomy.topics.subTitle')}>
        <HowToHelper pageId="TaxonomySubjectConnections" tooltip={t('taxonomy.topics.helpLabel')} />
      </FieldHeader>
      <ActiveTopicConnections
        activeTopics={selectedNodes}
        primaryPath={primaryPath}
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
              {nodes.map((node) => (
                <RootNode
                  key={node.id}
                  node={node}
                  openedPaths={openedPaths}
                  toggleOpen={handleOpenToggle}
                  selectedNodes={selectedNodes}
                  onSelect={(node) => {
                    addNode(node);
                    closeModal();
                  }}
                />
              ))}
            </ModalBody>
          </>
        )}
      </Modal>
    </>
  );
};

export default TopicConnections;
