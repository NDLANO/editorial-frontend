/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CheckboxCircleFill } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { StatusDTO } from "@ndla/types-backend/search-api";

const TextWrapper = styled("div", {
  base: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
});

const StyledCheckIcon = styled(CheckboxCircleFill, {
  base: {
    fill: "surface.success",
  },
});

const CellWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "xxsmall",
  },
});

interface Props {
  status: StatusDTO | undefined;
}

const StatusCell = ({ status }: Props) => {
  const { t } = useTranslation();
  const published = status?.current === "PUBLISHED" || status?.other?.includes("PUBLISHED");
  const statusTitle = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : "";

  return (
    <CellWrapper>
      <TextWrapper title={statusTitle}>{statusTitle}</TextWrapper>
      {!!published && (
        <StyledCheckIcon title={t("form.workflow.published")} aria-label={t("form.workflow.published")} size="small" />
      )}
    </CellWrapper>
  );
};

export default StatusCell;
