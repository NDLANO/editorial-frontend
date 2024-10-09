/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { ComboboxContent, ComboboxContentProps, ComboboxPositioner, Spinner, Text } from "@ndla/primitives";

interface Props extends ComboboxContentProps {
  isFetching: boolean;
  hits: number;
}

export const SearchTagsContent = forwardRef<HTMLDivElement, Props>(({ isFetching, hits, children, ...props }) => {
  const { t } = useTranslation();
  return (
    <ComboboxPositioner>
      <ComboboxContent {...props}>
        {isFetching ? <Spinner /> : hits ? children : <Text>{t("dropdown.numberHits", { hits: 0 })}</Text>}
      </ComboboxContent>
    </ComboboxPositioner>
  );
});
