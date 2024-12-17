/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { createListCollection, SelectHiddenSelect } from "@ark-ui/react";
import { ArrowDownShortLine, CheckLine } from "@ndla/icons";
import {
  Button,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SelectItem as SelectItemType } from "../../types";

const StyledButtonContent = styled("span", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const collection = createListCollection({
  items: [
    { label: "6", value: "6" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
  ],
});

const StyledSelectTrigger = styled(SelectTrigger, {
  base: {
    width: "unset",
  },
});

interface Props {
  pageSize: SelectItemType;
  setPageSize: (p: SelectItemType) => void;
}

const PageSizeSelect = ({ pageSize, setPageSize }: Props) => {
  const { t } = useTranslation();

  return (
    <SelectRoot<SelectItemType>
      collection={collection}
      positioning={{ sameWidth: true }}
      onValueChange={(details) => setPageSize(details.items[0])}
      value={[pageSize.value]}
    >
      <SelectLabel srOnly>{t("welcomePage.workList.pickPageSize")}</SelectLabel>
      <SelectControl>
        <StyledSelectTrigger asChild>
          <Button variant="secondary" size="small">
            <StyledButtonContent>
              {t("welcomePage.workList.numberOfRows")}:<SelectValueText />
            </StyledButtonContent>
            <SelectIndicator asChild>
              <ArrowDownShortLine />
            </SelectIndicator>
          </Button>
        </StyledSelectTrigger>
      </SelectControl>
      <SelectContent>
        {collection.items.map((item) => (
          <SelectItem item={item} key={item.value}>
            <SelectItemText>{item.label}</SelectItemText>
            <SelectItemIndicator asChild>
              <CheckLine />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
      <SelectHiddenSelect />
    </SelectRoot>
  );
};

export default PageSizeSelect;
