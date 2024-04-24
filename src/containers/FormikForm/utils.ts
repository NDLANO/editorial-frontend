/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikContextType } from "formik";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { ArticleFormType } from "./articleFormHooks";
import { defaultEmbedBlock } from "../../components/SlateEditor/plugins/embed/utils";
import { ImageEmbed } from "../../interfaces";
import { ConceptFormValues } from "../ConceptPage/conceptInterfaces";

export const onSaveAsVisualElement = <T extends ArticleFormType>(
  image: IImageMetaInformationV3,
  formikContext: FormikContextType<ConceptFormValues> | FormikContextType<T>,
) => {
  const { setFieldValue, setFieldTouched } = formikContext;

  if (image) {
    const visualElement: ImageEmbed = {
      resource: "image",
      resource_id: image.id,
      size: "full",
      align: "",
      alt: image.alttext.alttext ?? "",
      caption: image.caption.caption ?? "",
    };
    setFieldValue("visualElement", [defaultEmbedBlock(visualElement)]);
    setTimeout(() => {
      setFieldTouched("visualElement", true, false);
    }, 0);
  }
};
