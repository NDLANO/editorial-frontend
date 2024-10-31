/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SafeLinkButton } from "@ndla/safelink";
import { useTranslateToNN } from "../NynorskTranslateProvider";

interface Props {
  id: number;
  editUrl: (id: number, lang: string) => string;
}

const TranslateNbToNn = ({ id, editUrl }: Props) => {
  const { setShouldTranslate } = useTranslateToNN();

  const onClick = useCallback(() => {
    setShouldTranslate(true);
  }, [setShouldTranslate]);

  const { t } = useTranslation();
  return (
    <SafeLinkButton size="small" variant="tertiary" to={editUrl(id, "nn")} onClick={onClick}>
      {t("form.variant.translate")}
    </SafeLinkButton>
  );
};

export default TranslateNbToNn;
