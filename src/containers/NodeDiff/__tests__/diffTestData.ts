import { DiffTree, RootNodeWithChildren } from '../diffUtils';

export const rootNodeWithNoChildren: RootNodeWithChildren = {
  id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  name: 'Samfunnskunnskap',
  contentUri: 'urn:frontpage:62',
  path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  paths: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
  metadata: {
    grepCodes: ['KV48'],
    visible: true,
    customFields: {
      'old-subject-id': 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
      subjectCategory: 'active',
    },
  },
  relevanceId: undefined,
  translations: [
    {
      name: 'Social Science',
      language: 'en',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nb',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nn',
    },
  ],
  supportedLanguages: ['en', 'nb', 'nn'],
  children: [],
};

export const rootNodeWithNoChildrenUpdated: RootNodeWithChildren = {
  id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  name: 'Samfunnskunnskap oppdatert',
  contentUri: undefined,
  path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  paths: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
  metadata: {
    grepCodes: ['KV48', 'KV49'],
    visible: false,
    customFields: {
      'old-subject-id': 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
      subjectCategory: 'inactive',
      testProp: 'test',
    },
  },
  relevanceId: 'urn:relevance:core',
  translations: [
    {
      name: 'Samfunnskunnskap oppdatert',
      language: 'nb',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nn',
    },
  ],
  supportedLanguages: ['nb', 'nn'],
  children: [],
};

export const rootNodeWithNoChildrenDiff: DiffTree = {
  root: {
    changed: { diffType: 'MODIFIED' },
    childrenChanged: { diffType: 'NONE' },
    id: {
      original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'NONE',
    },
    name: {
      original: 'Samfunnskunnskap',
      other: 'Samfunnskunnskap oppdatert',
      diffType: 'MODIFIED',
    },
    contentUri: {
      original: 'urn:frontpage:62',
      other: undefined,
      diffType: 'DELETED',
    },
    path: {
      original: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'NONE',
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'NONE',
    },
    metadata: {
      changed: { diffType: 'MODIFIED' },
      grepCodes: {
        original: ['KV48'],
        other: ['KV48', 'KV49'],
        diffType: 'MODIFIED',
      },
      visible: {
        original: true,
        other: false,
        diffType: 'MODIFIED',
      },
      customFields: {
        changed: { diffType: 'MODIFIED' },
        'old-subject-id': {
          original: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          other: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          diffType: 'NONE',
        },
        subjectCategory: {
          original: 'active',
          other: 'inactive',
          diffType: 'MODIFIED',
        },
        testProp: {
          original: undefined,
          other: 'test',
          diffType: 'ADDED',
        },
      },
    },
    relevanceId: {
      original: undefined,
      other: 'urn:relevance:core',
      diffType: 'ADDED',
    },
    translations: {
      original: [
        {
          name: 'Social Science',
          language: 'en',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nb',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nn',
        },
      ],
      other: [
        {
          name: 'Samfunnskunnskap oppdatert',
          language: 'nb',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nn',
        },
      ],
      diffType: 'MODIFIED',
    },
    supportedLanguages: {
      original: ['en', 'nb', 'nn'],
      other: ['nb', 'nn'],
      diffType: 'MODIFIED',
    },
  },
  children: [],
};

export const rootNodeWithDirectChildren: RootNodeWithChildren = {
  id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  name: 'Samfunnskunnskap',
  contentUri: 'urn:frontpage:62',
  path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  paths: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
  metadata: {
    grepCodes: ['KV48'],
    visible: true,
    customFields: {
      'old-subject-id': 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
      subjectCategory: 'active',
    },
  },
  relevanceId: 'urn:relevance:core',
  translations: [
    {
      name: 'Social Science',
      language: 'en',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nb',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nn',
    },
  ],
  supportedLanguages: ['en', 'nb', 'nn'],
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parent: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      ],
      connectionId: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
      isPrimary: true,
      rank: 1,
      relevanceId: undefined,
      translations: [
        {
          name: 'Verktøy for utforskning',
          language: 'nb',
        },
        {
          name: 'Verktøy for utforsking',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
    {
      id: 'urn:topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
      name: 'Sosialisering, identitet og livsmestring',
      contentUri: 'urn:article:20126',
      parent: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
      ],
      connectionId: 'urn:subject-topic:2b597082-6c36-4fc1-ac60-f7b9aec06cfc',
      isPrimary: true,
      rank: 2,
      relevanceId: undefined,
      translations: [
        {
          name: 'Sosialisering, identitet og livsmestring',
          language: 'nb',
        },
        {
          name: 'Sosialisering, identitet og livsmeistring',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
  ],
};

export const rootNodeWithDirectChildrenUpdated: RootNodeWithChildren = {
  id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  name: 'Samfunnskunnskap',
  contentUri: 'urn:frontpage:62',
  path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  paths: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
  metadata: {
    grepCodes: ['KV48'],
    visible: true,
    customFields: {
      'old-subject-id': 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
      subjectCategory: 'active',
    },
  },
  relevanceId: 'urn:relevance:core',
  translations: [
    {
      name: 'Social Science',
      language: 'en',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nb',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nn',
    },
  ],
  supportedLanguages: ['en', 'nb', 'nn'],
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parent: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      ],
      connectionId: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
      isPrimary: true,
      rank: 1,
      relevanceId: undefined,
      translations: [
        {
          name: 'Verktøy for utforskning',
          language: 'nb',
        },
        {
          name: 'Verktøy for utforsking',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: false,
        customFields: {},
      },
      primary: true,
    },
    {
      id: 'urn:topic:1:00018b29-3b51-478d-a691-20732e0601fd',
      name: 'Ulikheter og utenforskap',
      contentUri: 'urn:article:20138',
      parent: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
      ],
      connectionId: 'urn:subject-topic:e497ff48-b716-4d42-a5f2-c06c44c771eb',
      isPrimary: true,
      rank: 3,
      relevanceId: undefined,
      translations: [
        {
          name: 'Ulikheter og utenforskap',
          language: 'nb',
        },
        {
          name: 'Ulikskapar og utanforskap',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
  ],
};

export const rootNodeWithDirectChildrenDiff: DiffTree = {
  root: {
    changed: { diffType: 'NONE' },
    childrenChanged: { diffType: 'MODIFIED' },
    id: {
      original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'NONE',
    },
    name: {
      original: 'Samfunnskunnskap',
      other: 'Samfunnskunnskap',
      diffType: 'NONE',
    },
    contentUri: {
      original: 'urn:frontpage:62',
      other: 'urn:frontpage:62',
      diffType: 'NONE',
    },
    path: {
      original: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'NONE',
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'NONE',
    },
    metadata: {
      changed: { diffType: 'NONE' },
      grepCodes: {
        original: ['KV48'],
        other: ['KV48'],
        diffType: 'NONE',
      },
      visible: {
        original: true,
        other: true,
        diffType: 'NONE',
      },
      customFields: {
        changed: { diffType: 'NONE' },
        'old-subject-id': {
          original: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          other: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          diffType: 'NONE',
        },
        subjectCategory: {
          original: 'active',
          other: 'active',
          diffType: 'NONE',
        },
      },
    },
    relevanceId: {
      original: 'urn:relevance:core',
      other: 'urn:relevance:core',
      diffType: 'NONE',
    },
    translations: {
      original: [
        {
          name: 'Social Science',
          language: 'en',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nb',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nn',
        },
      ],
      other: [
        {
          name: 'Social Science',
          language: 'en',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nb',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nn',
        },
      ],
      diffType: 'NONE',
    },
    supportedLanguages: {
      original: ['en', 'nb', 'nn'],
      other: ['en', 'nb', 'nn'],
      diffType: 'NONE',
    },
  },
  children: [
    {
      changed: { diffType: 'MODIFIED' },
      childrenChanged: { diffType: 'NONE' },
      children: [],
      id: {
        original: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        other: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        diffType: 'NONE',
      },
      name: {
        original: 'Verktøy for utforskning',
        other: 'Verktøy for utforskning',
        diffType: 'NONE',
      },
      contentUri: {
        original: 'urn:article:20136',
        other: 'urn:article:20136',
        diffType: 'NONE',
      },
      parent: {
        original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        diffType: 'NONE',
      },
      path: {
        original:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        other:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        diffType: 'NONE',
      },
      paths: {
        original: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        other: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        diffType: 'NONE',
      },
      connectionId: {
        original: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
        other: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
        diffType: 'NONE',
      },
      isPrimary: {
        original: true,
        other: true,
        diffType: 'NONE',
      },
      rank: {
        original: 1,
        other: 1,
        diffType: 'NONE',
      },
      relevanceId: {
        original: undefined,
        other: undefined,
        diffType: 'NONE',
      },
      translations: {
        original: [
          {
            name: 'Verktøy for utforskning',
            language: 'nb',
          },
          {
            name: 'Verktøy for utforsking',
            language: 'nn',
          },
        ],
        other: [
          {
            name: 'Verktøy for utforskning',
            language: 'nb',
          },
          {
            name: 'Verktøy for utforsking',
            language: 'nn',
          },
        ],
        diffType: 'NONE',
      },
      supportedLanguages: {
        original: ['nb', 'nn'],
        other: ['nb', 'nn'],
        diffType: 'NONE',
      },
      metadata: {
        changed: { diffType: 'MODIFIED' },
        grepCodes: {
          original: [],
          other: [],
          diffType: 'NONE',
        },
        visible: {
          original: true,
          other: false,
          diffType: 'MODIFIED',
        },
        customFields: {
          changed: { diffType: 'NONE' },
        },
      },
      primary: {
        original: true,
        other: true,
        diffType: 'NONE',
      },
    },
    {
      changed: { diffType: 'DELETED' },
      childrenChanged: { diffType: 'NONE' },
      children: [],
      id: {
        original: 'urn:topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
        other: undefined,
        diffType: 'DELETED',
      },
      name: {
        original: 'Sosialisering, identitet og livsmestring',
        other: undefined,
        diffType: 'DELETED',
      },
      contentUri: {
        original: 'urn:article:20126',
        other: undefined,
        diffType: 'DELETED',
      },
      parent: {
        original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        other: undefined,
        diffType: 'DELETED',
      },
      path: {
        original:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
        other: undefined,
        diffType: 'DELETED',
      },
      paths: {
        original: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
        ],
        other: undefined,
        diffType: 'DELETED',
      },
      connectionId: {
        original: 'urn:subject-topic:2b597082-6c36-4fc1-ac60-f7b9aec06cfc',
        other: undefined,
        diffType: 'DELETED',
      },
      isPrimary: {
        original: true,
        other: undefined,
        diffType: 'DELETED',
      },
      rank: {
        original: 2,
        other: undefined,
        diffType: 'DELETED',
      },
      relevanceId: {
        original: undefined,
        other: undefined,
        diffType: 'DELETED',
      },
      translations: {
        original: [
          {
            name: 'Sosialisering, identitet og livsmestring',
            language: 'nb',
          },
          {
            name: 'Sosialisering, identitet og livsmeistring',
            language: 'nn',
          },
        ],
        other: undefined,
        diffType: 'DELETED',
      },

      supportedLanguages: {
        original: ['nb', 'nn'],
        other: undefined,
        diffType: 'DELETED',
      },
      metadata: {
        changed: { diffType: 'DELETED' },
        grepCodes: {
          original: [],
          other: undefined,
          diffType: 'DELETED',
        },
        visible: {
          original: true,
          other: undefined,
          diffType: 'DELETED',
        },
        customFields: {
          changed: { diffType: 'DELETED' },
        },
      },
      primary: {
        original: true,
        other: undefined,
        diffType: 'DELETED',
      },
    },
    {
      changed: { diffType: 'ADDED' },
      childrenChanged: { diffType: 'NONE' },
      children: [],
      id: {
        original: undefined,
        other: 'urn:topic:1:00018b29-3b51-478d-a691-20732e0601fd',
        diffType: 'ADDED',
      },
      name: {
        original: undefined,
        other: 'Ulikheter og utenforskap',
        diffType: 'ADDED',
      },
      contentUri: {
        original: undefined,
        other: 'urn:article:20138',
        diffType: 'ADDED',
      },
      parent: {
        original: undefined,
        other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        diffType: 'ADDED',
      },
      path: {
        original: undefined,
        other:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
        diffType: 'ADDED',
      },
      paths: {
        original: undefined,
        other: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
        ],
        diffType: 'ADDED',
      },
      connectionId: {
        original: undefined,
        other: 'urn:subject-topic:e497ff48-b716-4d42-a5f2-c06c44c771eb',
        diffType: 'ADDED',
      },
      isPrimary: {
        original: undefined,
        other: true,
        diffType: 'ADDED',
      },
      rank: {
        original: undefined,
        other: 3,
        diffType: 'ADDED',
      },
      relevanceId: {
        original: undefined,
        other: undefined,
        diffType: 'ADDED',
      },
      translations: {
        original: undefined,
        other: [
          {
            name: 'Ulikheter og utenforskap',
            language: 'nb',
          },
          {
            name: 'Ulikskapar og utanforskap',
            language: 'nn',
          },
        ],
        diffType: 'ADDED',
      },
      supportedLanguages: {
        original: undefined,
        other: ['nb', 'nn'],
        diffType: 'ADDED',
      },
      metadata: {
        changed: { diffType: 'ADDED' },
        grepCodes: {
          original: undefined,
          other: [],
          diffType: 'ADDED',
        },
        visible: {
          original: undefined,
          other: true,
          diffType: 'ADDED',
        },
        customFields: {
          changed: { diffType: 'ADDED' },
        },
      },
      primary: {
        original: undefined,
        other: true,
        diffType: 'ADDED',
      },
    },
  ],
};

export const rootNodeWithNestedChildren: RootNodeWithChildren = {
  id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  name: 'Samfunnskunnskap',
  contentUri: 'urn:frontpage:62',
  path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  paths: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
  metadata: {
    grepCodes: ['KV48'],
    visible: true,
    customFields: {
      'old-subject-id': 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
      subjectCategory: 'active',
    },
  },
  relevanceId: 'urn:relevance:core',
  translations: [
    {
      name: 'Social Science',
      language: 'en',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nb',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nn',
    },
  ],
  supportedLanguages: ['en', 'nb', 'nn'],
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parent: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      ],
      connectionId: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
      isPrimary: true,
      rank: 1,
      relevanceId: undefined,
      translations: [
        {
          name: 'Verktøy for utforskning',
          language: 'nb',
        },
        {
          name: 'Verktøy for utforsking',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
    {
      id: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      name: 'Samfunnsfaglige metoder',
      contentUri: 'urn:article:20161',
      parent: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      ],
      connectionId: 'urn:topic-subtopic:a105eda0-b2db-46c2-af9b-0157d1b764f0',
      isPrimary: true,
      rank: 2,
      relevanceId: 'urn:relevance:core',
      translations: [
        {
          name: 'Samfunnsfaglige metoder',
          language: 'nb',
        },
        {
          name: 'Samfunnsfaglege metodar',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
    {
      id: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      name: 'Kildebruk og kildekritikk oppdatert',
      contentUri: 'urn:article:20162',
      parent: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      ],
      connectionId: 'urn:topic-subtopic:753b00fa-1a18-4aae-b088-29ecc4a1dd1d',
      isPrimary: true,
      rank: 3,
      relevanceId: 'urn:relevance:core',
      translations: [
        {
          name: 'Kildebruk og kildekritikk',
          language: 'nb',
        },
        {
          name: 'Kjeldebruk og kjeldekritikk',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
  ],
};

export const rootNodeWithNestedChildrenUpdated: RootNodeWithChildren = {
  id: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  name: 'Samfunnskunnskap',
  contentUri: 'urn:frontpage:62',
  path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
  paths: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
  metadata: {
    grepCodes: ['KV48'],
    visible: true,
    customFields: {
      'old-subject-id': 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
      subjectCategory: 'active',
    },
  },
  relevanceId: 'urn:relevance:core',
  translations: [
    {
      name: 'Social Science',
      language: 'en',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nb',
    },
    {
      name: 'Samfunnskunnskap',
      language: 'nn',
    },
  ],
  supportedLanguages: ['en', 'nb', 'nn'],
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parent: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      ],
      connectionId: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
      isPrimary: true,
      rank: 1,
      relevanceId: undefined,
      translations: [
        {
          name: 'Verktøy for utforskning',
          language: 'nb',
        },
        {
          name: 'Verktøy for utforsking',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
    {
      id: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      name: 'Samfunnsfaglige metoder',
      contentUri: 'urn:article:20161',
      parent: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      ],
      connectionId: 'urn:topic-subtopic:a105eda0-b2db-46c2-af9b-0157d1b764f0',
      isPrimary: true,
      rank: 2,
      relevanceId: 'urn:relevance:core',
      translations: [
        {
          name: 'Samfunnsfaglige metoder',
          language: 'nb',
        },
        {
          name: 'Samfunnsfaglege metodar',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: false,
    },
    {
      id: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      name: 'Kildebruk og kildekritikk oppdatert',
      contentUri: 'urn:article:20162',
      parent: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path:
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      paths: [
        '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      ],
      connectionId: 'urn:topic-subtopic:753b00fa-1a18-4aae-b088-29ecc4a1dd1d',
      isPrimary: true,
      rank: 3,
      relevanceId: 'urn:relevance:core',
      translations: [
        {
          name: 'Kildebruk og kildekritikk',
          language: 'nb',
        },
        {
          name: 'Kjeldebruk og kjeldekritikk',
          language: 'nn',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
      metadata: {
        grepCodes: [],
        visible: true,
        customFields: {},
      },
      primary: true,
    },
  ],
};

export const rootNodeWithNestedChildrenDiff: DiffTree = {
  root: {
    changed: { diffType: 'NONE' },
    childrenChanged: { diffType: 'MODIFIED' },
    id: {
      original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'NONE',
    },
    name: {
      original: 'Samfunnskunnskap',
      other: 'Samfunnskunnskap',
      diffType: 'NONE',
    },
    contentUri: {
      original: 'urn:frontpage:62',
      other: 'urn:frontpage:62',
      diffType: 'NONE',
    },
    path: {
      original: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'NONE',
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'NONE',
    },
    metadata: {
      changed: { diffType: 'NONE' },
      grepCodes: {
        original: ['KV48'],
        other: ['KV48'],
        diffType: 'NONE',
      },
      visible: {
        original: true,
        other: true,
        diffType: 'NONE',
      },
      customFields: {
        changed: { diffType: 'NONE' },
        'old-subject-id': {
          original: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          other: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          diffType: 'NONE',
        },
        subjectCategory: {
          original: 'active',
          other: 'active',
          diffType: 'NONE',
        },
      },
    },
    relevanceId: {
      original: 'urn:relevance:core',
      other: 'urn:relevance:core',
      diffType: 'NONE',
    },
    translations: {
      original: [
        {
          name: 'Social Science',
          language: 'en',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nb',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nn',
        },
      ],
      other: [
        {
          name: 'Social Science',
          language: 'en',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nb',
        },
        {
          name: 'Samfunnskunnskap',
          language: 'nn',
        },
      ],
      diffType: 'NONE',
    },
    supportedLanguages: {
      original: ['en', 'nb', 'nn'],
      other: ['en', 'nb', 'nn'],
      diffType: 'NONE',
    },
  },
  children: [
    {
      changed: { diffType: 'NONE' },
      childrenChanged: { diffType: 'MODIFIED' },
      id: {
        original: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        other: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        diffType: 'NONE',
      },
      name: {
        original: 'Verktøy for utforskning',
        other: 'Verktøy for utforskning',
        diffType: 'NONE',
      },
      contentUri: {
        original: 'urn:article:20136',
        other: 'urn:article:20136',
        diffType: 'NONE',
      },
      parent: {
        original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        diffType: 'NONE',
      },
      path: {
        original:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        other:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        diffType: 'NONE',
      },
      paths: {
        original: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        other: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        diffType: 'NONE',
      },
      connectionId: {
        original: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
        other: 'urn:subject-topic:b5c7dede-f8ec-4a57-909f-940343eb4155',
        diffType: 'NONE',
      },
      isPrimary: {
        original: true,
        other: true,
        diffType: 'NONE',
      },
      rank: {
        original: 1,
        other: 1,
        diffType: 'NONE',
      },
      relevanceId: {
        original: undefined,
        other: undefined,
        diffType: 'NONE',
      },
      translations: {
        original: [
          {
            name: 'Verktøy for utforskning',
            language: 'nb',
          },
          {
            name: 'Verktøy for utforsking',
            language: 'nn',
          },
        ],
        other: [
          {
            name: 'Verktøy for utforskning',
            language: 'nb',
          },
          {
            name: 'Verktøy for utforsking',
            language: 'nn',
          },
        ],
        diffType: 'NONE',
      },
      supportedLanguages: {
        original: ['nb', 'nn'],
        other: ['nb', 'nn'],
        diffType: 'NONE',
      },
      metadata: {
        changed: { diffType: 'NONE' },
        grepCodes: {
          original: [],
          other: [],
          diffType: 'NONE',
        },
        visible: {
          original: true,
          other: true,
          diffType: 'NONE',
        },
        customFields: {
          changed: { diffType: 'NONE' },
        },
      },
      primary: {
        original: true,
        other: true,
        diffType: 'NONE',
      },
      children: [
        {
          changed: { diffType: 'MODIFIED' },
          childrenChanged: { diffType: 'NONE' },
          id: {
            original: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            other: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            diffType: 'NONE',
          },
          name: {
            original: 'Samfunnsfaglige metoder',
            other: 'Samfunnsfaglige metoder',
            diffType: 'NONE',
          },
          contentUri: {
            original: 'urn:article:20161',
            other: 'urn:article:20161',
            diffType: 'NONE',
          },
          parent: {
            original: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            other: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            diffType: 'NONE',
          },
          path: {
            original:
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            other:
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            diffType: 'NONE',
          },
          paths: {
            original: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            ],
            other: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            ],
            diffType: 'NONE',
          },
          connectionId: {
            original: 'urn:topic-subtopic:a105eda0-b2db-46c2-af9b-0157d1b764f0',
            other: 'urn:topic-subtopic:a105eda0-b2db-46c2-af9b-0157d1b764f0',
            diffType: 'NONE',
          },
          isPrimary: {
            original: true,
            other: true,
            diffType: 'NONE',
          },
          rank: {
            original: 2,
            other: 2,
            diffType: 'NONE',
          },
          relevanceId: {
            original: 'urn:relevance:core',
            other: 'urn:relevance:core',
            diffType: 'NONE',
          },
          translations: {
            original: [
              {
                name: 'Samfunnsfaglige metoder',
                language: 'nb',
              },
              {
                name: 'Samfunnsfaglege metodar',
                language: 'nn',
              },
            ],
            other: [
              {
                name: 'Samfunnsfaglige metoder',
                language: 'nb',
              },
              {
                name: 'Samfunnsfaglege metodar',
                language: 'nn',
              },
            ],
            diffType: 'NONE',
          },
          supportedLanguages: {
            original: ['nb', 'nn'],
            other: ['nb', 'nn'],
            diffType: 'NONE',
          },
          metadata: {
            changed: { diffType: 'NONE' },
            grepCodes: {
              original: [],
              other: [],
              diffType: 'NONE',
            },
            visible: {
              original: true,
              other: true,
              diffType: 'NONE',
            },
            customFields: {
              changed: { diffType: 'NONE' },
            },
          },
          primary: {
            original: true,
            other: false,
            diffType: 'MODIFIED',
          },
          children: [],
        },
        {
          changed: { diffType: 'NONE' },
          childrenChanged: { diffType: 'NONE' },
          id: {
            original: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            other: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            diffType: 'NONE',
          },
          name: {
            original: 'Kildebruk og kildekritikk oppdatert',
            other: 'Kildebruk og kildekritikk oppdatert',
            diffType: 'NONE',
          },
          contentUri: {
            original: 'urn:article:20162',
            other: 'urn:article:20162',
            diffType: 'NONE',
          },
          parent: {
            original: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            other: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            diffType: 'NONE',
          },
          path: {
            original:
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            other:
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            diffType: 'NONE',
          },
          paths: {
            original: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            ],
            other: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            ],
            diffType: 'NONE',
          },
          connectionId: {
            original: 'urn:topic-subtopic:753b00fa-1a18-4aae-b088-29ecc4a1dd1d',
            other: 'urn:topic-subtopic:753b00fa-1a18-4aae-b088-29ecc4a1dd1d',
            diffType: 'NONE',
          },
          isPrimary: {
            original: true,
            other: true,
            diffType: 'NONE',
          },
          rank: {
            original: 3,
            other: 3,
            diffType: 'NONE',
          },
          relevanceId: {
            original: 'urn:relevance:core',
            other: 'urn:relevance:core',
            diffType: 'NONE',
          },
          translations: {
            original: [
              {
                name: 'Kildebruk og kildekritikk',
                language: 'nb',
              },
              {
                name: 'Kjeldebruk og kjeldekritikk',
                language: 'nn',
              },
            ],
            other: [
              {
                name: 'Kildebruk og kildekritikk',
                language: 'nb',
              },
              {
                name: 'Kjeldebruk og kjeldekritikk',
                language: 'nn',
              },
            ],
            diffType: 'NONE',
          },
          supportedLanguages: {
            original: ['nb', 'nn'],
            other: ['nb', 'nn'],
            diffType: 'NONE',
          },
          metadata: {
            changed: { diffType: 'NONE' },
            grepCodes: {
              original: [],
              other: [],
              diffType: 'NONE',
            },
            visible: {
              original: true,
              other: true,
              diffType: 'NONE',
            },
            customFields: {
              changed: { diffType: 'NONE' },
            },
          },
          primary: {
            original: true,
            other: true,
            diffType: 'NONE',
          },
          children: [],
        },
      ],
    },
  ],
};
