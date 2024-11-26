/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArray } from "formik";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import { Button, FieldsetLegend, FieldsetRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IGlossExample } from "@ndla/types-backend/concept-api";
import ExampleField from "./ExampleField";
import { emptyGlossExample } from "../glossData";

const StyledFieldsetRoot = styled(FieldsetRoot, {
  base: {
    width: "100%",
    alignItems: "flex-start",
    gap: "small",
  },
});

type Props = {
  name: string;
  examples: IGlossExample[];
  removeFromParentArray: () => void;
  index: number;
};

const LanguageVariantFieldArray = ({ examples, name, index, removeFromParentArray }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledFieldsetRoot>
      <FieldsetLegend>{t("form.gloss.examples.exampleOnIndex", { index: index + 1 })}</FieldsetLegend>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <>
            {examples?.map((example, exampleIndex) => (
              <ExampleField
                key={exampleIndex}
                name={`${name}.${exampleIndex}`}
                example={example}
                index={index}
                exampleIndex={exampleIndex}
                onRemoveExample={() =>
                  examples.length === 1 ? removeFromParentArray() : arrayHelpers.remove(exampleIndex)
                }
              />
            ))}
            <Button variant="secondary" size="small" onClick={() => arrayHelpers.push(emptyGlossExample)}>
              {t("form.gloss.add", {
                label: t(`form.gloss.languageVariant`).toLowerCase(),
              })}
            </Button>
            <Button variant="danger" size="small" onClick={removeFromParentArray}>
              <DeleteBinLine size="small" />
              {t("form.gloss.examples.remove", { index: index + 1 })}
            </Button>
          </>
        )}
      />
    </StyledFieldsetRoot>
  );
};

export default LanguageVariantFieldArray;
