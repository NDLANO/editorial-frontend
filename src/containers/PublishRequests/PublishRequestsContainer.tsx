import styled from '@emotion/styled';
import Button from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { OneColumn } from '@ndla/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from '../../constants';
import { NodeType } from '../../modules/nodes/nodeApiTypes';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { toNodeDiff, toStructureBeta } from '../../util/routeHelpers';
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

const PublishRequestsContainer = () => {
  const [error, setError] = useState<string | undefined>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nodesQuery = useNodes({
    taxonomyVersion: 'default',
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: 'true',
  });

  const versionsQuery = useVersions(
    { taxonomyVersion: 'default', type: 'PUBLISHED' },
    {
      onSuccess: data => {
        if (!data[0]) {
          setError('publishRequests.errors.noPublishedVersion');
        }
      },
    },
  );

  const publishedVersion = versionsQuery.data?.[0];

  const onShowInStructure = (node: NodeType) => {
    navigate(toStructureBeta(node.path));
  };

  const onCompare = (node: NodeType) => {
    if (!publishedVersion) {
      setError('publishRequests.errors.noPublishedVersion');
      return;
    }
    navigate(toNodeDiff(node.id, publishedVersion.hash, 'default'));
  };

  return (
    <>
      <OneColumn>
        <h1>{t('publishRequests.title')}</h1>
        {error && <ErrorMessage>{t(error)}</ErrorMessage>}
        <StyledRequestList>
          {nodesQuery.data?.map((node, i) => (
            <StyledNodeContainer key={`node-request-${i}`}>
              <StyledTitleRow>
                <NodeIconType node={node} />
                {node.name}
              </StyledTitleRow>
              <StyledButtonRow>
                <Button onClick={() => onShowInStructure(node)}>
                  {t('publishRequests.showInStructure')}
                </Button>
                <Button onClick={() => onCompare(node)} disabled={!publishedVersion || !!error}>
                  {t('publishRequests.compare')}
                </Button>
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
