/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_LIST, TYPE_LIST_ITEM } from "../types";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("list normalizer tests", () => {
  test("Unwrap list item not placed inside list", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_LIST_ITEM,
            children: [
              {
                type: TYPE_PARAGRAPH,
                children: [
                  {
                    text: "abc",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [{ text: "abc" }],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("If listItem contains text, wrap it in paragraph.", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_LIST,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                children: [
                  {
                    text: "abc",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: TYPE_LIST,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "abc",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("If first child of list item is not a paragraph or heading, insert an empty paragraph.", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_LIST,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                children: [
                  {
                    type: TYPE_LIST,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: TYPE_LIST_ITEM,
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: TYPE_LIST,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "",
                      },
                    ],
                  },
                  {
                    type: TYPE_LIST,
                    id: anySlateElementId,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: TYPE_LIST_ITEM,
                        id: anySlateElementId,
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Handle changing list-items marked for listType change.", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_LIST,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                children: [
                  {
                    type: TYPE_LIST,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: TYPE_LIST_ITEM,
                        changeTo: "numbered-list",
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "abc",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: TYPE_LIST_ITEM,
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            children: [
                              {
                                text: "def",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: TYPE_LIST,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "",
                      },
                    ],
                  },
                  {
                    type: TYPE_LIST,
                    id: anySlateElementId,
                    listType: "numbered-list",
                    data: {},
                    children: [
                      {
                        type: TYPE_LIST_ITEM,
                        id: anySlateElementId,
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "abc",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: TYPE_LIST,
                    id: anySlateElementId,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: TYPE_LIST_ITEM,
                        id: anySlateElementId,
                        children: [
                          {
                            type: TYPE_PARAGRAPH,
                            id: anySlateElementId,
                            children: [
                              {
                                text: "def",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("If list is empty, remove it", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_LIST,
            listType: "numbered-list",
            data: {},
            children: [],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [{ text: "" }],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Force all elements in list to be list-item", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_LIST,
            listType: "numbered-list",
            data: {},
            children: [{ text: "abc" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: TYPE_LIST,
            id: anySlateElementId,
            listType: "numbered-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "abc",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test("Merge sibling lists if identical type", () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: TYPE_LIST,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    children: [
                      {
                        text: "abc",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_LIST,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    children: [
                      {
                        text: "def",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        id: anySlateElementId,
        children: [
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: TYPE_LIST,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: TYPE_LIST_ITEM,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "abc",
                      },
                    ],
                  },
                ],
              },
              {
                type: TYPE_LIST_ITEM,
                id: anySlateElementId,
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "def",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ];
    editor.reinitialize({ value: editorValue, shouldNormalize: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
