import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { OneColumn } from '@ndla/ui';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeLinkButton } from '@ndla/safelink';
import { ChevronRight } from '@ndla/icons/lib/common';
import {
  TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
  TAXONOMY_CUSTOM_FIELD_IS_PUBLISHING,
} from '../../constants';
import { NodeType } from '../../modules/nodes/nodeApiTypes';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { toNodeDiff, toStructure } from '../../util/routeHelpers';
import Footer from '../App/components/Footer';
import NodeIconType from '../../components/NodeIconType';

const ErrorMessage = styled.p`
  color: ${colors.support.red};
  margin: 0;
`;

const StyledNodeContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  border: 1px solid black;
  padding: ${spacing.small};
  justify-content: space-between;
  align-items: center;
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${spacing.small};
  min-width: 250px;
`;

const StyledRequestList = styled.div`
  display: flex;
  padding-top: ${spacing.small};
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.xxsmall};
  align-items: center;
`;

const StyledTitleColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledBreadCrumb = styled('div')`
  flex-grow: 1;
  flex-direction: row;
  font-style: italic;
`;

const PublishRequestsContainer = () => {
  const [error, setError] = useState<string | undefined>();
  const { t } = useTranslation();
  const nodesQuery = useNodes({
    taxonomyVersion: 'default',
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: 'true',
  });

  const versionsQuery = useVersions(
    { type: 'PUBLISHED' },
    {
      onSuccess: data => {
        if (!data[0]) {
          setError('publishRequests.errors.noPublishedVersion');
        }
      },
    },
  );

  const publishedVersion = versionsQuery.data?.[0];

  const onCompare = (node: NodeType) => {
    if (!publishedVersion) {
      setError('publishRequests.errors.noPublishedVersion');
      return '';
    }
    return toNodeDiff(node.id, publishedVersion.hash, 'default');
  };

  return (
    <>
      <OneColumn>
        <h1>{t('publishRequests.title')}</h1>
        {error && <ErrorMessage>{t(error)}</ErrorMessage>}
        <h3>{`${t('publishRequests.numberRequests')}: ${nodesQuery.data?.length}`}</h3>
        <StyledRequestList>
          {nodesQuery.data?.map((node, i) => (
            <StyledNodeContainer key={`node-request-${i}`}>
              <StyledTitleRow>
                <StyledTitleColumn>
                  <StyledTitleRow>
                    <NodeIconType node={node} />
                    {node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_IS_PUBLISHING] === 'true' && (
                      <Spinner size="nsmall" margin="0" />
                    )}
                    {node.name}
                  </StyledTitleRow>
                  <StyledBreadCrumb>
                    {node?.breadcrumbs?.map((path, index) => {
                      return (
                        <Fragment key={`${path}_${index}`}>
                          {path}
                          {index + 1 !== node?.breadcrumbs?.length && <ChevronRight />}
                        </Fragment>
                      );
                    })}
                  </StyledBreadCrumb>
                </StyledTitleColumn>
              </StyledTitleRow>
              <StyledButtonRow>
                <SafeLinkButton to={toStructure(node.path)}>
                  {t('publishRequests.showInStructure')}
                </SafeLinkButton>
                <SafeLinkButton to={onCompare(node)} disabled={!publishedVersion || !!error}>
                  {t('publishRequests.compare')}
                </SafeLinkButton>
              </StyledButtonRow>
            </StyledNodeContainer>
          ))}
        </StyledRequestList>
      </OneColumn>
      <Footer />
    </>
  );
};

export default PublishRequestsContainer;
