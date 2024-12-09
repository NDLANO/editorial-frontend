/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import isObject from "lodash/fp/isObject";
import { ElementType, ReactNode, type JSX } from "react";
import { TYPE_AUDIO } from "../components/SlateEditor/plugins/audio/types";
import { TYPE_NDLA_EMBED } from "../components/SlateEditor/plugins/embed/types";
import { TYPE_IMAGE } from "../components/SlateEditor/plugins/image/types";
import { isEmpty } from "../components/validators";
import { Dictionary, Embed } from "../interfaces";

const reduceRegexp = /(-|_)[a-z]/g;

export const reduceElementDataAttributesV2 = (
  attributes: Pick<Attr, "name" | "value">[],
  filter?: string[],
): Record<string, string> => {
  const _attributes = attributes.filter((a) => a.name !== "style");
  const filteredAttributes = filter?.length ? _attributes.filter((a) => filter.includes(a.name)) : _attributes;
  return filteredAttributes.reduce<Record<string, string>>((acc, attr) => {
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

export const reduceElementDataAttributes = (el: Element, filter?: string[]): { [key: string]: string } => {
  if (!el.attributes) return {};
  let attrs: Attr[] = [].slice.call(el.attributes);
  attrs = attrs.filter((a) => a.name !== "style");

  if (filter) attrs = attrs.filter((a) => filter.includes(a.name));
  const obj = attrs.reduce((all, attr) => Object.assign({}, all, { [attr.name.replace("data-", "")]: attr.value }), {});
  return obj;
};

export const reduceChildElements = (el: HTMLElement, type: string) => {
  const children: object[] = [];
  el.childNodes.forEach((node) => {
    const childElement = node as HTMLElement;
    if (type === "file") {
      children.push({
        ...childElement.dataset,
      });
    } else if (type === "related-content") {
      if (childElement.dataset) {
        const convertedDataset = Object.keys(childElement.dataset).reduce((acc, curr) => {
          const currValue = childElement.dataset[curr];
          if (curr === "articleId")
            return {
              ...acc,
              "article-id": currValue,
            };
          return {
            ...acc,
            [curr]: currValue,
          };
        }, {});
        children.push(convertedDataset);
      }
    } else {
      children.push(childElement.dataset);
    }
  });

  return { nodes: children };
};

export const createProps = (obj: Dictionary<string>) =>
  Object.keys(obj)
    .filter((key) => obj[key] !== undefined && !isObject(obj[key]))
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

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

  const resource = embedElements[0].getAttribute("data-resource");
  const obj =
    resource === TYPE_AUDIO || resource === TYPE_IMAGE
      ? reduceElementDataAttributesV2(Array.from(embedElements[0].attributes))
      : reduceElementDataAttributes(embedElements[0]);
  delete obj.id;

  return obj as unknown as Embed;
};

const attributeRegex = /[A-Z]/g;

type EmbedProps<T extends object> = {
  [Key in keyof T]: string | undefined;
};

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

export const createTag = <T extends object>(
  Tag: ElementType,
  data: EmbedProps<T> | undefined,
  children: ReactNode[] | undefined,
  opts: { bailOnEmptyData?: boolean },
  key: string | undefined,
): JSX.Element | undefined => {
  const dataAttributes = createDataAttributes(data, opts?.bailOnEmptyData);
  // dataAttributes is undefined if bailOnEmptyData is true and data is empty
  if (!dataAttributes) {
    return undefined;
  }

  return (
    <Tag {...dataAttributes} key={key}>
      {children}
    </Tag>
  );
};

export const createEmbedTagV2 = <T extends object>(
  data: EmbedProps<T>,
  children: ReactNode[] | undefined,
  key: string | undefined,
): JSX.Element | undefined => createTag("ndlaembed", data, children, { bailOnEmptyData: true }, key);

export const createEmbedTag = (data: { [key: string]: any } | undefined, key: string | undefined) => {
  if (!data || Object.keys(data).length === 0) {
    return undefined;
  }
  const props: Dictionary<string> = {};
  Object.keys(data)
    .filter((key) => data[key] !== undefined && !isObject(data[key]))
    .forEach((key) => (props[`data-${key}`] = data[key]));

  return <ndlaembed key={key} {...props}></ndlaembed>;
};

export const isUserProvidedEmbedDataValid = (embed: Embed) => {
  if (embed.resource === "image") {
    const isDecorative = embed.isDecorative === "true";
    return isDecorative || (!isDecorative && !isEmpty(embed.alt));
  }
  return true;
};
