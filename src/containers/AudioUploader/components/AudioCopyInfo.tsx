/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { InformationLine } from "@ndla/icons";
import { MessageBox } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { AudioFormikType } from "../../../modules/audio/audioTypes";

interface Props {
  values: AudioFormikType;
}

export const AudioCopyInfo = ({ values }: Props) => {
  const {
    audioFile: { storedFile: { language: copiedLanguage } = {} },
    language,
  } = values;

  const { t, i18n } = useTranslation();

  if (!copiedLanguage) {
    return null;
  }

  const tCopiedLanguage =
    i18n.language === "en" ? t("languages." + copiedLanguage) : t("languages." + copiedLanguage).toLowerCase();

  if (language !== copiedLanguage) {
    return (
      <MessageBox variant="info">
        <InformationLine />
        {t("form.audio.copiedFrom", { language: tCopiedLanguage })}
      </MessageBox>
    );
  }
};
