/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual } from "lodash-es";
import { Descendant, Node } from "slate";
import { isElementOfType } from "@ndla/editor";
import { licenses } from "@ndla/licenses";
import { IArticleDTO, ILicenseDTO, IArticleMetaImageDTO } from "@ndla/types-backend/draft-api";
import { blockContentToHTML, inlineContentToEditorValue } from "./articleContentConverter";
import { isGrepCodeValid } from "./articleUtil";
import { diffHTML } from "./diffHTML";
import { isUserProvidedEmbedDataValid } from "./embedTagHelpers";
import { findNodesByType } from "./slateHelpers";
import { RulesType } from "../components/formikValidationSchema";
import {
  ArticleFormType,
  LearningResourceFormType,
  TopicArticleFormType,
  FrontpageArticleFormType,
} from "../containers/FormikForm/articleFormHooks";
import { isImageElement } from "../components/SlateEditor/plugins/image/queries";
import { IMAGE_ELEMENT_TYPE } from "../components/SlateEditor/plugins/image/types";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../components/SlateEditor/plugins/video/types";

export const DEFAULT_LICENSE: ILicenseDTO = {
  description: "Creative Commons Attribution-ShareAlike 4.0 International",
  license: licenses.CC_BY_SA_4,
  url: "https://creativecommons.org/licenses/by-sa/4.0/",
};

const checkIfContentHasChanged = (currentValue: Descendant[], initialContent: Descendant[]) => {
  if (currentValue.length !== initialContent.length) return true;
  const diff = diffHTML(blockContentToHTML(currentValue), blockContentToHTML(initialContent));
  return diff;
};

interface FormikFields {
  description?: Descendant[];
  introduction?: Descendant[];
  title?: Descendant[];
  metaDescription?: Descendant[];
  content?: Descendant[];
  conceptContent?: Descendant[];
  manuscript?: Descendant[];
  articleType?: string;
  [x: string]: any;
}

interface FormikFormDirtyParams<T extends FormikFields> {
  values: T;
  initialValues: T;
  dirty?: boolean;
  changed?: boolean;
}

export const isFormikFormDirty = <T extends FormikFields>({
  values,
  initialValues,
  dirty = false,
  changed = false,
}: FormikFormDirtyParams<T>) => {
  if (!dirty) {
    return changed;
  }

  // Skipping fields that only changes on the server
  const skipFields = ["revision", "updated", "updatePublished", "id"];
  const dirtyFields = [];

  const allKeys = new Set([...Object.keys(values), ...Object.keys(initialValues)]);
  allKeys.forEach((key) => {
    if (skipFields.includes(key)) return;
    const initialValue = initialValues[key];
    const value = values[key];

    if (Array.isArray(value) && value.length > 0 && Node.isNodeList(value)) {
      if (checkIfContentHasChanged(values[key]!, initialValues[key]!)) {
        dirtyFields.push(value);
      }
    } else if (!isEqual(value, initialValue)) {
      dirtyFields.push(value);
    }
  });

  return dirtyFields.length > 0 || changed;
};

export const formikCommonArticleRules: RulesType<ArticleFormType, IArticleDTO> = {
  title: {
    required: true,
    maxLength: 256,
    warnings: {
      languageMatch: true,
    },
  },
  introduction: {
    maxLength: 300,
    warnings: {
      languageMatch: true,
    },
  },
  metaDescription: {
    maxLength: 155,
    warnings: {
      languageMatch: true,
    },
  },
  tags: {
    required: true,
    minItems: 3,
    warnings: {
      languageMatch: true,
    },
  },
  creators: {
    rules: {
      name: {
        required: true,
        translationKey: "form.name.name",
      },
      type: {
        required: true,
        translationKey: "form.name.type",
      },
    },
  },
  processors: {
    rules: {
      name: {
        required: true,
        translationKey: "form.name.name",
      },
      type: {
        required: true,
        translationKey: "form.name.type",
      },
    },
  },
  rightsholders: {
    rules: {
      name: {
        required: true,
        translationKey: "form.name.name",
      },
      type: {
        required: true,
        translationKey: "form.name.type",
      },
    },
  },
  license: {
    required: false,
    test: (values) => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (values.license === "N/A" || authors.length > 0) return undefined;
      return { translationKey: "validation.noLicenseWithoutCopyrightHolder" };
    },
  },
  notes: {
    required: false,
    test: (values) => {
      const emptyNote = values.notes?.find((note) => note.length === 0);
      if (emptyNote !== undefined) {
        return { translationKey: "validation.noEmptyNote" };
      }
      return undefined;
    },
  },
  grepCodes: {
    required: false,
    test: (values) => {
      const wrongFormat = !!values?.grepCodes?.find((value) => !isGrepCodeValid(value, ["KE", "KM", "TT"]));
      return wrongFormat ? { translationKey: "validation.grepCodes" } : undefined;
    },
  },
  revisionMeta: {
    test: (values) => {
      const emptyNote = values.revisionMeta?.find((meta) => meta.note.length === 0);
      if (emptyNote !== undefined) {
        return { translationKey: "validation.noEmptyRevision" };
      }
      return undefined;
    },
  },
  revisionError: {
    test: (values) => {
      const revisionItems = values.revisionMeta.length ?? 0;
      if (!revisionItems) {
        return { translationKey: "validation.missingRevision" };
      }
      const unfinishedRevision = values.revisionMeta.some((rev) => rev.status === "needs-revision");
      if (!unfinishedRevision) {
        return { translationKey: "validation.unfinishedRevision" };
      }
      return undefined;
    },
  },
  responsibleId: {
    required: false,
  },
  comments: {
    required: false,
  },
  prioritized: {
    required: false,
  },
};

export const learningResourceRules: RulesType<LearningResourceFormType, IArticleDTO> = {
  ...formikCommonArticleRules,
  metaImageAlt: {
    required: true,
    onlyValidateIf: (values) => !!values.metaImageId,
    warnings: {
      languageMatch: true,
      apiField: "metaImage",
    },
  },
  content: {
    required: true,
    test: (values) => {
      const embeds = findNodesByType(
        values.content ?? [],
        "image",
        "brightcove",
        "h5p",
        "audio",
        "error-embed",
        "external",
      );
      const notValidEmbeds = embeds.filter((embed) => embed.data && !isUserProvidedEmbedDataValid(embed.data));
      const embedsHasErrors = notValidEmbeds.length > 0;

      return embedsHasErrors ? { translationKey: "learningResourceForm.validation.missingEmbedData" } : undefined;
    },
    warnings: {
      languageMatch: true,
    },
  },
  disclaimer: {
    warnings: {
      languageMatch: true,
    },
  },
};

export const frontPageArticleRules: RulesType<FrontpageArticleFormType, IArticleDTO> = {
  ...learningResourceRules,
  slug: {
    required: true,
    onlyValidateIf: (values) => values.slug !== undefined,
    test: (values) => {
      const containsIllegalCharacters = values.slug?.replace(/[^a-zA-Z0-9-]/g, "").length !== values.slug?.length;
      return containsIllegalCharacters ? { translationKey: "frontpageArticleForm.validation.illegalSlug" } : undefined;
    },
    warnings: {
      languageMatch: true,
    },
  },
};

export const topicArticleRules: RulesType<TopicArticleFormType, IArticleDTO> = {
  ...formikCommonArticleRules,
  visualElementAlt: {
    required: false,
    onlyValidateIf: (values) => isImageElement(values.visualElement[0]),
  },
  visualElementCaption: {
    required: false,
    onlyValidateIf: (values) => isElementOfType(values.visualElement[0], [IMAGE_ELEMENT_TYPE, BRIGHTCOVE_ELEMENT_TYPE]),
    warnings: {
      languageMatch: true,
      apiField: "visualElement",
    },
  },
  visualElement: {
    required: false,
    test: (values) =>
      isImageElement(values.visualElement[0])
        ? { translationKey: "topicArticleForm.validation.illegalResource" }
        : undefined,
  },
  content: {
    required: false,
    test: (values) =>
      Node.string(values.content[0]) !== "" || values.content.length > 1
        ? { translationKey: "topicArticleForm.validation.containsContent" }
        : undefined,
    warnings: {
      languageMatch: true,
    },
  },
  metaImageAlt: {
    warnings: {
      languageMatch: true,
      apiField: "metaImage",
    },
  },
};

export const parseImageUrl = (metaImage?: IArticleMetaImageDTO) => {
  if (!metaImage || !metaImage.url || metaImage.url.length === 0) {
    return "";
  }

  const splittedUrl = metaImage.url.split("/");
  return splittedUrl[splittedUrl.length - 1];
};

export const stripInlineContentHtmlTags = (html: string): string =>
  inlineContentToEditorValue(html, true)
    .map((n) => Node.string(n))
    .join("");
