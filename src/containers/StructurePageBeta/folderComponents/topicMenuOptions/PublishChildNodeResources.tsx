/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { Spinner } from '@ndla/editor';
import { Done } from '@ndla/icons/lib/editor';
import { ISearchResult } from '@ndla/types-draft-api';
import { ISearchResultV2 } from '@ndla/types-learningpath-api';
import { partition } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import AlertModal from '../../../../components/AlertModal';
import RoundIcon from '../../../../components/RoundIcon';
import { searchDrafts, updateStatusDraft } from '../../../../modules/draft/draftApi';
import {
  learningpathSearch,
  updateStatusLearningpath,
} from '../../../../modules/learningpath/learningpathApi';
import { fetchNodeResources } from '../../../../modules/nodes/nodeApi';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { RESOURCE_META } from '../../../../queryKeys';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import ResourceItemLink from '../../resourceComponents/ResourceItemLink';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';

interface Props {
  node: NodeType;
}
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

const StyledDone = styled(Done)`
  margin: 0px 4px;
  color: green;
`;

interface BaseResource {
  name: string;
  contentUri?: string | undefined;
}

const PublishChildNodeResources = ({ node }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [showDisplay, setShowDisplay] = useState(false);
  const [failedResources, setFailedResources] = useState<BaseResource[]>([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [publishableCount, setPublishableCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    setShowAlert(failedResources.length !== 0 && done);
  }, [failedResources, done]);

  const publishResources = async () => {
    setFailedResources([]);
    setDone(false);
    setPublishableCount(0);
    setPublishedCount(0);
    const nodeResources = await fetchNodeResources({ id: node.id, language, taxonomyVersion });
    const allResources = [{ name: node.name, contentUri: node.contentUri }, ...nodeResources];
    const withContentUri = allResources.filter(res => !!res.contentUri);
    setPublishableCount(allResources.length);
    setShowDisplay(true);
    const [draftResources, learningpathResources] = partition(withContentUri, res => {
      const [, resourceType] = res.contentUri!.split(':');
      return resourceType === 'article';
    });
    const draftIds = draftResources.map(res => Number(res.contentUri!.split(':')[2]));
    const learningpathIds = learningpathResources.map(res => Number(res.contentUri!.split(':')[2]));
    const [drafts, learningpaths]: [ISearchResult, ISearchResultV2] = await Promise.all([
      searchDrafts({ idList: draftIds }),
      learningpathSearch({ ids: learningpathIds }),
    ]);
    const unpublishedDrafts = drafts.results.filter(draft => draft.status.current !== PUBLISHED);
    const unpublishedLearningpaths = learningpaths.results.filter(lp => lp.status !== PUBLISHED);

    const draftPromises = unpublishedDrafts.map(draft =>
      updateStatusDraft(draft.id, PUBLISHED)
        .then(_ => setPublishedCount(c => c + 1))
        .catch(_ =>
          setFailedResources(prev =>
            prev.concat({ name: draft.title.title, contentUri: `url:article:${draft.id}` }),
          ),
        ),
    );
    const learningpathPromises = unpublishedLearningpaths.map(lp =>
      updateStatusLearningpath(lp.id, PUBLISHED)
        .then(_ => setPublishedCount(c => c + 1))
        .catch(_ =>
          setFailedResources(prev =>
            prev.concat({ name: lp.title.title, contentUri: `url:learningpath:${lp.id}` }),
          ),
        ),
    );
    await Promise.all([...draftPromises, ...learningpathPromises]);
    await qc.invalidateQueries([RESOURCE_META, {}]);
    setDone(true);
  };

  const publishText = t(`taxonomy.publish.${done ? 'done' : 'waiting'}`);

  return (
    <>
      <MenuItemButton stripped onClick={() => setShowConfirmation(true)}>
        <RoundIcon small icon={<Done />} />
        {t('taxonomy.publish.button')}
      </MenuItemButton>
      {showDisplay && (
        <StyledDiv>
          {done ? <StyledDone /> : <Spinner size="normal" margin="0px 4px" />}
          {`${publishText} (${publishedCount}/${publishableCount})`}
        </StyledDiv>
      )}
      <AlertModal
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        text={t('taxonomy.publish.error')}
        component={failedResources.map(res => (
          <LinkWrapper>
            <ResourceItemLink
              contentType={
                res.contentUri?.split(':')[1] === 'article' ? 'article' : 'learning-resource'
              }
              contentUri={res.contentUri}
              name={res.name}
            />
          </LinkWrapper>
        ))}
      />
      <AlertModal
        show={showConfirmation}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => setShowConfirmation(false),
          },
          {
            text: t('taxonomy.publish.button'),
            onClick: () => {
              setShowConfirmation(false);
              publishResources();
            },
          },
        ]}
        onCancel={() => setShowConfirmation(false)}
        text={t('taxonomy.publish.info')}
      />
    </>
  );
};

export default PublishChildNodeResources;
