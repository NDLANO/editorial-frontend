/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { IconButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { Launch } from "@ndla/icons/common";
import { DeleteForever, Keyhole } from "@ndla/icons/editor";
import SafeLink from "@ndla/safelink";
import Tooltip from "@ndla/tooltip";
import { Version as TaxVersion, VersionType } from "@ndla/types-taxonomy";
import { StyledErrorMessage } from "./StyledErrorMessage";
import VersionForm from "./VersionForm";
import AlertModal from "../../../components/AlertModal";
import config from "../../../config";
import { useDeleteVersionMutation } from "../../../modules/taxonomy/versions/versionMutations";
import { versionQueryKeys } from "../../../modules/taxonomy/versions/versionQueries";

interface Props {
  version: TaxVersion;
}

interface VersionWrapperProps {
  color: string;
}

const VersionWrapper = styled.div<VersionWrapperProps>`
  display: flex;
  flex-direction: column;
  border: 1.5px solid ${(props) => props.color};
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

const statusColorMap: Record<VersionType, string> = {
  PUBLISHED: colors.support.green,
  BETA: colors.favoriteColor,
  ARCHIVED: colors.brand.grey,
};

const StatusWrapper = styled.div<StatusWrapperProps>`
  border: 1px black;
  border-radius: 100px;
  background-color: ${(props) => props.color};
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
  gap: ${spacing.xsmall};
`;

const StyledLink = styled(SafeLink)`
  box-shadow: inset 0 0;
`;

const StyledLaunch = styled(Launch)`
  height: 24px;
  width: 100%;
  color: ${colors.brand.tertiary};
  margin-right: ${spacing.xsmall};
  &:hover {
    color: ${colors.brand.primary};
  }
`;

const StyledKeyhole = styled(Keyhole)`
  margin-left: ${spacing.xxsmall};
  height: 30px;
  width: 100%;
  color: ${colors.brand.primary};
`;

const Version = ({ version }: Props) => {
  const { t } = useTranslation();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const qc = useQueryClient();
  const key = versionQueryKeys.versions();

  const deleteVersionMutation = useDeleteVersionMutation({
    onMutate: async ({ id }) => {
      setError(undefined);
      await qc.cancelQueries({ queryKey: key });
      const existingVersions = qc.getQueryData<TaxVersion[]>(key) ?? [];
      const withoutDeleted = existingVersions.filter((version) => version.id !== id);
      qc.setQueryData<TaxVersion[]>(key, withoutDeleted);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: () => setError(t("taxonomyVersions.deleteError")),
  });

  const onDelete = async () => {
    await deleteVersionMutation.mutateAsync({ id: version.id });
  };

  const deleteTooltip = version.locked
    ? t("taxonomyVersions.deleteLocked")
    : version.versionType === "PUBLISHED"
      ? t("taxonomyVersions.deletePublished")
      : t("taxonomyVersions.delete");

  const ndlaUrl = `${config.ndlaFrontendDomain}?versionHash=${version.hash}`;

  const deleteDisabled = version.locked || version.versionType === "PUBLISHED";
  return (
    <VersionWrapper color={statusColorMap[version.versionType]} key={`version-${version.id}`}>
      {!isEditing && (
        <VersionContentWrapper>
          <ContentBlock>
            <VersionTitle>{version.name}</VersionTitle>
            {version.locked && (
              <Tooltip tooltip={t("taxonomyVersions.locked")}>
                <div>
                  <StyledKeyhole />
                </div>
              </Tooltip>
            )}
          </ContentBlock>
          <ContentBlock>
            <StatusWrapper color={statusColorMap[version.versionType]}>
              <StyledText>{t(`taxonomyVersions.status.${version.versionType}`)}</StyledText>
            </StatusWrapper>
            <Tooltip tooltip={t("taxonomyVersions.previewVersion")}>
              <StyledLink target={"_blank"} to={ndlaUrl}>
                <StyledLaunch />
              </StyledLink>
            </Tooltip>
            <Tooltip tooltip={t("taxonomyVersions.editVersionTooltip")}>
              <IconButtonV2
                variant="ghost"
                colorTheme="lighter"
                aria-label={t("taxonomyVersions.editVersionTooltip")}
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <Pencil />
              </IconButtonV2>
            </Tooltip>
            <Tooltip tooltip={deleteTooltip}>
              <IconButtonV2
                variant="ghost"
                colorTheme="danger"
                aria-label={deleteTooltip}
                disabled={deleteDisabled}
                onClick={() => (deleteDisabled ? undefined : setShowAlertModal(true))}
                color={deleteDisabled ? undefined : "red"}
              >
                <DeleteForever />
              </IconButtonV2>
            </Tooltip>
          </ContentBlock>
          <AlertModal
            title={t("taxonomyVersions.delete")}
            label={t("taxonomyVersions.delete")}
            show={showAlertModal}
            text={t(`taxonomyVersions.deleteWarning${version.versionType === "PUBLISHED" ? "Published" : ""}`)}
            actions={[
              {
                text: t("form.abort"),
                onClick: () => setShowAlertModal(false),
              },
              {
                text: t("alertModal.continue"),
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
      {isEditing && <VersionForm version={version} existingVersions={[]} onClose={() => setIsEditing(false)} />}
    </VersionWrapper>
  );
};
export default Version;
