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
import { Done } from '@ndla/icons/editor';
import { Spinner } from '@ndla/editor';
import { colors } from '@ndla/core';
import { ILearningPathV2 } from '@ndla/types-learningpath-api';

import AlertModal from '../../../../components/AlertModal/AlertModal';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { fetchDraft, updateStatusDraft } from '../../../../modules/draft/draftApi';
import {
  fetchLearningpath,
  updateStatusLearningpath,
} from '../../../../modules/learningpath/learningpathApi';
import { fetchTopic, fetchTopicResources } from '../../../../modules/taxonomy';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import handleError from '../../../../util/handleError';
import ResourceItemLink from '../../resourceComponents/ResourceItemLink';
import { Resource, Topic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

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
  setResourcesUpdated: (updated: boolean) => void;
}

type LocalResource = Pick<Resource, 'contentUri' | 'name'>;
type LocalTopic = Pick<Topic, 'contentUri' | 'name'>;

const PublishTopic = ({ locale, id, setResourcesUpdated }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [showDisplay, setShowDisplay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [articleCount, setArticleCount] = useState(1);
  const [failedResources, setFailedResources] = useState<LocalResource[]>([]);

  useEffect(() => {
    setShowAlert(
      failedResources.length !== 0 && publishedCount + failedResources.length === articleCount,
    );
  }, [articleCount, failedResources, publishedCount]);

  const done = publishedCount + failedResources.length === articleCount;

  const publishTopic = () => {
    if (!done) {
      fetchTopic({ id, language: locale, taxonomyVersion })
        .then((topic: Topic) => publishResource(topic))
        .catch((e: Error) => handleError(e));

      fetchTopicResources({ topicUrn: id, taxonomyVersion })
        .then((resources: Resource[]) => {
          setArticleCount(resources.length + 1);
          setShowDisplay(true);
          return resources.map((resource: Resource) => publishResource(resource));
        })
        .then((publishPromises: Promise<void>[]) => Promise.all(publishPromises))
        .then(() => setResourcesUpdated(true))
        .catch((e: Error) => handleError(e));
    }
  };

  const publishResource = async (resource: LocalResource | LocalTopic): Promise<void> => {
    if (resource.contentUri) {
      const [, resourceType, id] = resource.contentUri.split(':');
      const idNum = Number(id);
      if (resourceType === 'article') {
        return fetchDraft(idNum)
          .then(article => {
            if (article.status.current !== PUBLISHED) {
              return updateStatusDraft(idNum, PUBLISHED).then(_ => Promise.resolve());
            }
            return Promise.resolve();
          })
          .then(() => setPublishedCount(prevState => prevState + 1))
          .catch((e: Error) => handlePublishError(e, resource));
      } else if (resourceType === 'learningpath') {
        return fetchLearningpath(idNum)
          .then((learningpath: ILearningPathV2) => {
            if (learningpath.status !== PUBLISHED) {
              return updateStatusLearningpath(idNum, PUBLISHED).then(() => {});
            }
            return Promise.resolve();
          })
          .then(() => setPublishedCount(prevState => prevState + 1))
          .catch((e: Error) => handlePublishError(e, resource));
      } else {
        setFailedResources(failedResources => [...failedResources, resource]);
        return Promise.reject();
      }
    } else {
      setFailedResources(failedResources => [...failedResources, resource]);
      return Promise.reject();
    }
  };

  const handlePublishError = (error: Error, resource: LocalResource) => {
    setFailedResources(failedResources => [...failedResources, resource]);
    handleError(error);
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
        component={failedResources.map((resource, i) => (
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
