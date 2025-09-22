/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { SafeLinkButton } from "@ndla/safelink";

interface Props {
  id: number;
  editUrl: (id: number, lang: string) => string;
}

const TranslateNbToNn = ({ id, editUrl }: Props) => {
  const { t } = useTranslation();
  return (
    <SafeLinkButton
      size="small"
      variant="tertiary"
      to={editUrl(id, "nn")}
      state={{ isCreatingLanguage: true, shouldTranslate: true }}
    >
      {t("form.variant.translate")}
    </SafeLinkButton>
  );
};

export default TranslateNbToNn;
