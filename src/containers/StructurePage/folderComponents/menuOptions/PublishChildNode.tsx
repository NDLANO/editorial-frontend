/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import { partition } from 'lodash';
import { useQueryClient } from 'react-query';
import { Done } from '@ndla/icons/editor';
import { Spinner } from '@ndla/editor';
import { colors } from '@ndla/core';

import AlertModal from '../../../../components/AlertModal/AlertModal';
import MenuItemButton from './components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { fetchDraft, updateStatusDraft } from '../../../../modules/draft/draftApi';
import {
  fetchLearningpath,
  updateStatusLearningpath,
} from '../../../../modules/learningpath/learningpathApi';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import handleError from '../../../../util/handleError';
import ResourceItemLink from '../../resourceComponents/ResourceItemLink';
import { NODE_RESOURCE_STATUS_GREP_QUERY } from '../../../../queryKeys';
import {
  NodeType,
  ResourceWithNodeConnection,
} from '../../../../modules/taxonomy/nodes/nodeApiTypes';
import { fetchNodeResources } from '../../../../modules/taxonomy/nodes/nodeApi';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.2em;
`;

const LinkWrapper = styled.div`
  a {
    color: ${colors.white};
    &:hover {
      color: ${colors.white};
    }
  }
  margin-top: 0.5em;
`;

const iconStyle = css`
  margin: 0px 4px;
  color: green;
`;

interface Props {
  node: NodeType;
}

const PublishChildNode = ({ node }: Props) => {
  const { t } = useTranslation();
  const id = node.id;
  const [showDisplay, setShowDisplay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [articleCount, setArticleCount] = useState(1);
  const [failedResources, setFailedResources] = useState<(NodeType | ResourceWithNodeConnection)[]>(
    [],
  );
  const qc = useQueryClient();

  useEffect(() => {
    setShowAlert(
      failedResources.length !== 0 && publishedCount + failedResources.length === articleCount,
    );
  }, [articleCount, failedResources, publishedCount]);

  const done = publishedCount + failedResources.length === articleCount;

  const publishChildNode = async () => {
    setShowDisplay(true);
    if (done) return;
    const resources = await fetchNodeResources(id);
    const allResources = [node, ...resources];
    setArticleCount(allResources.length);
    const [validResources, invalidResources] = partition(allResources, r => {
      const resourceType = r.contentUri?.split(':')[1];
      return resourceType === 'article' || resourceType === 'learningpath';
    });
    setFailedResources(prev => prev.concat(invalidResources));
    await Promise.all(validResources.map(res => publishResource(res)));
    allResources.forEach(res => qc.invalidateQueries([NODE_RESOURCE_STATUS_GREP_QUERY, res.id]));
  };

  const publishResource = async (
    resource: NodeType | ResourceWithNodeConnection,
  ): Promise<void> => {
    const [, resourceType, id] = resource.contentUri!.split(':');
    const idNum = parseInt(id);
    const [fetch, update] =
      resourceType === 'article'
        ? [fetchDraft, updateStatusDraft]
        : [fetchLearningpath, updateStatusLearningpath];
    try {
      const res = await fetch(idNum);
      const status = typeof res.status === 'string' ? res.status : res.status.current;
      if (status !== 'PUBLISHED') {
        await update(idNum, PUBLISHED);
      }
      setPublishedCount(prev => prev + 1);
    } catch (e) {
      setFailedResources(failedResources => [...failedResources, resource]);
      handleError(e);
    }
  };

  const statusText = t(done ? 'taxonomy.publish.done' : 'taxonomy.publish.waiting');

  return (
    <>
      <MenuItemButton stripped onClick={publishChildNode}>
        <RoundIcon small icon={<Done />} />
        {t('taxonomy.publish.button')}
      </MenuItemButton>
      {showDisplay && (
        <StyledDiv>
          {done ? <Done css={iconStyle} /> : <Spinner size="normal" margin="0px 4px" />}
          {`${statusText} (${publishedCount}/${articleCount})`}
        </StyledDiv>
      )}
      <AlertModal
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        text={t('taxonomy.publish.error')}
        component={failedResources.map(({ contentUri, name }) => (
          <LinkWrapper>
            <ResourceItemLink
              contentType={contentUri?.split(':')[1] === 'article' ? 'article' : 'learning-path'}
              contentUri={contentUri}
              name={name}
            />
          </LinkWrapper>
        ))}
      />
    </>
  );
};

export default PublishChildNode;
