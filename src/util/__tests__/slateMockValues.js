export const valueWithTwoImageEmbeds = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        kind: 'block',
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
            kind: 'block',
            isVoid: true,
            type: 'embed',
            nodes: [
              {
                kind: 'text',
                leaves: [{ kind: 'leaf', text: ' ', marks: [] }],
              },
            ],
          },
          {
            data: {},
            kind: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
            kind: 'block',
            isVoid: true,
            type: 'embed',
            nodes: [
              {
                kind: 'text',
                leaves: [{ kind: 'leaf', text: ' ', marks: [] }],
              },
            ],
          },
          {
            data: {},
            kind: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                kind: 'text',
                leaves: [{ kind: 'leaf', text: '', marks: [] }],
              },
            ],
          },
        ],
      },
    ],
  },
  kind: 'value',
};

export const valueWithInlineFootnotesAndContentLinks = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        kind: 'block',
        isVoid: false,
        type: 'section',
        nodes: [
          {
            data: {},
            kind: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
                kind: 'inline',
                isVoid: false,
                type: 'embed-inline',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
                        text: 'dolore',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
                kind: 'inline',
                isVoid: false,
                type: 'footnote',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
                        text: '#',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
                kind: 'inline',
                isVoid: false,
                type: 'embed-inline',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
                        text: 'laborum',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
                    text: '.',
                    marks: [],
                  },
                ],
              },
            ],
          },
          {
            data: {},
            kind: 'block',
            isVoid: false,
            type: 'paragraph',
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
                kind: 'inline',
                isVoid: false,
                type: 'footnote',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
                        text: '#',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
  kind: 'value',
};

export const tableSlateValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            kind: 'block',
            nodes: [
              {
                data: { isHeader: true },
                isVoid: false,
                kind: 'block',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
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
                kind: 'block',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
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
            kind: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                kind: 'block',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
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
                kind: 'block',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
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
  kind: 'value',
};

export const detailsBoxValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            kind: 'block',
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'range',
                    marks: [],
                    text: 'Summary text',
                  },
                ],
              },
            ],
            type: 'summary',
          },
          {
            kind: 'text',
            leaves: [
              {
                kind: 'range',
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
  kind: 'value',
};

export const listValue = (type = 'numbered-list') => ({
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {
          type: 'letters',
        },
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            kind: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                kind: 'block',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
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
            kind: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                kind: 'block',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
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
            kind: 'block',
            nodes: [
              {
                data: {},
                isVoid: false,
                kind: 'block',
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
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
  kind: 'value',
});

export const headingTwoValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
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
  kind: 'value',
};

export const sectionValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            kind: 'block',
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
  kind: 'value',
};

export const quoteValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
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
  kind: 'value',
};

export const normalDivValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            data: {},
            isVoid: false,
            kind: 'block',
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
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
  kind: 'value',
};

export const brValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
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
  kind: 'value',
};

export const spanWithAttributesValue = {
  document: {
    data: {},
    kind: 'document',
    nodes: [
      {
        data: {},
        isVoid: false,
        kind: 'block',
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
                marks: [],
                text: '',
              },
            ],
          },
          {
            data: {
              lang: 'en',
            },
            isVoid: false,
            kind: 'inline',
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
                    marks: [],
                    text: 'Hyper Text Markup Language',
                  },
                ],
              },
            ],
            type: 'span',
          },
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
                marks: [],
                text: '',
              },
            ],
          },
        ],
        type: 'paragraph',
      },
    ],
  },
  kind: 'value',
};
