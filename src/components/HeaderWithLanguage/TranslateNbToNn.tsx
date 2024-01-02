/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import StyledFilledButton from "../../components/StyledFilledButton";
import { useTranslateToNN } from "../NynorskTranslateProvider";

const StyledLink = StyledFilledButton.withComponent(Link);

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
    <StyledLink to={editUrl(id, "nn")} onClick={onClick}>
      {t("form.variant.translate")}
    </StyledLink>
  );
};

export default TranslateNbToNn;
