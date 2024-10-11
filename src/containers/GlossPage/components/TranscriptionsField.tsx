/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { styled } from "@ndla/styled-system/jsx";
import { TranscriptionField } from "./TranscriptionField";

const StyledFieldWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xsmall",
    width: "100%",
  },
});

interface Props {
  name: string;
}

const TranscriptionsField = ({ name }: Props) => {
  const [, { value: originalLanguageValue }] = useField<string>("gloss.originalLanguage");

  if (originalLanguageValue !== "zh") {
    return null;
  }

  return (
    <StyledFieldWrapper>
      <TranscriptionField label="Pinyin" name={`${name}.pinyin`} />
      <TranscriptionField label="Traditional" name={`${name}.traditional`} />
    </StyledFieldWrapper>
  );
};

export default TranscriptionsField;
