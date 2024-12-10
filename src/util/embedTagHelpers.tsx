/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ComponentProps, ElementType } from "react";
import { TYPE_NDLA_EMBED } from "../components/SlateEditor/plugins/embed/types";
import { isEmpty } from "../components/validators";
import { Embed } from "../interfaces";

const reduceRegexp = /(-|_)[a-z]/g;

export const reduceElementDataAttributesV2 = (
  attributes: Pick<Attr, "name" | "value">[],
  filter?: string[],
): Record<string, string> => {
  return attributes.reduce<Record<string, string>>((acc, attr) => {
    if (attr.name === "style") {
      return acc;
    }
    if (filter?.length && !filter.includes(attr.name)) {
      return acc;
    }
    if (attr.name.startsWith("data-")) {
      const key = attr.name
        .replace("data-", "")
        // convert "-a" with "A". image-id becomes imageId
        .replace(reduceRegexp, (m) => m.charAt(1).toUpperCase());
      acc[key] = attr.value;
    } else {
      // Handle regular dash attributes like aria-label.
      acc[attr.name] = attr.value;
    }
    return acc;
  }, {});
};

export const parseEmbedTag = (embedTag?: string): Embed | undefined => {
  if (!embedTag) {
    return undefined;
  }
  const el = document.createElement("html");
  el.innerHTML = embedTag;
  const embedElements = el.getElementsByTagName(TYPE_NDLA_EMBED);

  if (embedElements.length !== 1) {
    return undefined;
  }

  const obj = reduceElementDataAttributesV2(Array.from(embedElements[0].attributes));
  delete obj.id;

  return obj as unknown as Embed;
};

const attributeRegex = /[A-Z]/g;

type EmbedProps<T extends object> = {
  [Key in keyof T]: string | undefined;
};

type HTMLPropType<Tag> = Tag extends ElementType ? ComponentProps<Tag> : {};

export const createDataAttributes = <T extends object, R extends boolean = false>(
  data?: EmbedProps<T>,
  bailOnEmpty?: R,
): Record<string, string> | (R extends true ? undefined : never) => {
  const entries = Object.entries(data ?? {});
  if (bailOnEmpty && entries.length === 0) {
    return undefined as R extends true ? undefined : never;
  }
  return entries.reduce<Record<string, string>>((acc, [key, value]) => {
    const newKey = key.replace(attributeRegex, (m) => `-${m.toLowerCase()}`);
    if (value != null && typeof value === "string") {
      if (key === "resourceId") {
        acc["data-resource_id"] = value.toString();
      } else {
        acc[`data-${newKey}`] = value.toString();
      }
    }
    return acc;
  }, {});
};

interface CreateHtmlTag<Tag> {
  tag: Tag;
  data?: HTMLPropType<Tag> & {
    [key: `data-${string}`]: string | undefined;
  };
  children?: string;
  bailOnEmpty?: boolean;
  shorthand?: boolean;
}

const reactToHtmlPropMap: Record<string, string> = {
  className: "class",
  htmlFor: "for",
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  autoComplete: "autocomplete",
  readOnly: "readonly",
  maxLength: "maxlength",
  minLength: "minlength",
  colSpan: "colspan",
  rowSpan: "rowspan",
  contentEditable: "contenteditable",
  tabIndex: "tabindex",
  spellCheck: "spellcheck",
  srcSet: "srcset",
};

const stringifyAttributes = <Tag extends ElementType | "ndlaembed" | "math">(dataAttributes?: HTMLPropType<Tag>) => {
  const keys = Object.entries(dataAttributes ?? {}).reduce<string[]>((acc, [key, value]) => {
    if (value != null) {
      acc.push(`${reactToHtmlPropMap[key] ?? key}="${value}"`);
    }
    return acc;
  }, []);
  if (keys.length) {
    return ` ${keys.join(" ")}`;
  }
  return keys[0] ?? "";
};

export const createHtmlTag = <Tag extends ElementType | "ndlaembed" | "math">({
  tag,
  data,
  children = "",
  bailOnEmpty,
  shorthand,
}: CreateHtmlTag<Tag>): string => {
  if (bailOnEmpty && (!data || Object.keys(data).length === 0)) {
    return children;
  }
  if (shorthand && !children) {
    return `<${tag}/>`;
  }
  return `<${tag}${stringifyAttributes<Tag>(data)}>${children}</${tag}>`;
};

export const createTag = <T extends object>(
  Tag: ElementType | "ndlaembed" | "math",
  data: EmbedProps<T> | undefined,
  children: string | undefined = "",
  opts: { bailOnEmptyData?: boolean },
): string | undefined => {
  const dataAttributes = createDataAttributes(data, opts?.bailOnEmptyData);
  // dataAttributes is undefined if bailOnEmptyData is true and data is empty
  if (!dataAttributes) {
    return undefined;
  }

  return `<${Tag}${stringifyAttributes(dataAttributes)}>${children}</${Tag}>`;
};

export const createEmbedTagV2 = <T extends object>(
  data: EmbedProps<T>,
  children: string | undefined,
): string | undefined => createTag("ndlaembed", data, children, { bailOnEmptyData: true });

export const createEmbedTag = (data: { [key: string]: any } | undefined): string | undefined => {
  if (!data || Object.keys(data).length === 0) {
    return undefined;
  }

  return createTag("ndlaembed", data, "", { bailOnEmptyData: false });
};

export const isUserProvidedEmbedDataValid = (embed: Embed) => {
  if (embed.resource === "image") {
    const isDecorative = embed.isDecorative === "true";
    return isDecorative || (!isDecorative && !isEmpty(embed.alt));
  }
  return true;
};
