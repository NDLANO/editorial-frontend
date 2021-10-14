/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import { partition } from 'lodash';
import { useQueryClient } from 'react-query';
import { Done } from '@ndla/icons/editor';
import { Spinner } from '@ndla/editor';
import { colors } from '@ndla/core';

import AlertModal from '../../../../components/AlertModal/AlertModal';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { fetchDraft, updateStatusDraft } from '../../../../modules/draft/draftApi';
import {
  fetchLearningpath,
  updateStatusLearningpath,
} from '../../../../modules/learningpath/learningpathApi';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import handleError from '../../../../util/handleError';
import ResourceItemLink from '../../resourceComponents/ResourceItemLink';
import { Resource, Topic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { TopicResource } from '../../resourceComponents/StructureResources';
import { fetchTopic, fetchTopicResources } from '../../../../modules/taxonomy';
import { TOPIC_RESOURCE_STATUS_GREP_QUERY } from '../../../../queryKeys';

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
  locale: string;
  id: string;
}

type LocalResource = Pick<Resource, 'contentUri' | 'name'>;

const PublishTopic = ({ locale, id }: Props) => {
  const { t } = useTranslation();
  const [showDisplay, setShowDisplay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [articleCount, setArticleCount] = useState(1);
  const [failedResources, setFailedResources] = useState<LocalResource[]>([]);
  const qc = useQueryClient();

  useEffect(() => {
    setShowAlert(
      failedResources.length !== 0 && publishedCount + failedResources.length === articleCount,
    );
  }, [articleCount, failedResources, publishedCount]);

  const done = publishedCount + failedResources.length === articleCount;

  const publishTopic = async () => {
    setShowDisplay(true);
    if (done) return;
    const topic = await fetchTopic(id, locale).catch(e => handleError(e));
    const resources = await fetchTopicResources(id);
    const allResources = [topic, ...resources];
    setArticleCount(allResources.length);
    const [validResources, invalidResources] = partition(allResources, r => {
      const resourceType = r.contentUri?.split(':')[1];
      return resourceType === 'article' || resourceType === 'learningpath';
    });
    setFailedResources(prev => [...prev, ...invalidResources]);
    await Promise.all(validResources.map(res => publishResource(res)));
    allResources.forEach(res => qc.invalidateQueries([TOPIC_RESOURCE_STATUS_GREP_QUERY, res.id]));
  };

  const publishResource = async (resource: Topic | TopicResource): Promise<void> => {
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

  return (
    <>
      <MenuItemButton stripped onClick={publishTopic}>
        <RoundIcon small icon={<Done />} />
        {t('taxonomy.publish.button')}
      </MenuItemButton>
      {showDisplay && (
        <StyledDiv>
          {done ? <Done css={iconStyle} /> : <Spinner size="normal" margin="0px 4px" />}
          {t(done ? 'taxonomy.publish.done' : 'taxonomy.publish.waiting') +
            ` (${publishedCount}/${articleCount})`}
        </StyledDiv>
      )}
      <AlertModal
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        text={t('taxonomy.publish.error')}
        component={failedResources.map(resource => (
          <LinkWrapper>
            <ResourceItemLink
              contentType={
                resource.contentUri?.split(':')[1] === 'article' ? 'article' : 'learning-path'
              }
              contentUri={resource.contentUri}
              name={resource.name}
              locale={locale}
            />
          </LinkWrapper>
        ))}
      />
    </>
  );
};

export default PublishTopic;
