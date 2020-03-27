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
import {
  fetchTopicArticle,
  fetchTopicResources,
} from '../../../../modules/taxonomy';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import {
  Resource,
  ArticleType,
  TranslateType,
  Learningpath,
} from '../../../../interfaces';
import handleError from '../../../../util/handleError';
import ResourceItemLink from '../../resourceComponents/ResourceItemLink';

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
  locale: string;
  id: string;
  contentUri: string;
}

const PublishTopic = ({ t, locale, id, contentUri }: Props) => {
  const [showDisplay, setShowDisplay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [articleCount, setArticleCount] = useState(1);
  const [failedResources, setFailedResources] = useState<Resource[]>([]);

  useEffect(() => {
    setShowAlert(
      failedResources.length !== 0 &&
        publishedCount + failedResources.length === articleCount,
    );
  }, [failedResources, publishedCount]);

  const done = publishedCount + failedResources.length === articleCount;

  const publishTopic = () => {
    if (!done) {
      fetchTopicArticle(id, locale)
        .then((resource: Resource) => publishResource(resource))
        .catch((e: Error) => handleError(e));

      fetchTopicResources(id)
        .then((resources: Resource[]) => {
          setArticleCount(resources.length + 1);
          setShowDisplay(true);
          resources.forEach(resource => publishResource(resource));
        })
        .catch((e: Error) => handleError(e));
    }
  };

  const publishResource = (resource: Resource) => {
    if (resource.contentUri) {
      const [, resourceType, id] = resource.contentUri.split(':');
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
          .catch((e: Error) => handlePublishError(e, resource));
      } else if (resourceType === 'learningpath') {
        fetchLearningpath(id)
          .then((learningpath: Learningpath) => {
            name = learningpath.title.title;
            return learningpath.status !== PUBLISHED
              ? updateStatusLearningpath(id, PUBLISHED)
              : Promise.resolve();
          })
          .then(() => setPublishedCount(prevState => prevState + 1))
          .catch((e: Error) => handlePublishError(e, resource));
      } else {
        setFailedResources(failedResources => [...failedResources, resource]);
      }
    } else {
      setFailedResources(failedResources => [...failedResources, resource]);
    }
  };

  const handlePublishError = (error: Error, resource: Resource) => {
    setFailedResources(failedResources => [...failedResources, resource]);
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
            {failedResources.map((resource, i) => (
              <li key={i}>
                {
                  <ResourceItemLink
                    contentType={
                      resource.contentUri?.split(':')[1] === 'article'
                        ? 'article'
                        : 'learning-path'
                    }
                    contentUri={resource.contentUri}
                    name={resource.name}
                    locale={locale}
                  />
                }
              </li>
            ))}
          </ul>
        }
      />
    </Fragment>
  );
};

export default injectT(PublishTopic);
