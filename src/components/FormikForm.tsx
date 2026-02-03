/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { Form as _Form } from "formik";

const formCss = css.raw({
  display: "flex",
  flexDirection: "column",
  gap: "medium",
});

export const FormikForm = styled(
  _Form,
  {
    base: formCss,
  },
  { baseComponent: true },
);

export const Form = styled("form", {
  base: formCss,
});

export const FormContent = styled("div", {
  base: formCss,
});

export const FormActionsContainer = styled("div", {
  base: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "3xsmall",
  },
});
