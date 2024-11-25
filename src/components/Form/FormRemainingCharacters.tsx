/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithRef, forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant, Node } from "slate";
import { FieldHelper, Text, TextProps } from "@ndla/primitives";
import useDebounce from "../../util/useDebounce";

interface Props extends ComponentPropsWithRef<"div"> {
  value: string | Descendant[];
  maxLength: number;
  debounceDuration?: number;
}

const getValueLength = (value: string | Descendant[]) =>
  Node.isNodeList(value)
    ? value.map((node) => Node.string(node)).reduce((acc, curr) => acc + curr, "").length
    : value.length;

export const FormRemainingCharacters = forwardRef<HTMLDivElement, Props & TextProps>(
  ({ value, textStyle = "label.xsmall", maxLength, debounceDuration = 500, ...rest }, ref) => {
    const { t } = useTranslation();
    const debouncedValue = useDebounce(value, debounceDuration);
    const valueLength = getValueLength(value);

    const debouncedValueLength = useMemo(() => getValueLength(debouncedValue), [debouncedValue]);

    return (
      <>
        <Text textStyle={textStyle} ref={ref} {...rest}>
          {t("form.remainingCharacters", { remaining: maxLength - valueLength, maxLength })}
        </Text>
        <FieldHelper srOnly aria-live="polite">
          {t("form.remainingCharacters", { remaining: maxLength - debouncedValueLength, maxLength })}
        </FieldHelper>
      </>
    );
  },
);
