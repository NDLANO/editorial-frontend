/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/fp/isEqual";
import { Descendant, Node } from "slate";
import { IArticle, ILicense, IArticleMetaImage } from "@ndla/types-backend/draft-api";
import { blockContentToHTML, inlineContentToHTML } from "./articleContentConverter";
import { isGrepCodeValid } from "./articleUtil";
import { diffHTML } from "./diffHTML";
import { isUserProvidedEmbedDataValid } from "./embedTagHelpers";
import { findNodesByType } from "./slateHelpers";
import { RulesType } from "../components/formikValidationSchema";
import { EmbedElements } from "../components/SlateEditor/plugins/embed";
import { isSlateEmbed } from "../components/SlateEditor/plugins/embed/utils";
import {
  ArticleFormType,
  LearningResourceFormType,
  TopicArticleFormType,
  FrontpageArticleFormType,
} from "../containers/FormikForm/articleFormHooks";

export const DEFAULT_LICENSE: ILicense = {
  description: "Creative Commons Attribution-ShareAlike 4.0 International",
  license: "CC-BY-SA-4.0",
  url: "https://creativecommons.org/licenses/by-sa/4.0/",
};

const checkIfContentHasChanged = (currentValue: Descendant[], initialContent: Descendant[], type: string) => {
  if (currentValue.length !== initialContent.length) return true;
  const toHTMLFunction = type === "standard" || type === "frontpage-article" ? blockContentToHTML : inlineContentToHTML;
  const newHTML = toHTMLFunction(currentValue);

  const diff = diffHTML(newHTML, toHTMLFunction(initialContent));
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
  // Checking specific slate object fields if they really have changed
  const slateFields = [
    "description",
    "introduction",
    "title",
    "metaDescription",
    "content",
    "title",
    "introduction",
    "conceptContent",
    "manuscript",
  ];
  // and skipping fields that only changes on the server
  const skipFields = ["revision", "updated", "updatePublished", "id"];
  const dirtyFields = [];
  Object.entries(values)
    .filter(([key]) => !skipFields.includes(key))
    .forEach(([key, value]) => {
      if (slateFields.includes(key)) {
        if (key === "content" || key === "title" || key === "introduction") {
          if (checkIfContentHasChanged(values[key]!, initialValues[key]!, initialValues.articleType!)) {
            dirtyFields.push(value);
          }
        } else if (typeof value === "object" && !isEqual(value, initialValues[key])) {
          dirtyFields.push(value);
        }
      } else if (!isEqual(value, initialValues[key as keyof T])) {
        dirtyFields.push(value);
      }
    });

  return dirtyFields.length > 0 || changed;
};

export const formikCommonArticleRules: RulesType<ArticleFormType, IArticle> = {
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
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
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
      const wrongFormat = !!values?.grepCodes?.find((value) => !isGrepCodeValid(value));
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

export const learningResourceRules: RulesType<LearningResourceFormType, IArticle> = {
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
        "image-embed",
        "brightcove-embed",
        "h5p",
        "audio",
        "error-embed",
        "external-embed",
      ).map((node) => (node as EmbedElements).data);
      const notValidEmbeds = embeds.filter((embed) => embed && !isUserProvidedEmbedDataValid(embed));
      const embedsHasErrors = notValidEmbeds.length > 0;

      return embedsHasErrors ? { translationKey: "learningResourceForm.validation.missingEmbedData" } : undefined;
    },
    warnings: {
      languageMatch: true,
    },
  },
};

export const frontPageArticleRules: RulesType<FrontpageArticleFormType, IArticle> = {
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

export const topicArticleRules: RulesType<TopicArticleFormType, IArticle> = {
  ...formikCommonArticleRules,
  visualElementAlt: {
    required: false,
    onlyValidateIf: (values) =>
      isSlateEmbed(values.visualElement[0]) && values.visualElement[0].data?.resource === "image",
  },
  visualElementCaption: {
    required: false,
    onlyValidateIf: (values) =>
      isSlateEmbed(values.visualElement[0]) &&
      (values.visualElement[0].data?.resource === "image" || values.visualElement[0].data?.resource === "brightcove"),
    warnings: {
      languageMatch: true,
      apiField: "visualElement",
    },
  },
  visualElement: {
    required: false,
    test: (values) =>
      isSlateEmbed(values.visualElement[0]) && values.visualElement[0].data?.resource !== "image"
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

export const parseImageUrl = (metaImage?: IArticleMetaImage) => {
  if (!metaImage || !metaImage.url || metaImage.url.length === 0) {
    return "";
  }

  const splittedUrl = metaImage.url.split("/");
  return splittedUrl[splittedUrl.length - 1];
};

export const getTagName = (id: string | undefined, data: { id: string; name: string }[] = []) => {
  return id ? data.find((entry) => entry.id === id)?.name : undefined;
};
