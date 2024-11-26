/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";

const priorityMapping = {
  prioritized: "editorFooter.prioritized",
  "on-hold": "welcomePage.workList.onHold",
};

interface Props {
  priority: string | undefined;
  updatePriority: (value: string | undefined) => void;
}

const PrioritySelect = ({ priority, updatePriority }: Props) => {
  const { t } = useTranslation();

  const collection = useMemo(() => {
    return createListCollection({
      items: [
        { label: t(priorityMapping["prioritized"]), value: "prioritized" },
        { label: t(priorityMapping["on-hold"]), value: "on-hold" },
      ],
    });
  }, [t]);

  return (
    <SelectRoot
      collection={collection}
      positioning={{ sameWidth: true }}
      value={priority && Object.keys(priorityMapping).includes(priority) ? [priority] : undefined}
      onValueChange={(details) => updatePriority(details.value[0])}
    >
      <SelectLabel srOnly>{t("taxonomy.addPriority")}</SelectLabel>
      <GenericSelectTrigger variant="secondary" clearable>
        <SelectValueText placeholder={t("editorFooter.placeholderPrioritized")} />
      </GenericSelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <GenericSelectItem item={item} key={item.value}>
            {item.label}
          </GenericSelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default PrioritySelect;
