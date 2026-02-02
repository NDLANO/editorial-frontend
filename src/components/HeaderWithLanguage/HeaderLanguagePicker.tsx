/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AddLine } from "@ndla/icons";
import { Button, MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { useTranslation } from "react-i18next";

const LanguagePicker = ({ id, emptyLanguages, editUrl }: Props) => {
  const { t } = useTranslation();
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button size="small" variant="tertiary">
          <AddLine /> {t("form.variant.create")}
        </Button>
      </MenuTrigger>
      <MenuContent>
        {emptyLanguages.map((language) => (
          <MenuItem key={language.key} value={language.key} asChild consumeCss>
            <SafeLink to={editUrl(id, language.key)} state={{ isCreatingLanguage: true }}>
              {language.title}
            </SafeLink>
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
};

interface Props {
  id: number;
  emptyLanguages: {
    key: string;
    title: string;
  }[];
  editUrl: (id: number, url: string) => string;
}

export default LanguagePicker;
