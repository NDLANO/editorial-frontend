/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { Done } from '@ndla/icons/editor';
import { Spinner } from '@ndla/editor';

import AlertModal from '../../../../components/AlertModal/AlertModal';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import {
  fetchDraft,
  updateStatusDraft,
} from '../../../../modules/draft/draftApi';
import {
  fetchLearningpath,
  updateStatusLearningpath,
} from '../../../../modules/learningpath/learningpathApi';
import { fetchTopicResources } from '../../../../modules/taxonomy';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import {
  ResourceType,
  ArticleType,
  TranslateType,
  LearningpathType,
} from '../../../../interfaces';
import handleError from '../../../../util/handleError';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.2em;
`;

const iconStyle = css`
  margin: 0px 4px;
  color: green;
`;

interface Props {
  t: TranslateType;
  id: string;
  contentUri: string;
}

const PublishTopic = ({ t, id, contentUri }: Props) => {
  const [showDisplay, setShowDisplay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [articleCount, setArticleCount] = useState(1);
  const [failedResources, setFailedResources] = useState<string[]>([]);

  useEffect(() => {
    setShowAlert(
      failedResources.length !== 0 &&
        publishedCount + failedResources.length === articleCount,
    );
  }, [failedResources, publishedCount]);

  const done = publishedCount + failedResources.length === articleCount;

  const publishTopic = () => {
    if (!done) {
      fetchTopicResources(id)
        .then((resources: ResourceType[]) => {
          setArticleCount(resources.length + 1);
          setShowDisplay(true);
          resources.forEach(resource => {
            if (resource.contentUri) {
              publishResource(resource.contentUri);
            } else {
              setFailedResources(failedResources => [
                ...failedResources,
                resource.name,
              ]);
            }
          });
        })
        .catch((e: Error) => handleError(e));
      publishResource(contentUri);
    }
  };

  const publishResource = (contentUri: string) => {
    const [, resourceType, id] = contentUri.split(':');
    let name: string;
    if (resourceType === 'article') {
      fetchDraft(id)
        .then((article: ArticleType) => {
          name = article.title.title;
          return article.status.current !== PUBLISHED
            ? updateStatusDraft(id, PUBLISHED)
            : Promise.resolve();
        })
        .then(() => setPublishedCount(prevState => prevState + 1))
        .catch((e: Error) => handlePublishError(e, name));
    } else if (resourceType === 'learningpath') {
      fetchLearningpath(id)
        .then((learningpath: LearningpathType) => {
          name = learningpath.title.title;
          return learningpath.status !== PUBLISHED
            ? updateStatusLearningpath(id, PUBLISHED)
            : Promise.resolve();
        })
        .then(() => setPublishedCount(prevState => prevState + 1))
        .catch((e: Error) => handlePublishError(e, name));
    } else {
      setFailedResources(failedResources => [...failedResources, contentUri]);
    }
  };

  const handlePublishError = (error: Error, name: string) => {
    setFailedResources(failedResources => [...failedResources, name]);
    handleError(error);
  };

  return (
    <Fragment>
      <MenuItemButton stripped onClick={publishTopic}>
        <RoundIcon small icon={<Done />} />
        {t('taxonomy.publish.button')}
      </MenuItemButton>
      {showDisplay && (
        <StyledDiv>
          {done ? (
            <Done css={iconStyle} />
          ) : (
            <Spinner size="normal" margin="0px 4px" />
          )}
          {t(done ? 'taxonomy.publish.done' : 'taxonomy.publish.waiting') +
            ` (${publishedCount}/${articleCount})`}
        </StyledDiv>
      )}
      <AlertModal
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        text={t('taxonomy.publish.error')}
        component={
          <ul>
            {failedResources.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        }
      />
    </Fragment>
  );
};

export default injectT(PublishTopic);
