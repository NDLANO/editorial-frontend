export const stateWithTwoImageEmbeds = {
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
                ranges: [{ kind: 'range', text: ' ', marks: [] }],
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
                ranges: [
                  {
                    kind: 'range',
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
                ranges: [{ kind: 'range', text: ' ', marks: [] }],
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
                ranges: [{ kind: 'range', text: '', marks: [] }],
              },
            ],
          },
        ],
      },
    ],
  },
  kind: 'state',
};

export const stateWithInlineFootnotesAndContentLinks = {
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
                ranges: [
                  {
                    kind: 'range',
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
                    ranges: [
                      {
                        kind: 'range',
                        text: 'dolore',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                ranges: [
                  {
                    kind: 'range',
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
                    ranges: [
                      {
                        kind: 'range',
                        text: '#',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                ranges: [
                  {
                    kind: 'range',
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
                    ranges: [
                      {
                        kind: 'range',
                        text: 'laborum',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                ranges: [
                  {
                    kind: 'range',
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
                ranges: [
                  {
                    kind: 'range',
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
                    ranges: [
                      {
                        kind: 'range',
                        text: '#',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                kind: 'text',
                ranges: [
                  {
                    kind: 'range',
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
  kind: 'state',
};

export const tableSlateState = {
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
                    ranges: [
                      {
                        kind: 'range',
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
                    ranges: [
                      {
                        kind: 'range',
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
                    ranges: [
                      {
                        kind: 'range',
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
                    ranges: [
                      {
                        kind: 'range',
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
  kind: 'state',
};
