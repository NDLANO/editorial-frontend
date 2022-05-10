import styled from '@emotion/styled';
import Button from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { OneColumn, MessageBox } from '@ndla/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import queryString from 'query-string';
import AlertModal from '../../components/AlertModal';
import { TAXONOMY_ADMIN_SCOPE, TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from '../../constants';
import { NodeType } from '../../modules/nodes/nodeApiTypes';
import { usePublishNodeMutation } from '../../modules/nodes/nodeMutations';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { NODES } from '../../queryKeys';
import { toNodeDiff, toStructureBeta } from '../../util/routeHelpers';
import Footer from '../App/components/Footer';
import { useSession } from '../Session/SessionProvider';
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
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [nodeToPublish, setShowNodeToPublish] = useState<NodeType | undefined>(undefined);
  const [error, setError] = useState<string | undefined>();
  const [hasPublished, setHasPublished] = useState(false);
  const { userPermissions } = useSession();
  const qc = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nodesQuery = useNodes({
    taxonomyVersion: 'default',
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: 'true',
  });

  const stringifiedParams = queryString.stringify({
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: 'true',
  });

  const publishNodeMutation = usePublishNodeMutation({
    onSettled: () => qc.invalidateQueries([NODES, stringifiedParams, 'default']),
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

  const onPublish = async (node: NodeType) => {
    if (!userPermissions?.includes(TAXONOMY_ADMIN_SCOPE)) {
      return;
    }
    setHasPublished(false);
    if (!publishedVersion) {
      setError('publishRequests.errors.noPublishedVersion');
      return;
    }
    await publishNodeMutation.mutateAsync(
      { id: node.id, targetId: publishedVersion.id },
      {
        onSuccess: () => setHasPublished(true),
        onError: () => {
          setHasPublished(false);
          setError('publishRequests.errors.publishError');
        },
      },
    );
  };

  return (
    <>
      <OneColumn>
        <h1>{t('publishRequests.title')}</h1>
        {error && <ErrorMessage>{t(error)}</ErrorMessage>}
        {hasPublished && (
          <MessageBox showCloseButton onClose={() => setHasPublished(false)}>
            {t('publishRequests.nodePublished')}
          </MessageBox>
        )}
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
                <Button
                  disabled={
                    !publishedVersion || !!error || !userPermissions?.includes(TAXONOMY_ADMIN_SCOPE)
                  }
                  onClick={() => {
                    setShowNodeToPublish(node);
                    setShowAlertModal(true);
                  }}>
                  {t('publishRequests.publishNode')}
                </Button>
              </StyledButtonRow>
            </StyledNodeContainer>
          ))}
        </StyledRequestList>
        <AlertModal
          show={showAlertModal}
          text={t('publishRequests.publishWarning')}
          actions={[
            {
              text: t('form.abort'),
              onClick: () => setShowAlertModal(false),
            },
            {
              text: t('alertModal.continue'),
              onClick: () => {
                setShowAlertModal(false);
                if (nodeToPublish) {
                  onPublish(nodeToPublish);
                }
              },
            },
          ]}
          onCancel={() => setShowAlertModal(false)}
        />
      </OneColumn>
      <Footer />
    </>
  );
};

export default PublishRequestsContainer;
