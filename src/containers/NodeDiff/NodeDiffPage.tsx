import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import Footer from '../app/components/Footer';
import DiffOptions from './DiffOptions';
import NodeDiffcontainer from './NodeDiffContainer';

const StyledNodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  padding-top: ${spacing.normal};
`;

const NodeDiffPage = () => {
  const { nodeId } = useParams();
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const originalHash = params.get('originalHash');
  const otherHash = params.get('otherHash') ?? undefined;

  if (!originalHash || !nodeId) {
    return (
      <OneColumn>
        <h1>{t('diff.error.originalHashRequired')}</h1>
      </OneColumn>
    );
  }

  return (
    <>
      <OneColumn>
        <StyledNodeContainer>
          <DiffOptions originalHash={originalHash} otherHash={otherHash} />
          <NodeDiffcontainer
            originalHash={originalHash}
            otherHash={otherHash ?? undefined}
            nodeId={nodeId}
          />
        </StyledNodeContainer>
      </OneColumn>
      <Footer />
    </>
  );
};
export default NodeDiffPage;
