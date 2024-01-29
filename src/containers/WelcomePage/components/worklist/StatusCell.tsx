/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { Check } from "@ndla/icons/editor";
import { IStatus } from "@ndla/types-backend/search-api";
import { CellWrapper } from "./WorkListTabContent";

const IconWrapper = styled.div`
  overflow: hidden;
`;

const TextWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledCheckIcon = styled(Check)`
  height: 20px;
  width: 20px;
  fill: ${colors.support.green};
`;

interface Props {
  status: IStatus | undefined;
}

const StatusCell = ({ status }: Props) => {
  const { t } = useTranslation();
  const published = status?.current === "PUBLISHED" || status?.other?.includes("PUBLISHED");
  const statusTitle = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : "";

  return (
    <CellWrapper>
      <TextWrapper title={statusTitle}>{statusTitle}</TextWrapper>
      {published && (
        <IconWrapper>
          <StyledCheckIcon title={t("form.workflow.published")} aria-label={t("form.workflow.published")} />
        </IconWrapper>
      )}
    </CellWrapper>
  );
};

export default StatusCell;
