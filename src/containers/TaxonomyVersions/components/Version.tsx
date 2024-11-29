/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { PencilFill, DeleteBinLine } from "@ndla/icons/action";
import { ExternalLinkLine } from "@ndla/icons/common";
import { DoorLockLine } from "@ndla/icons/editor";
import { Text, Button, IconButton, Badge, BadgeVariant } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Version as TaxVersion, VersionType } from "@ndla/types-taxonomy";
import VersionForm from "./VersionForm";
import { AlertDialog } from "../../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../../components/FormikForm";
import config from "../../../config";
import { useDeleteVersionMutation } from "../../../modules/taxonomy/versions/versionMutations";
import { versionQueryKeys } from "../../../modules/taxonomy/versions/versionQueries";

const versionTypeMap: Record<VersionType, BadgeVariant> = {
  PUBLISHED: "brand3",
  BETA: "brand1",
  ARCHIVED: "neutral",
};

const VersionWrapper = styled("div", {
  base: {
    padding: "xsmall",
  },
  variants: {
    isEditing: {
      false: {
        borderBlockEnd: "1px solid",
        borderColor: "stroke.subtle",
      },
    },
  },
});

const VersionContentWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const StyledBadge = styled(Badge, {
  base: {
    marginInlineEnd: "small",
  },
});

const ContentBlock = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const VersionsFormWrapper = styled("div", {
  base: {
    padding: "medium",
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
  },
});

interface Props {
  version: TaxVersion;
}

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

  const deleteDisabled = version.locked || version.versionType === "PUBLISHED";
  return (
    <>
      <VersionWrapper key={`version-${version.id}`} isEditing={isEditing}>
        <VersionContentWrapper>
          <ContentBlock>
            <Text>{version.name}</Text>
            {!!version.locked && (
              <DoorLockLine aria-label={t("taxonomyVersions.locked")} title={t("taxonomyVersions.locked")} />
            )}
          </ContentBlock>
          <ContentBlock>
            <StyledBadge colorTheme={versionTypeMap[version.versionType]}>
              {t(`taxonomyVersions.status.${version.versionType}`)}
            </StyledBadge>
            <SafeLinkIconButton
              size="small"
              variant="secondary"
              target="_blank"
              to={`${config.ndlaFrontendDomain}?versionHash=${version.hash}`}
              aria-label={t("taxonomyVersions.previewVersion")}
              title={t("taxonomyVersions.previewVersion")}
            >
              <ExternalLinkLine />
            </SafeLinkIconButton>
            <IconButton
              variant="secondary"
              size="small"
              aria-label={t("taxonomyVersions.editVersionTooltip")}
              onClick={() => setIsEditing((prev) => !prev)}
              title={t("taxonomyVersions.editVersionTooltip")}
            >
              <PencilFill />
            </IconButton>
            <IconButton
              variant="danger"
              size="small"
              aria-label={deleteTooltip}
              disabled={deleteDisabled}
              onClick={() => (deleteDisabled ? undefined : setShowAlertModal(true))}
              title={deleteTooltip}
            >
              <DeleteBinLine />
            </IconButton>
          </ContentBlock>
          <AlertDialog
            title={t("taxonomyVersions.delete")}
            label={t("taxonomyVersions.delete")}
            show={showAlertModal}
            text={t(`taxonomyVersions.deleteWarning${version.versionType === "PUBLISHED" ? "Published" : ""}`)}
            onCancel={() => setShowAlertModal(false)}
          >
            <FormActionsContainer>
              <Button onClick={() => setShowAlertModal(false)} variant="secondary">
                {t("form.abort")}
              </Button>
              <Button
                onClick={() => {
                  setShowAlertModal(false);
                  onDelete();
                }}
                variant="danger"
              >
                {t("alertModal.delete")}
              </Button>
            </FormActionsContainer>
          </AlertDialog>
        </VersionContentWrapper>
        {!!error && <Text color="text.error">{error}</Text>}
      </VersionWrapper>
      {!!isEditing && (
        <VersionsFormWrapper>
          <VersionForm version={version} existingVersions={[]} onClose={() => setIsEditing(false)} />
        </VersionsFormWrapper>
      )}
    </>
  );
};
export default Version;
