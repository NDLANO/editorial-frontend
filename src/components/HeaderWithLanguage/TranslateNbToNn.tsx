/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SafeLinkButton } from "@ndla/safelink";
import { useTranslation } from "react-i18next";

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
      to={{ pathname: editUrl(id, "nn"), search: "?translate=true" }}
      state={{ isCreatingLanguage: true }}
    >
      {t("form.variant.translate")}
    </SafeLinkButton>
  );
};

export default TranslateNbToNn;
