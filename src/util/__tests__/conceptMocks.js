export const apiConcept = {
  id: 400,
  title: { title: 'Testbegrep', language: 'nb' },
  content: {
    content: 'Beskrivelse av testbegrep.',
    language: 'nb',
  },
  copyright: {
    license: {
      license: 'CC-BY-SA-4.0',
      description: 'Creative Commons Attribution-ShareAlike 4.0 International',
      url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    origin: '',
    creators: [{ type: 'Writer', name: 'Ragna Marie Tørdal' }],
    processors: [],
    rightsholders: [],
  },
  created: '2013-02-26T11:06:14Z',
  updated: '2019-05-15T08:45:46Z',
  supportedLanguages: ['nb', 'nn', 'en'],
};

export const transformedConcept = {
  content: 'Beskrivelse av testbegrep.',
  copyright: {
    creators: [
      {
        name: 'Ragna Marie Tørdal',
        type: 'Writer',
      },
    ],
    license: {
      description: 'Creative Commons Attribution-ShareAlike 4.0 International',
      license: 'CC-BY-SA-4.0',
      url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    origin: '',
    processors: [],
    rightsholders: [],
  },
  created: '2013-02-26T11:06:14Z',
  id: 400,
  published: '2019-01-16T12:30:04Z',
  supportedLanguages: ['nb', 'nn', 'en'],
  title: 'Testbegrep',
  updated: '2019-05-15T08:45:46Z',
};
