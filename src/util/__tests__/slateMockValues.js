export const valueWithTwoImageEmbeds = {
  type: 'section',
  children: [
    {
      data: {
        resource: 'image',
        resource_id: '3',
        size: 'fullbredde',
        align: '',
        alt: 'Mann med maske ved datamaskin. Foto.',
        caption: '',
        url: 'https://test.api.ndla.no/image-api/v3/images/3',
      },
      type: 'ndlaembed',
      children: [
        {
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
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
          alttexts: [{ alttext: 'Guinness is good for you', language: 'nb' }],
          imageUrl: 'https://test.api.ndla.no/image-api/raw/wyyP72x0.jpg',
          size: 141132,
          contentType: 'image/jpeg',
          copyright: {
            license: {
              license: 'by-sa',
              description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
              url: 'https://creativecommons.org/licenses/by-sa/2.0/',
            },
            origin: 'Origin',
            authors: [{ type: 'Forfatter', name: 'Onkel Skrue' }],
          },
          tags: [{ tags: ['øl', 'guinness', 'good'], language: 'nb' }],
          captions: [{ caption: 'Guinness is good for you', language: 'nb' }],
        },
      },
      type: 'ndlaembed',
      children: [
        {
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
      ],
    },
  ],
};

export const valueWithInlineFootnotesAndContentLinks = {
  type: 'section',
  children: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
        },
        {
          data: {
            'content-id': '1031',
            resource: 'content-link',
            'link-text': 'dolore',
          },
          type: 'content-link',
          children: [
            {
              text: 'dolore',
            },
          ],
        },
        {
          text: ' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
          type: 'footnote',
          children: [
            {
              text: '#',
            },
          ],
        },
        {
          text: ' Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ',
        },
        {
          data: {
            'content-id': '1031',
            resource: 'content-link',
            'link-text': 'laborum',
          },
          type: 'content-link',
          children: [
            {
              text: 'laborum',
            },
          ],
        },
        {
          text: '.',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Lorem ipsum dolor sit amet, consectetur a dipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
          type: 'footnote',
          children: [
            {
              text: '#',
            },
          ],
        },
        {
          text: '',
        },
      ],
    },
  ],
};
