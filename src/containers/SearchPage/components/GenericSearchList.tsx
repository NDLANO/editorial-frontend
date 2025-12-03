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
import { useStableSearchPageParams } from "../useStableSearchPageParams";

interface Props {
  type: string;
  loading: boolean;
  error: Error | null;
  resultLength: number;
  children: ReactNode;
}

const StyledUl = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

export const GenericSearchList = ({ type, loading, error, resultLength, children }: Props) => {
  const { t } = useTranslation();
  const [params] = useStableSearchPageParams();
  if (loading) return <Spinner />;
  if (error) return <Text color="text.error">{t("searchForm.error")}</Text>;
  if (resultLength === 0) return <Text>{t(`searchPage.${type}NoHits`, { query: params.get("query") ?? "" })}</Text>;
  return <StyledUl>{children}</StyledUl>;
};
