/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import formatDate from "../../util/formatDate";
import { getExpirationStatus } from "../../util/getExpirationStatus";
import { StatusTimeFill } from "../StatusTimeFill";

interface Props {
  expirationDate: string;
}

export const ResourceStatus = ({ expirationDate }: Props) => {
  const { t } = useTranslation();
  const expirationColor = useMemo(() => getExpirationStatus(expirationDate), [expirationDate]);

  if (!expirationDate || !expirationColor) return null;

  return (
    <StatusTimeFill
      variant={expirationColor}
      title={t(`form.workflow.expiration.${expirationColor}`, {
        date: formatDate(expirationDate),
      })}
      aria-label={t(`form.workflow.expiration.${expirationColor}`, {
        date: formatDate(expirationDate),
      })}
      aria-hidden={false}
    />
  );
};
