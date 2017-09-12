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
