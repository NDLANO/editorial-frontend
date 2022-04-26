import styled from '@emotion/styled';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import { OneColumn } from '@ndla/ui';
import { MessageBox } from '@ndla/ui/';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import AlertModal from '../../components/AlertModal';
import { TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from '../../constants';
import { NodeType } from '../../modules/nodes/nodeApiTypes';
import { usePublishNodeMutation } from '../../modules/nodes/nodeMutations';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { toNodeDiff, toStructureBeta } from '../../util/routeHelpers';
import Footer from '../App/components/Footer';

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
  padding-top: ${spacing.normal};
  flex-direction: column;
  gap: ${spacing.small};
`;

const PublishRequestsContainer = () => {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [nodeToPublish, setShowNodeToPublish] = useState<NodeType | undefined>(undefined);
  const [error, setError] = useState<string | undefined>();
  const [hasPublished, setHasPublished] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nodesQuery = useNodes({
    taxonomyVersion: 'default',
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: 'true',
  });

  const publishNodeMutation = usePublishNodeMutation();

  const versionsQuery = useVersions({ taxonomyVersion: 'default', type: 'PUBLISHED' });

  const onShowInStructure = (node: NodeType) => {
    navigate(toStructureBeta(node.path));
  };

  const onCompare = (node: NodeType) => {
    const publishedVersion = versionsQuery.data?.[0];
    if (!publishedVersion) {
      setError('publishRequests.noPublishedVersion');
      return;
    }
    navigate(toNodeDiff(node.id, publishedVersion.hash, 'default'));
  };

  const onPublish = (node: NodeType) => {
    setHasPublished(false);
    const publishedVersion = versionsQuery.data?.[0];
    if (!publishedVersion) {
      setError('publishRequests.noPublishedVersion');
      return;
    }

    setHasPublished(true);
  };

  return (
    <>
      <OneColumn>
        <h1>{t('publishRequests.title')}</h1>
        {hasPublished && (
          <MessageBox showCloseButton onClose={() => setHasPublished(false)}>
            {'publishRequests.nodePublished'}
          </MessageBox>
        )}
        <StyledRequestList>
          {nodesQuery.data?.map((node, i) => (
            <StyledNodeContainer key={`node-request-${i}`}>
              {node.name}
              <StyledButtonRow>
                <Button onClick={() => onShowInStructure(node)}>
                  {t('publishRequests.showInStructure')}
                </Button>
                <Button onClick={() => onCompare(node)}>{t('publishRequests.compare')}</Button>
                <Button
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
