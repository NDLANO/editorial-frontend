/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MarkType } from "@ndla/editor";
import { merge } from "lodash-es";
import { Editor, Element, ElementType, Node, NodeEntry, Path, Range, Selection } from "slate";
import { SYMBOL_ELEMENT_TYPE } from "../symbol/types";

export const languages = [
  "no",
  "de",
  "es",
  "se",
  "sma",
  "zh",
  "en",
  "ar",
  "prs",
  "fr",
  "heb",
  "la",
  "pli",
  "san",
  "so",
  "ti",
] as const;

export type TextType = "normal-text" | "heading-2" | "heading-3" | "heading-4";
export type BlockType = "quote" | "definition-list" | "numbered-list" | "bulleted-list" | "letter-list";
export type InlineType =
  | "content-link"
  | "mathml"
  | "concept-inline"
  | "gloss-inline"
  | "comment-inline"
  | "rephrase"
  | typeof SYMBOL_ELEMENT_TYPE;
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

export interface ToolbarOption {
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
    underlined: { value: "underlined" },
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
    "comment-inline": { value: "comment-inline" },
    rephrase: { value: "rephrase" },
    [SYMBOL_ELEMENT_TYPE]: { value: SYMBOL_ELEMENT_TYPE },
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
    inline: { hidden: true, "comment-inline": { hidden: false } },
    mark: { bold: { hidden: true } },
  },
  table: {
    text: { hidden: true },
  },
  "table-cell": {
    table: { hidden: false },
  },
  "concept-inline": {
    inline: { disabled: true, "concept-inline": { disabled: false }, rephrase: { disabled: false } },
  },
  "content-link": {
    inline: { disabled: true, "content-link": { disabled: false } },
  },
  link: {
    inline: { disabled: true },
  },
  mathml: {
    inline: { disabled: true, mathml: { disabled: false }, rephrase: { disabled: false } },
  },
  "comment-inline": {
    inline: { disabled: true, "comment-inline": { disabled: false }, rephrase: { disabled: false } },
  },
  [SYMBOL_ELEMENT_TYPE]: {
    inline: { disabled: true, [SYMBOL_ELEMENT_TYPE]: { disabled: false }, rephrase: { disabled: false } },
  },
  list: { inline: { disabled: true }, block: { "definition-list": { disabled: true }, quote: { disabled: true } } },
  "definition-term": {
    block: { quote: { disabled: true } },
    inline: { disabled: true, "comment-inline": { disabled: false } },
  },
  "definition-description": {
    block: { quote: { disabled: true } },
    inline: { disabled: true, "comment-inline": { disabled: false } },
  },
  "definition-list": {
    block: {
      quote: { disabled: true },
      "numbered-list": { disabled: true },
      "bulleted-list": { disabled: true },
      "letter-list": { disabled: true },
    },
    inline: { disabled: true, "comment-inline": { disabled: false } },
  },
  quote: { inline: { disabled: true } },
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

type SelectionElements = {
  elements: Element[];
  multipleBlocksOnSameLevel: boolean;
};

function getRelevantAncestor(editor: Editor, rawSelection: Selection): NodeEntry | null {
  if (!rawSelection) return null;
  const selection = Editor.unhangRange(editor, rawSelection);

  // start with the closest relevant ancestor
  let [ancestor, path] =
    Editor.above(editor, {
      at: selection,
      match: (node) => Node.isElement(node),
      voids: true,
    }) ?? [];

  if (!ancestor || !path) return null;

  // keep going until the parent element stops existing, or if it contains other children.
  while (true) {
    const parentEntry = Editor.parent(editor, path);
    if (!parentEntry) break;

    const [parent, parentPath] = parentEntry;

    if (!Node.isElement(parent)) break;

    if (parent.children.length !== 1) break;

    ancestor = parent;
    path = parentPath;
  }

  return [ancestor, path];
}

export const getSelectionElements = (editor: Editor, rawSelection: Selection): SelectionElements => {
  if (!rawSelection) return { elements: [], multipleBlocksOnSameLevel: false };

  const selection = Editor.unhangRange(editor, rawSelection);
  const [parentElement, parentPath] = getRelevantAncestor(editor, selection) ?? [];

  // Find all elements inside of the parent element (or editor if parent is `undefined`) that are also inside of the selection range
  const elements: Element[] = [];
  const from = Path.relative(Range.start(selection).path, parentPath ?? []);
  const to = Path.relative(Range.end(selection).path, parentPath ?? []);
  const blockCounts = new Map<number, number>();

  for (const [element, path] of Node.elements(parentElement ?? editor, { from, to })) {
    elements.push(element);
    if (editor.isBlock(element)) {
      const level = path.length;
      blockCounts.set(level, (blockCounts.get(level) || 0) + 1);
    }
  }

  return {
    elements,
    multipleBlocksOnSameLevel: Array.from(blockCounts.values()).some((count) => count > 1),
  };
};

type ToolbarStateProps = {
  selectionElements?: Element[];
  multipleBlocksOnSameLevel?: boolean;
  options?: CategoryFilters;
  areaOptions?: AreaFilters;
};

/**
 * Generates the toolbar based on the current selection of the editor.
 **/
export const toolbarState = ({
  selectionElements,
  multipleBlocksOnSameLevel,
  options: optionsProp = {},
  areaOptions = {},
}: ToolbarStateProps): ToolbarType => {
  // Deep clone options to not mutate the original object.
  const options = deepClone(optionsProp);

  selectionElements?.forEach((element) => {
    const filters = areaOptions[element.type];
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        const key = k as ToolbarCategories;
        const exp = expand(key, v);
        merge(options, { [key]: exp });
      });
    }
  });

  const merged = merge({}, allOptions, options);
  if (multipleBlocksOnSameLevel) {
    Object.keys(merged.inline).forEach((key) => {
      merged.inline[key as InlineType].disabled = true;
    });
  }

  const toolbar = Object.entries(merged).reduce<ToolbarType>(
    (acc, curr) => {
      acc[curr[0] as ToolbarCategories] = Object.values(curr[1]);
      return acc;
    },
    { text: [], mark: [], block: [], inline: [], table: [], languages: [] },
  );
  return toolbar;
};
