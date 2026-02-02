/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComboboxContent, ComboboxContentProps, Spinner, Text } from "@ndla/primitives";
import { type Ref } from "react";
import { useTranslation } from "react-i18next";

interface Props extends ComboboxContentProps {
  ref?: Ref<HTMLDivElement>;
  isFetching: boolean;
  hits: number;
}

export const SearchTagsContent = ({ isFetching, hits, children, ...props }: Props) => {
  const { t } = useTranslation();
  return (
    <ComboboxContent {...props}>
      {isFetching ? <Spinner /> : hits ? children : <Text>{t("dropdown.numberHits", { hits: 0 })}</Text>}
    </ComboboxContent>
  );
};
