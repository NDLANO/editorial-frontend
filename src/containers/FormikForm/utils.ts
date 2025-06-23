/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikContextType } from "formik";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { ImageEmbedData } from "@ndla/types-embed";
import { ArticleFormType } from "./articleFormHooks";
import { defaultEmbedBlock } from "../../components/SlateEditor/plugins/embed/utils";
import { ConceptFormValues } from "../ConceptPage/conceptInterfaces";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { postSearchConcepts } from "../../modules/concept/conceptApi";
import { PUBLISHED } from "../../constants";

export const onSaveAsVisualElement = <T extends ArticleFormType>(
  image: IImageMetaInformationV3DTO,
  formikContext: FormikContextType<ConceptFormValues> | FormikContextType<T>,
) => {
  const { setFieldValue, setFieldTouched } = formikContext;

  if (image) {
    const visualElement: ImageEmbedData = {
      resource: "image",
      resourceId: image.id,
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

export const hasUnpublishedConcepts = async (article: IArticleDTO | undefined) => {
  if (!article?.content?.content) return false;

  const parser = new DOMParser();
  const parsedContent = parser.parseFromString(article.content.content, "text/html");
  const concepts = parsedContent.querySelectorAll('[data-resource="concept"]');
  const conceptIds = Array.from(concepts).map((el) => el.getAttribute("data-content-id"));
  const convertedIds = Array.from(new Set(conceptIds.filter((id) => !!id).map(Number)));

  if (!convertedIds.length) return false;

  const response = await postSearchConcepts({ ids: convertedIds, status: [PUBLISHED] });

  return response.results.length !== convertedIds.length;
};
