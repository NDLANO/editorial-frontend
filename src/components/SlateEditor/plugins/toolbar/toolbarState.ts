/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import merge from "lodash/merge";
import { Editor, Element, Node } from "slate";
import { ElementType } from "../../interfaces";

export const languages = ["ar", "de", "en", "es", "fr", "la", "no", "se", "sma", "so", "ti", "zh"] as const;

export type TextType = "normal-text" | "heading-2" | "heading-3" | "heading-4";
export type MarkType = "bold" | "italic" | "code" | "sub" | "sup";
export type BlockType = "quote" | "definition-list" | "numbered-list" | "bulleted-list" | "letter-list";
export type InlineType = "content-link" | "mathml" | "concept-inline" | "gloss-inline";
export type TableType = "left" | "center" | "right";
export type LanguageType = (typeof languages)[number];

type ToolbarMap = {
  text: TextType;
  mark: MarkType;
  block: BlockType;
  inline: InlineType;
  table: TableType;
  languages: LanguageType;
};

export type ToolbarCategories = keyof ToolbarMap;
export type ToolbarValues = ToolbarMap[keyof ToolbarMap];

export type ToolbarAction = {
  [T in ToolbarCategories]: {
    category: T;
    value: ToolbarMap[T];
  };
}[ToolbarCategories];

export type OptionsType = {
  [Property in ToolbarCategories]: Record<ToolbarMap[Property], ToolbarValue<ToolbarMap[Property]>>;
};

interface ToolbarOption {
  disabled?: boolean;
  hidden?: boolean;
}

export interface ToolbarValue<T extends ToolbarValues> extends ToolbarOption {
  value: T;
}

/**
 * All available options for the toolbar.
 * This is not meant for external use. Rather, it is used to generate the toolbar.
 */
export const allOptions: OptionsType = {
  text: {
    "normal-text": { value: "normal-text" },
    "heading-2": { value: "heading-2" },
    "heading-3": { value: "heading-3" },
    "heading-4": { value: "heading-4" },
  },
  mark: {
    bold: { value: "bold" },
    italic: { value: "italic" },
    code: { value: "code" },
    sub: { value: "sub" },
    sup: { value: "sup" },
  },
  block: {
    quote: { value: "quote" },
    "definition-list": { value: "definition-list" },
    "numbered-list": { value: "numbered-list" },
    "bulleted-list": { value: "bulleted-list" },
    "letter-list": { value: "letter-list" },
  },
  inline: {
    "content-link": { value: "content-link" },
    mathml: { value: "mathml" },
    "concept-inline": { value: "concept-inline" },
    "gloss-inline": { value: "gloss-inline" },
  },
  table: {
    left: { value: "left" },
    center: { value: "center" },
    right: { value: "right" },
  },
  languages: languages.reduce(
    (acc, lang) => {
      acc[lang] = { value: lang };
      return acc;
    },
    {} as Record<LanguageType, ToolbarValue<LanguageType>>,
  ),
};

export type CategoryFilters = {
  [Property in ToolbarCategories]?: AreaFilter<ToolbarMap[Property]>;
};

type AreaFilter<T extends string> = Partial<Record<T, ToolbarOption>> & {
  disabled?: boolean;
  hidden?: boolean;
};

export type AreaFilters = Partial<Record<ElementType, Partial<CategoryFilters>>>;

export const defaultValues: CategoryFilters = {
  table: {
    hidden: true,
  },
};

export const defaultAreaOptions: AreaFilters = {
  summary: {
    inline: { disabled: true },
    block: { disabled: true },
  },
  heading: {
    inline: { hidden: true },
  },
  "table-cell": {
    table: { hidden: false },
  },
};

export type ToolbarType = {
  [Property in ToolbarCategories]: ToolbarValue<ToolbarMap[Property]>[];
};

/**
 * Expands the [options] object with the [value] object.
 * If the value of value of [value] is `hidden` or `disabled`, it will be expanded to apply to all objects within the provided key.
 * Passing an object will iterate through `options\[key\]` and merge the object with the original value. This allows one to pass `disabled` as a part of [value] whilst also allowing for one to drop down to more granular control of one or two values.
 * @example expand('text', { disabled: true }, options) will set all text options to disabled.
 * @example expand('text', { disabled: true, 'normal-text': { disabled: false } }, options) will set all text options to disabled, except for normal-text.
 * @example expand('block', {quote: {disabled: true}}, options) will set the quote option to disabled, leaving others untouched.
 **/
const expand = <T extends ToolbarCategories>(key: T, value: AreaFilter<ToolbarMap[T]>): OptionsType[T] => {
  const { disabled, hidden, ...rest } = value;
  if (disabled != null || hidden != null) {
    const keys = Object.keys(allOptions[key]) as ToolbarMap[T][];
    const toBeMerged = keys.reduce<Partial<Record<ToolbarMap[T], ToolbarOption>>>((acc, key) => {
      acc[key] = {};
      if (disabled != null) {
        acc[key]!.disabled = disabled;
      }
      if (hidden != null) {
        acc[key]!.hidden = hidden;
      }
      return acc;
    }, {});
    return merge({}, toBeMerged, rest) as OptionsType[T];
  }
  return rest as OptionsType[T];
};

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const createToolbarAreaOptions = (areaOptions?: AreaFilters): AreaFilters =>
  merge({}, defaultAreaOptions, areaOptions);

export const createToolbarDefaultValues = (userValues: CategoryFilters = {}): CategoryFilters => {
  // Deep clone opts to not mutate allOptions
  const defaults = merge({}, defaultValues, userValues);
  return Object.entries(defaults).reduce<CategoryFilters>((acc, [key, value]) => {
    acc[key as ToolbarCategories] = expand(key as ToolbarCategories, value);
    return acc;
  }, {});
};

interface ToolbarStateProps {
  options?: CategoryFilters;
  areaOptions?: AreaFilters;
  editorAncestors?: Element[];
}

export const getEditorAncestors = (editor: Editor, reverse?: boolean): Element[] => {
  // Finds the current lowest node in the editor and creates an array of its ancestors.
  const [lowest] = Editor.nodes(editor, { mode: "lowest" });
  const ancestorGen = Node.ancestors(editor, lowest[1], { reverse });
  const elementAncestors: Element[] = [];
  // ancestorGen is a generator, so we need to iterate over it to get the values.
  for (const ancestor of ancestorGen) {
    if (Element.isElement(ancestor[0]) && ancestor[0].type !== "section") {
      elementAncestors.push(ancestor[0]);
    }
  }
  return elementAncestors;
};

/**
 * Generates the toolbar based on the current selection of the editor.
 **/
export const toolbarState = ({
  options: optionsProp = {},
  areaOptions = {},
  editorAncestors,
}: ToolbarStateProps): ToolbarType => {
  // Deep clone options to not mutate the original object.
  const options = deepClone(optionsProp);

  editorAncestors?.forEach((node) => {
    const filters = areaOptions[node.type];
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        const key = k as ToolbarCategories;
        const exp = expand(key, v);
        merge(options, { [key]: exp });
      });
    }
  });

  const merged = merge({}, allOptions, options);
  const toolbar = Object.entries(merged).reduce<ToolbarType>(
    (acc, curr) => {
      acc[curr[0] as ToolbarCategories] = Object.values(curr[1]);
      return acc;
    },
    { text: [], mark: [], block: [], inline: [], table: [], languages: [] },
  );
  return toolbar;
};
