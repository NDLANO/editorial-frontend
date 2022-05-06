/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import { DeleteForever, Keyhole } from '@ndla/icons/editor';
import { Pencil } from '@ndla/icons/action';
import { Launch } from '@ndla/icons/common';
import { VersionStatusType, VersionType } from '../../../modules/taxonomy/versions/versionApiTypes';
import IconButton from '../../../components/IconButton';
import VersionForm from './VersionForm';
import { useDeleteVersionMutation } from '../../../modules/taxonomy/versions/versionMutations';
import AlertModal from '../../../components/AlertModal';
import { StyledErrorMessage } from '../../StructurePage/folderComponents/styles';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import config from '../../../config';
import { versionsQueryKey } from '../../../modules/taxonomy/versions/versionQueries';

interface Props {
  version: VersionType;
}

interface VersionWrapperProps {
  color: string;
}

const VersionWrapper = styled.div<VersionWrapperProps>`
  display: flex;
  flex-direction: column;
  border: 1.5px solid ${props => props.color};
  border-radius: 10px;
  padding: ${spacing.small};
`;

const VersionContentWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const VersionTitle = styled.h2`
  margin: 0;
`;

interface StatusWrapperProps {
  color: string;
}

const statusColorMap: Record<VersionStatusType, string> = {
  PUBLISHED: colors.support.green,
  BETA: colors.favoriteColor,
  ARCHIVED: colors.brand.grey,
};

const StatusWrapper = styled.div<StatusWrapperProps>`
  border: 1px black;
  border-radius: 100px;
  background-color: ${props => props.color};
  padding: 2px ${spacing.normal};
  margin-right: ${spacing.small};
`;

const StyledText = styled.span`
  color: #ffffff;
`;

const ContentBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledLink = styled(SafeLink)`
  box-shadow: inset 0 0;
`;

const linkIconCss = css`
  height: 24px;
  width: 100%;
  color: ${colors.brand.tertiary};
  margin-right: ${spacing.xsmall};
  &:hover {
    color: ${colors.brand.primary};
  }
`;

const iconCss = css`
  margin-left: ${spacing.xxsmall};
  height: 30px;
  width: 100%;
  color: ${colors.brand.primary};
`;

const Version = ({ version }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const qc = useQueryClient();
  const key = versionsQueryKey({ taxonomyVersion: 'default' });

  const deleteVersionMutation = useDeleteVersionMutation({
    onMutate: async ({ id }) => {
      setError(undefined);
      await qc.cancelQueries(key);
      const existingVersions = qc.getQueryData<VersionType[]>(key) ?? [];
      const withoutDeleted = existingVersions.filter(version => version.id !== id);
      qc.setQueryData<VersionType[]>(key, withoutDeleted);
    },
    onSuccess: () => qc.invalidateQueries(key),
    onError: () => setError(t('taxonomyVersions.deleteError')),
  });

  const onDelete = async () => {
    await deleteVersionMutation.mutateAsync({ id: version.id, taxonomyVersion });
  };

  const deleteTooltip = version.locked
    ? t('taxonomyVersions.deleteLocked')
    : version.versionType === 'PUBLISHED'
    ? t('taxonomyVersions.deletePublished')
    : t('taxonomyVersions.delete');

  const ndlaUrl = `${config.ndlaFrontendDomain}?versionHash=${version.hash}`;

  const deleteDisabled = version.locked || version.versionType === 'PUBLISHED';
  return (
    <VersionWrapper color={statusColorMap[version.versionType]} key={`version-${version.id}`}>
      {!isEditing && (
        <VersionContentWrapper>
          <ContentBlock>
            <VersionTitle>{version.name}</VersionTitle>
            {version.locked && (
              <Tooltip tooltip={t('taxonomyVersions.locked')}>
                <Keyhole css={iconCss} />
              </Tooltip>
            )}
          </ContentBlock>
          <ContentBlock>
            <StatusWrapper color={statusColorMap[version.versionType]}>
              <StyledText>{t(`taxonomyVersions.status.${version.versionType}`)}</StyledText>
            </StatusWrapper>
            <Tooltip tooltip={t('taxonomyVersions.previewVersion')}>
              <StyledLink target={'_blank'} to={ndlaUrl}>
                <Launch css={linkIconCss} />
              </StyledLink>
            </Tooltip>
            <Tooltip tooltip={t('taxonomyVersions.editVersionTooltip')}>
              <IconButton onClick={() => setIsEditing(prev => !prev)}>
                <Pencil />
              </IconButton>
            </Tooltip>
            <Tooltip tooltip={deleteTooltip}>
              <IconButton
                isDisabled={deleteDisabled}
                onClick={() => (deleteDisabled ? undefined : setShowAlertModal(true))}
                color={deleteDisabled ? undefined : 'red'}>
                <DeleteForever />
              </IconButton>
            </Tooltip>
          </ContentBlock>
          <AlertModal
            show={showAlertModal}
            text={t(
              `taxonomyVersions.deleteWarning${
                version.versionType === 'PUBLISHED' ? 'Published' : ''
              }`,
            )}
            actions={[
              {
                text: t('form.abort'),
                onClick: () => setShowAlertModal(false),
              },
              {
                text: t('alertModal.continue'),
                onClick: () => {
                  setShowAlertModal(false);
                  onDelete();
                },
              },
            ]}
            onCancel={() => setShowAlertModal(false)}
          />
        </VersionContentWrapper>
      )}
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
      {isEditing && (
        <VersionForm version={version} existingVersions={[]} onClose={() => setIsEditing(false)} />
      )}
    </VersionWrapper>
  );
};
export default Version;
