/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RESOURCE_FILTER_CORE, RESOURCE_FILTER_SUPPLEMENTARY } from "../../constants";

interface Props {
  relevanceId: string | undefined;
  onChange: (id: string) => void;
}

const RelevanceOptionSwitch = ({ relevanceId, onChange }: Props) => {
  const { t } = useTranslation();

  const [checked, setChecked] = useState((relevanceId ?? RESOURCE_FILTER_CORE) === RESOURCE_FILTER_CORE);

  return (
    <SwitchRoot
      checked={checked}
      title={t("form.topics.RGTooltip")}
      onCheckedChange={(details) => {
        onChange(details.checked ? RESOURCE_FILTER_CORE : RESOURCE_FILTER_SUPPLEMENTARY);
        setChecked(details.checked);
      }}
    >
      <SwitchLabel srOnly>{t("form.topics.RGTooltip")}</SwitchLabel>
      <SwitchControl>
        <SwitchThumb>{checked ? "K" : "T"}</SwitchThumb>
      </SwitchControl>
      <SwitchHiddenInput />
    </SwitchRoot>
  );
};

export default RelevanceOptionSwitch;
