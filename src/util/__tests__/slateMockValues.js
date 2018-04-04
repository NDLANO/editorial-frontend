export const valueWithTwoImageEmbeds = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        object: 'block',
        isVoid: false,
        type: 'section',
        nodes: [
          {
            data: {
              resource: 'image',
              resource_id: '3',
              size: 'fullbredde',
              align: '',
              alt: 'Mann med maske ved datamaskin. Foto.',
              caption: '',
              url: 'https://test.api.ndla.no/image-api/v2/images/3',
            },
            object: 'block',
            isVoid: true,
            type: 'embed',
            nodes: [
              {
                object: 'text',
                leaves: [{ object: 'leaf', text: ' ', marks: [] }],
              },
            ],
          },
          {
            data: {},
            object: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
                    marks: [],
                  },
                ],
              },
            ],
          },
          {
            data: {
              resource: 'image',
              resource_id: '42159',
              size: 'fullbredde',
              align: '',
              alt: '',
              caption: 'Guinness is good for you',
              metaData: {
                id: '42159',
                metaUrl: 'https://test.api.ndla.no/image-api/v1/images/42159',
                titles: [{ title: 'Guinness is good for you', language: 'nb' }],
                alttexts: [
                  { alttext: 'Guinness is good for you', language: 'nb' },
                ],
                imageUrl: 'https://test.api.ndla.no/image-api/raw/wyyP72x0.jpg',
                size: 141132,
                contentType: 'image/jpeg',
                copyright: {
                  license: {
                    license: 'by-sa',
                    description:
                      'Creative Commons Attribution-ShareAlike 2.0 Generic',
                    url: 'https://creativecommons.org/licenses/by-sa/2.0/',
                  },
                  origin: 'Origin',
                  authors: [{ type: 'Forfatter', name: 'Onkel Skrue' }],
                },
                tags: [{ tags: ['øl', 'guinness', 'good'], language: 'nb' }],
                captions: [
                  { caption: 'Guinness is good for you', language: 'nb' },
                ],
              },
            },
            object: 'block',
            isVoid: true,
            type: 'embed',
            nodes: [
              {
                object: 'text',
                leaves: [{ object: 'leaf', text: ' ', marks: [] }],
              },
            ],
          },
          {
            data: {},
            object: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [{ object: 'leaf', text: '', marks: [] }],
              },
            ],
          },
        ],
      },
    ],
  },
  object: 'value',
};

export const valueWithInlineFootnotesAndContentLinks = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        object: 'block',
        isVoid: false,
        type: 'section',
        nodes: [
          {
            data: {},
            object: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
                    marks: [],
                  },
                ],
              },
              {
                data: {
                  'content-id': '1031',
                  resource: 'content-link',
                  'link-text': 'dolore',
                },
                object: 'inline',
                isVoid: false,
                type: 'embed-inline',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        text: 'dolore',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text:
                      ' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    marks: [],
                  },
                ],
              },
              {
                data: {
                  title: 'The Mythical Man-Month',
                  year: '1975',
                  authors: ['Frederick Brooks'],
                  edition: '',
                  publisher: 'Addison-Wesley',
                  type: '',
                },
                object: 'inline',
                isVoid: false,
                type: 'footnote',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        text: '#',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text:
                      ' Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ',
                    marks: [],
                  },
                ],
              },
              {
                data: {
                  'content-id': '1031',
                  resource: 'content-link',
                  'link-text': 'laborum',
                },
                object: 'inline',
                isVoid: false,
                type: 'embed-inline',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        text: 'laborum',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: '.',
                    marks: [],
                  },
                ],
              },
            ],
          },
          {
            data: {},
            object: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text:
                      'Lorem ipsum dolor sit amet, consectetur a dipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    marks: [],
                  },
                ],
              },
              {
                data: {
                  title: 'A brief history of time',
                  year: '1988',
                  authors: ['Stephen Hawking'],
                  edition: '',
                  publisher: 'Bantam Dell Publishing Group',
                  type: '',
                },
                object: 'inline',
                isVoid: false,
                type: 'footnote',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        text: '#',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: '',
                    marks: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  object: 'value',
};

export const tableSlateValue = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        object: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                data: { isHeader: true },
                isVoid: false,
                object: 'block',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        marks: [],
                        text: 'column 1',
                      },
                    ],
                  },
                ],
                type: 'table-cell',
              },
              {
                data: { isHeader: true },
                isVoid: false,
                object: 'block',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        marks: [],
                        text: 'column 2',
                      },
                    ],
                  },
                ],
                type: 'table-cell',
              },
            ],
            type: 'table-row',
          },
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                object: 'block',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        marks: [],
                        text: 'column 1',
                      },
                    ],
                  },
                ],
                type: 'table-cell',
              },
              {
                data: {},
                isVoid: false,
                object: 'block',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        marks: [],
                        text: 'column 2',
                      },
                    ],
                  },
                ],
                type: 'table-cell',
              },
            ],
            type: 'table-row',
          },
        ],
        type: 'table',
      },
    ],
  },
  object: 'value',
};

export const detailsBoxValue = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        object: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'range',
                    marks: [],
                    text: 'Summary text',
                  },
                ],
              },
            ],
            type: 'summary',
          },
          {
            object: 'text',
            leaves: [
              {
                object: 'range',
                marks: [],
                text: 'Details text',
              },
            ],
          },
        ],
        type: 'details',
      },
    ],
  },
  object: 'value',
};

export const listValue = (type = 'numbered-list') => ({
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {
          type: 'letters',
        },
        isVoid: false,
        object: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                object: 'block',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        marks: [],
                        text: 'Rad 1',
                      },
                    ],
                  },
                ],
                type: 'list-text',
              },
            ],
            type: 'list-item',
          },
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                object: 'block',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        marks: [],
                        text: 'Rad 2',
                      },
                    ],
                  },
                ],
                type: 'list-text',
              },
            ],
            type: 'list-item',
          },
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                object: 'block',
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        marks: [],
                        text: 'Rad 3',
                      },
                    ],
                  },
                ],
                type: 'list-text',
              },
            ],
            type: 'list-item',
          },
        ],
        type,
      },
    ],
  },
  object: 'value',
});

export const headingTwoValue = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        object: 'block',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                marks: [],
                text: 'heading 2',
              },
            ],
          },
        ],
        type: 'heading-two',
      },
    ],
  },
  object: 'value',
};

export const sectionValue = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        object: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    marks: [],
                    text: 'Paragraph text',
                  },
                ],
              },
            ],
            type: 'paragraph',
          },
        ],
        type: 'section',
      },
    ],
  },
  object: 'value',
};

export const quoteValue = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        object: 'block',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                marks: [],
                text: 'This quote should be both smart and wise',
              },
            ],
          },
        ],
        type: 'quote',
      },
    ],
  },
  object: 'value',
};

export const normalDivValue = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        object: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            object: 'block',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    marks: [],
                    text: 'A paragraph',
                  },
                ],
              },
            ],
            type: 'paragraph',
          },
        ],
        type: 'div',
      },
    ],
  },
  object: 'value',
};

export const brValue = {
  document: {
    data: {},
    object: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        object: 'block',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                marks: [],
                text: '',
              },
            ],
          },
        ],
        type: 'br',
      },
    ],
  },
  object: 'value',
};
