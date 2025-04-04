/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { ComboboxContent, ComboboxContentProps, Spinner, Text } from "@ndla/primitives";

interface Props extends ComboboxContentProps {
  ref?: RefObject<HTMLDivElement>;
  isFetching: boolean;
  hits: number;
}

export const SearchTagsContent = ({ isFetching, hits, children, ref, ...props }: Props) => {
  const { t } = useTranslation();
  return (
    <ComboboxContent {...props} ref={ref}>
      {isFetching ? <Spinner /> : hits ? children : <Text>{t("dropdown.numberHits", { hits: 0 })}</Text>}
    </ComboboxContent>
  );
};
