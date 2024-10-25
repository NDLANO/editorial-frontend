/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  CategoryFilters,
  InlineType,
  OptionsType,
  TableType,
  ToolbarCategories,
  ToolbarType,
  ToolbarValue,
  allOptions,
  createToolbarAreaOptions,
  createToolbarDefaultValues,
  defaultAreaOptions,
  toolbarState,
} from "../toolbarState";

describe("createToolbarAreaOptions", () => {
  test("properly merges user-defined and default options", () => {
    const res = createToolbarAreaOptions({
      heading: {
        block: {
          quote: { disabled: true },
        },
      },
    });

    const expected = {
      ...defaultAreaOptions,
      heading: {
        ...defaultAreaOptions.heading,
        block: {
          quote: { disabled: true },
        },
      },
    };
    expect(res).toEqual(expected);
  });
  test("allows user-defined options to override default options", () => {
    const res = createToolbarAreaOptions({
      heading: {
        inline: { hidden: false },
      },
    });

    const expected = {
      ...defaultAreaOptions,
      heading: {
        ...defaultAreaOptions.heading,
        inline: { ...defaultAreaOptions.heading?.inline, hidden: false },
      },
    };
    expect(res).toEqual(expected);
  });
});

const expandedDefaultValues: CategoryFilters = {
  table: {
    left: { hidden: true },
    center: { hidden: true },
    right: { hidden: true },
  },
};

describe("createToolbarDefaultValues", () => {
  test("expands top-level hidden and disabled attributes to entire category", () => {
    const res = createToolbarDefaultValues({
      block: {
        disabled: true,
      },
      text: {
        hidden: true,
      },
      inline: {
        hidden: true,
        disabled: true,
      },
    });

    const expanded: CategoryFilters = {
      ...expandedDefaultValues,
      block: {
        quote: { disabled: true },
        "definition-list": { disabled: true },
        "numbered-list": { disabled: true },
        "bulleted-list": { disabled: true },
        "letter-list": { disabled: true },
      },
      text: {
        "normal-text": { hidden: true },
        "heading-2": { hidden: true },
        "heading-3": { hidden: true },
        "heading-4": { hidden: true },
      },
      inline: {
        "content-link": { hidden: true, disabled: true },
        mathml: { hidden: true, disabled: true },
        "concept-inline": { hidden: true, disabled: true },
        "gloss-inline": { hidden: true, disabled: true },
        "comment-inline": { hidden: true, disabled: true },
      },
    };

    expect(res).toEqual(expanded);
  });
  test("overrides truthy default values with falsy user values", () => {
    const res = createToolbarDefaultValues({
      table: {
        hidden: false,
      },
    });

    const expanded: CategoryFilters = {
      ...expandedDefaultValues,
      table: {
        left: { hidden: false },
        center: { hidden: false },
        right: { hidden: false },
      },
    };

    expect(res).toEqual(expanded);
  });
});

const allToolbarOptions: ToolbarType = Object.entries(allOptions).reduce<ToolbarType>((acc, [key, value]) => {
  acc[key as ToolbarCategories] = Object.values(value);
  return acc;
}, {} as ToolbarType);

const arrayifyToolbar = (toolbar: OptionsType) => {
  return Object.entries(toolbar).reduce<ToolbarType>(
    (acc, [key, value]) => {
      acc[key as ToolbarCategories] = Object.values(value);
      return acc;
    },
    { text: [], mark: [], block: [], inline: [], table: [], languages: [], llm: [] } as ToolbarType,
  );
};

describe("toolbarState", () => {
  test("returns all options if no area options, editorAncestors and default values are provided", () => {
    const res = toolbarState({ options: {}, areaOptions: {} });
    const expected = arrayifyToolbar(allOptions);
    expect(res).toEqual(expected);
  });

  test("is not affected by only providing editorAncestors", () => {
    const res = toolbarState({
      options: {},
      areaOptions: {},
      editorAncestors: [{ type: "paragraph", children: [{ text: "test" }] }],
    });
    const expected = arrayifyToolbar(allOptions);
    expect(res).toEqual(expected);
  });

  test("filters out options that are disabled or hidden due to editorAncestors", () => {
    const res = toolbarState({
      options: {},
      areaOptions: createToolbarAreaOptions(),
      editorAncestors: [
        { type: "heading", children: [], level: 1 },
        { type: "paragraph", children: [{ text: "test" }] },
      ],
    });

    const opts: OptionsType = {
      ...allOptions,
      inline: {
        ...allOptions.inline,
        "content-link": { ...allOptions.inline["content-link"], hidden: true },
        mathml: { ...allOptions.inline.mathml, hidden: true },
        "concept-inline": { ...allOptions.inline["concept-inline"], hidden: true },
        "gloss-inline": { ...allOptions.inline["gloss-inline"], hidden: true },
        "comment-inline": { ...allOptions.inline["comment-inline"], hidden: false },
      },
    };
    const expected = arrayifyToolbar(opts);
    expect(res).toEqual(expected);
  });

  test("prefers areaOptions over default values", () => {
    const res = toolbarState({
      options: createToolbarDefaultValues(),
      areaOptions: createToolbarAreaOptions({ heading: { inline: { hidden: false } } }),
      editorAncestors: [
        { type: "heading", children: [], level: 1 },
        { type: "paragraph", children: [{ text: "test" }] },
      ],
    });

    const opts: OptionsType = {
      ...allOptions,
      table: allToolbarOptions.table.reduce<Record<TableType, ToolbarValue<TableType>>>(
        (acc, v) => ({ ...acc, [v.value]: { ...v, hidden: true } }),
        {} as Record<TableType, ToolbarValue<TableType>>,
      ),
      inline: allToolbarOptions.inline.reduce<Record<InlineType, ToolbarValue<InlineType>>>(
        (acc, v) => ({ ...acc, [v.value]: { ...v, hidden: false } }),
        {} as Record<InlineType, ToolbarValue<InlineType>>,
      ),
    };
    const expected = arrayifyToolbar(opts);
    expect(res).toEqual(expected);
  });
});
