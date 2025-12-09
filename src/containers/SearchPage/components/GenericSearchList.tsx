/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  type: string;
  loading: boolean;
  error: Error | null;
  resultLength: number;
  query: string | undefined | null;
  children: ReactNode;
}

const StyledUl = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

export const GenericSearchList = ({ type, query, loading, error, resultLength, children }: Props) => {
  const { t } = useTranslation();
  if (loading) return <Spinner data-testid="loading-spinner" />;
  if (error) return <Text color="text.error">{t("searchForm.error")}</Text>;
  if (resultLength === 0) return <Text>{t(`searchPage.${type}NoHits`, { query: query ?? "" })}</Text>;
  return <StyledUl>{children}</StyledUl>;
};
