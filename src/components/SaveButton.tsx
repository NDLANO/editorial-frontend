/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckboxCircleFill } from "@ndla/icons";
import { Button, ButtonProps } from "@ndla/primitives";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props extends ButtonProps {
  showSaved?: boolean;
  defaultText?: string;
  formIsDirty?: boolean;
}

const SaveButton = ({ loading, showSaved, defaultText, variant, formIsDirty = true, disabled, ...rest }: Props) => {
  const { t } = useTranslation();
  const modifier = useMemo(() => {
    if (loading) return "saving";
    if (showSaved) return "saved";
    return defaultText || "save";
  }, [defaultText, loading, showSaved]);

  const disabledButton = loading || !formIsDirty || disabled;

  return (
    <Button disabled={disabledButton} variant={loading || showSaved ? "success" : variant} {...rest}>
      {t(`form.${modifier}`)}
      {!!showSaved && <CheckboxCircleFill />}
    </Button>
  );
};

export default SaveButton;
