/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { valueWithTwoImageEmbeds, valueWithInlineFootnotesAndContentLinks } from "./slateMockValues";
import { isFormikFormDirty } from "../formHelper";

test("util/formHelper isFormikFormDirty is true", () => {
  const initialValues = {
    someRandomField: "",
  };
  const values = {
    someRandomField: "This is a test",
  };
  expect(isFormikFormDirty({ dirty: true, values, initialValues })).toBe(true);
});

test("util/formHelper isFormDirty is false", () => {
  const initialValues = {
    articleType: "standard",
    content: [valueWithTwoImageEmbeds, valueWithInlineFootnotesAndContentLinks] as Descendant[],
  };
  const values = {
    articleType: "standard",
    content: [valueWithTwoImageEmbeds, valueWithInlineFootnotesAndContentLinks] as Descendant[],
  };
  expect(
    isFormikFormDirty({
      dirty: true,
      values,
      initialValues,
    }),
  ).toBe(false);
});

test("util/formHelper isFormikFormDirty content sections is removed", () => {
  const initialValues = {
    articleType: "standard",
    content: [valueWithTwoImageEmbeds, valueWithInlineFootnotesAndContentLinks] as Descendant[],
  };
  const values = {
    content: [valueWithTwoImageEmbeds],
  };
  expect(
    isFormikFormDirty({
      dirty: true,
      values,
      initialValues,
    }),
  ).toBe(true);
});
