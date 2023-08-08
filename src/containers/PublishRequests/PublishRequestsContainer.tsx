import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { OneColumn } from '@ndla/ui';
import { Fragment, useMemo, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';
import isBefore from 'date-fns/isBefore';
import { SafeLinkButton } from '@ndla/safelink';
import { ChevronRight } from '@ndla/icons/common';
import { Node } from '@ndla/types-taxonomy';
import {
  TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
  TAXONOMY_CUSTOM_FIELD_IS_PUBLISHING,
} from '../../constants';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { toNodeDiff, toStructure } from '../../util/routeHelpers';
import Footer from '../App/components/Footer';
import NodeIconType from '../../components/NodeIconType';

const ErrorMessage = styled.p`
  color: ${colors.support.red};
  margin: 0;
`;

const StyledSpinner = styled(Spinner)`
  margin: 0px;
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
  font-size: ${fonts.sizes(16)};
`;

const PublishRequestsContainer = () => {
  const [error, setError] = useState<string | undefined>();
  const { t } = useTranslation();
  const nodesQuery = useNodes({
    taxonomyVersion: 'default',
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: 'true',
  });

  const sorted = useMemo(
    () => sortBy(nodesQuery?.data, (n) => n.breadcrumbs?.join('')),
    [nodesQuery],
  );

  const versionsQuery = useVersions(
    {},
    {
      onSuccess: (data) => {
        if (!data[0]) {
          setError('publishRequests.errors.noVersions');
        }
      },
    },
  );

  const publishedVersion = versionsQuery.data?.filter((v) => v.versionType === 'PUBLISHED')?.[0];
  const betaVersions = versionsQuery.data
    ?.filter((v) => v.versionType === 'BETA')
    .sort((a, b) => (isBefore(new Date(a.created), new Date(b.created)) ? 1 : -1));

  const otherVersion = betaVersions?.[0] || publishedVersion || versionsQuery.data?.[0];

  const onCompare = (node: Node) => {
    if (!otherVersion) {
      setError('publishRequests.errors.noVersions');
      return '';
    }
    return toNodeDiff(node.id, otherVersion.hash, 'default');
  };

  return (
    <>
      <OneColumn>
        <h1>{t('publishRequests.title')}</h1>
        {error && <ErrorMessage>{t(error)}</ErrorMessage>}
        <h3>{`${t('publishRequests.numberRequests')}: ${sorted?.length ?? 0}`}</h3>
        <StyledRequestList>
          {sorted?.map((node, i) => (
            <StyledNodeContainer key={`node-request-${i}`}>
              <StyledTitleRow>
                <StyledTitleColumn>
                  <StyledBreadCrumb>
                    {node?.breadcrumbs?.map((path, index, arr) => {
                      return (
                        <Fragment key={`${path}_${index}`}>
                          {path}
                          {index + 1 !== arr.length && <ChevronRight />}
                        </Fragment>
                      );
                    })}
                  </StyledBreadCrumb>
                  <StyledTitleRow>
                    <NodeIconType node={node} />
                    {node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_IS_PUBLISHING] === 'true' && (
                      <StyledSpinner size="nsmall" />
                    )}
                    {node.name}
                  </StyledTitleRow>
                </StyledTitleColumn>
              </StyledTitleRow>
              <StyledButtonRow>
                <SafeLinkButton to={toStructure(node.path)}>
                  {t('publishRequests.showInStructure')}
                </SafeLinkButton>
                <SafeLinkButton to={onCompare(node)} disabled={!otherVersion || !!error}>
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
