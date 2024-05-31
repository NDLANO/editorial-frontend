/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { utils } from "@ndla/core";
import { FieldHelper } from "@ndla/forms";
import useDebounce from "../../util/useDebounce";

interface Props extends ComponentPropsWithRef<"div"> {
  value: number;
  maxLength: number;
  debounceDuration?: number;
}

const StyledFieldHelper = styled(FieldHelper)`
  ${utils.visuallyHidden};
`;

export const FormRemainingCharacters = forwardRef<HTMLDivElement, Props>(
  ({ value, maxLength, debounceDuration = 500, ...rest }, ref) => {
    const { t } = useTranslation();
    const debouncedValue = useDebounce(value, debounceDuration);
    return (
      <>
        <div ref={ref} {...rest}>
          {t("form.remainingCharacters", { remaining: maxLength - value, maxLength })}
        </div>
        <StyledFieldHelper aria-live="polite">
          {t("form.remainingCharacters", { remaining: maxLength - debouncedValue, maxLength })}
        </StyledFieldHelper>
      </>
    );
  },
);
