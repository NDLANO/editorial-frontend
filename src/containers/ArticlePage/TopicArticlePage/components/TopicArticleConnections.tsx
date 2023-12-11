/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Modal,
  ModalTitle,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { Switch } from '@ndla/switch';
import { Node, NodeChild } from '@ndla/types-taxonomy';
import { HowToHelper } from '../../../../components/HowTo';
import ActiveTopicConnections from '../../../../components/Taxonomy/ActiveTopicConnections';
import TaxonomyBlockNode, {
  NodeWithChildren,
} from '../../../../components/Taxonomy/TaxonomyBlockNode';
import { fetchUserData } from '../../../../modules/draft/draftApi';
import { MinimalNodeChild } from '../../LearningResourcePage/components/LearningResourceTaxonomy';

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

interface Props {
  structure: NodeWithChildren[];
  selectedNodes: MinimalNodeChild[] | Node[];
  addConnection: (node: Node) => void;
  getSubjectTopics: (subjectId: string) => Promise<void>;
}

const TopicArticleConnections = ({
  structure,
  selectedNodes,
  addConnection,
  getSubjectTopics,
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);

  const nodes = useMemo(
    () =>
      showFavorites ? structure.filter((node) => favoriteSubjectIds.includes(node.id)) : structure,
    [favoriteSubjectIds, showFavorites, structure],
  );

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
    setShowFavorites(favoriteSubjects.length > 0);
  };

  useEffect(() => {
    fetchFavoriteSubjects();
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

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

  const onAdd = useCallback(
    (node: NodeWithChildren | NodeChild) => {
      addConnection(node);
      closeModal();
    },
    [addConnection, closeModal],
  );

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
      <ActiveTopicConnections activeTopics={selectedNodes} type="topic-article" />
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger>
          <ButtonV2>{t(`taxonomy.topics.${'chooseTaxonomyPlacement'}`)}</ButtonV2>
        </ModalTrigger>
        <ModalContent animation="subtle" size={{ width: 'large', height: 'large' }}>
          <StyledModalHeader>
            <ModalTitle>{t('taxonomy.topics.filestructureHeading')}</ModalTitle>
            <Switch
              onChange={toggleShowFavorites}
              checked={showFavorites}
              label={t('taxonomy.favorites')}
              id={'favorites'}
            />
            <ModalCloseButton title={t('taxonomy.topics.filestructureClose')} />
          </StyledModalHeader>
          <ModalBody>
            <hr />
            {nodes.map((node) => (
              <TaxonomyBlockNode
                key={node.id}
                node={node}
                openedPaths={openedPaths}
                toggleOpen={handleOpenToggle}
                selectedNodes={selectedNodes}
                onRootSelected={onAdd}
                onSelect={onAdd}
              />
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TopicArticleConnections;
