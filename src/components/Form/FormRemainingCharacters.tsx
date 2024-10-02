/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { FieldHelper } from "@ndla/primitives";
import useDebounce from "../../util/useDebounce";

interface Props extends ComponentPropsWithRef<"div"> {
  value: number;
  maxLength: number;
  debounceDuration?: number;
}

export const FormRemainingCharacters = forwardRef<HTMLDivElement, Props>(
  ({ value, maxLength, debounceDuration = 500, ...rest }, ref) => {
    const { t } = useTranslation();
    const debouncedValue = useDebounce(value, debounceDuration);
    return (
      <>
        <div ref={ref} {...rest}>
          {t("form.remainingCharacters", { remaining: maxLength - value, maxLength })}
        </div>
        <FieldHelper srOnly aria-live="polite">
          {t("form.remainingCharacters", { remaining: maxLength - debouncedValue, maxLength })}
        </FieldHelper>
      </>
    );
  },
);
