/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import {
  createSlate,
  LIST_ELEMENT_TYPE,
  LIST_ITEM_ELEMENT_TYPE,
  PARAGRAPH_ELEMENT_TYPE,
  SECTION_ELEMENT_TYPE,
} from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { anySlateElementId } from "../../../../../__tests__/vitest.setup";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("list normalizer tests", () => {
  test("Unwrap list item not placed inside list", () => {
    const editorValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: LIST_ITEM_ELEMENT_TYPE,
            children: [
              {
                type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: LIST_ELEMENT_TYPE,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: LIST_ELEMENT_TYPE,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: LIST_ELEMENT_TYPE,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                children: [
                  {
                    type: LIST_ELEMENT_TYPE,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: LIST_ITEM_ELEMENT_TYPE,
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: LIST_ELEMENT_TYPE,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "",
                      },
                    ],
                  },
                  {
                    type: LIST_ELEMENT_TYPE,
                    id: anySlateElementId,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: LIST_ITEM_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: LIST_ELEMENT_TYPE,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                children: [
                  {
                    type: LIST_ELEMENT_TYPE,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: LIST_ITEM_ELEMENT_TYPE,
                        changeTo: "numbered-list",
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
                            children: [
                              {
                                text: "abc",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: LIST_ITEM_ELEMENT_TYPE,
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: LIST_ELEMENT_TYPE,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
                    id: anySlateElementId,
                    children: [
                      {
                        text: "",
                      },
                    ],
                  },
                  {
                    type: LIST_ELEMENT_TYPE,
                    id: anySlateElementId,
                    listType: "numbered-list",
                    data: {},
                    children: [
                      {
                        type: LIST_ITEM_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
                    type: LIST_ELEMENT_TYPE,
                    id: anySlateElementId,
                    listType: "letter-list",
                    data: {},
                    children: [
                      {
                        type: LIST_ITEM_ELEMENT_TYPE,
                        id: anySlateElementId,
                        children: [
                          {
                            type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: LIST_ELEMENT_TYPE,
            listType: "numbered-list",
            data: {},
            children: [],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: LIST_ELEMENT_TYPE,
            listType: "numbered-list",
            data: {},
            children: [{ text: "abc" }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: LIST_ELEMENT_TYPE,
            id: anySlateElementId,
            listType: "numbered-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: LIST_ELEMENT_TYPE,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
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
            type: LIST_ELEMENT_TYPE,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
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
        type: SECTION_ELEMENT_TYPE,
        id: anySlateElementId,
        children: [
          {
            type: PARAGRAPH_ELEMENT_TYPE,
            id: anySlateElementId,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: LIST_ELEMENT_TYPE,
            id: anySlateElementId,
            listType: "letter-list",
            data: {},
            children: [
              {
                type: LIST_ITEM_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
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
                type: LIST_ITEM_ELEMENT_TYPE,
                id: anySlateElementId,
                children: [
                  {
                    type: PARAGRAPH_ELEMENT_TYPE,
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
            type: PARAGRAPH_ELEMENT_TYPE,
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
