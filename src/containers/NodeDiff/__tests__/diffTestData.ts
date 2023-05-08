import { tr } from 'date-fns/locale';
import { DiffTree, NodeTree } from '../diffUtils';

export const nodeTreeWithNoChildren: NodeTree = {
  root: {
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
    resources: [],
    resourceTypes: [],
    nodeType: 'SUBJECT',
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
  },
  children: [],
};

export const nodeTreeWithNoChildrenUpdated: NodeTree = {
  root: {
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
    resources: [],
    resourceTypes: [],
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
    nodeType: 'SUBJECT',
  },
  children: [],
};

export const nodeTreeWithNoChildrenDiff: DiffTree = {
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
      ignored: true,
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'NONE',
      ignored: true,
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
    resources: [],
    resourcesChanged: {
      diffType: 'NONE',
    },
    resourceTypes: { diffType: 'NONE', original: [], other: [] },
    contexts: {
      diffType: 'NONE',
      ignored: true,
      original: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
      other: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
    },
    nodeType: { diffType: 'NONE', original: 'SUBJECT', other: 'SUBJECT' },
  },
  children: [],
};

export const nodeTreeWithDirectChildren: NodeTree = {
  root: {
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
    resources: [],
    resourceTypes: [],
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
    nodeType: 'SUBJECT',
  },
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          contextId: 'top1',
        },
      ],
    },
    {
      id: 'urn:topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
      name: 'Sosialisering, identitet og livsmestring',
      contentUri: 'urn:article:20126',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
          contextId: 'top2',
        },
      ],
    },
  ],
};

export const nodeTreeWithDirectChildrenUpdated: NodeTree = {
  root: {
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
    resources: [],
    nodeType: 'SUBJECT',
    resourceTypes: [],
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
  },
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          contextId: 'top1',
        },
      ],
    },
    {
      id: 'urn:topic:1:00018b29-3b51-478d-a691-20732e0601fd',
      name: 'Ulikheter og utenforskap',
      contentUri: 'urn:article:20138',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:00018b29-3b51-478d-a691-20732e0601fd',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
          contextId: 'top2',
        },
      ],
    },
  ],
};

export const nodeTreeWithDirectChildrenDiff: DiffTree = {
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
      ignored: true,
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'NONE',
      ignored: true,
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
    resources: [],
    resourcesChanged: { diffType: 'NONE' },
    resourceTypes: { diffType: 'NONE', original: [], other: [] },
    nodeType: { diffType: 'NONE', original: 'SUBJECT', other: 'SUBJECT' },
    contexts: {
      diffType: 'NONE',
      ignored: true,
      original: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
      other: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
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
      parentId: {
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
        ignored: true,
      },
      paths: {
        original: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        other: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        diffType: 'NONE',
        ignored: true,
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
      resources: [],
      resourcesChanged: {
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
      nodeType: {
        original: 'TOPIC',
        other: 'TOPIC',
        diffType: 'NONE',
      },
      resourceTypes: {
        original: [],
        other: [],
        diffType: 'NONE',
      },
      contexts: {
        diffType: 'NONE',
        ignored: true,
        original: [
          {
            publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            contextId: 'top1',
          },
        ],
        other: [
          {
            publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            contextId: 'top1',
          },
        ],
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
      parentId: {
        original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        other: undefined,
        diffType: 'DELETED',
      },
      path: {
        original:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
        other: undefined,
        diffType: 'DELETED',
        ignored: true,
      },
      paths: {
        original: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
        ],
        other: undefined,
        diffType: 'DELETED',
        ignored: true,
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
      resources: [],
      resourcesChanged: {
        diffType: 'NONE',
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
      nodeType: {
        original: 'TOPIC',
        other: undefined,
        diffType: 'DELETED',
      },
      resourceTypes: {
        original: [],
        other: undefined,
        diffType: 'DELETED',
      },
      contexts: {
        diffType: 'DELETED',
        ignored: true,
        original: [
          {
            publicId: 'urn:topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
            contextId: 'top2',
          },
        ],
        other: undefined,
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
      parentId: {
        original: undefined,
        other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        diffType: 'ADDED',
      },
      path: {
        original: undefined,
        other:
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
        diffType: 'ADDED',
        ignored: true,
      },
      paths: {
        original: undefined,
        other: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
        ],
        diffType: 'ADDED',
        ignored: true,
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
      resources: [],
      resourcesChanged: {
        diffType: 'NONE',
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
      nodeType: {
        original: undefined,
        other: 'TOPIC',
        diffType: 'ADDED',
      },
      resourceTypes: {
        original: undefined,
        other: [],
        diffType: 'ADDED',
      },
      contexts: {
        diffType: 'ADDED',
        ignored: true,
        original: undefined,
        other: [
          {
            publicId: 'urn:topic:1:00018b29-3b51-478d-a691-20732e0601fd',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:00018b29-3b51-478d-a691-20732e0601fd',
            contextId: 'top2',
          },
        ],
      },
    },
  ],
};

export const nodeTreeWithDirectChildrenAndResources: NodeTree = {
  root: {
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
    resources: [],
    nodeType: 'SUBJECT',
    resourceTypes: [],
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
  },
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
      name: 'Sosialisering, identitet og livsmestring',
      contentUri: 'urn:article:20126',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:d208bf2d-836c-43fe-977b-de4af1771396',
          contextId: 'top',
        },
      ],
    },
  ],
};

export const nodeTreeWithNestedChildren: NodeTree = {
  root: {
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
    resources: [],
    nodeType: 'SUBJECT',
    resourceTypes: [],
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
  },
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      name: 'Samfunnsfaglige metoder',
      contentUri: 'urn:article:20161',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      name: 'Kildebruk og kildekritikk oppdatert',
      contentUri: 'urn:article:20162',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          contextId: 'top',
        },
      ],
    },
  ],
};

export const nodeTreeWithNestedChildrenUpdated: NodeTree = {
  root: {
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
    resources: [],
    nodeType: 'SUBJECT',
    resourceTypes: [],
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
  },
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      name: 'Samfunnsfaglige metoder',
      contentUri: 'urn:article:20161',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      name: 'Kildebruk og kildekritikk oppdatert',
      contentUri: 'urn:article:20162',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          contextId: 'top',
        },
      ],
    },
  ],
};

export const nodeTreeWithNestedChildrenDiff: DiffTree = {
  root: {
    changed: { diffType: 'NONE' },
    childrenChanged: { diffType: 'NONE' },
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
      ignored: true,
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'NONE',
      ignored: true,
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
    resources: [],
    resourcesChanged: {
      diffType: 'NONE',
    },
    resourceTypes: {
      original: [],
      other: [],
      diffType: 'NONE',
    },
    nodeType: {
      original: 'SUBJECT',
      other: 'SUBJECT',
      diffType: 'NONE',
    },
    contexts: {
      diffType: 'NONE',
      ignored: true,
      original: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
      other: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
    },
  },
  children: [
    {
      changed: { diffType: 'NONE' },
      childrenChanged: { diffType: 'NONE' },
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
      parentId: {
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
        ignored: true,
      },
      paths: {
        original: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        other: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        diffType: 'NONE',
        ignored: true,
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
      resources: [],
      resourcesChanged: {
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
      children: [
        {
          changed: { diffType: 'NONE' },
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
          parentId: {
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
            ignored: true,
          },
          paths: {
            original: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            ],
            other: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            ],
            diffType: 'NONE',
            ignored: true,
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
          resources: [],
          resourcesChanged: {
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
          children: [],
          resourceTypes: { diffType: 'NONE', original: [], other: [] },
          nodeType: { diffType: 'NONE', original: 'TOPIC', other: 'TOPIC' },
          contexts: {
            diffType: 'NONE',
            ignored: true,
            original: [
              {
                publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                contextId: 'top',
              },
            ],
            other: [
              {
                publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                contextId: 'top',
              },
            ],
          },
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
          parentId: {
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
            ignored: true,
          },
          paths: {
            original: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            ],
            other: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            ],
            diffType: 'NONE',
            ignored: true,
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
          resources: [],
          resourcesChanged: {
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
          children: [],
          resourceTypes: {
            original: [],
            other: [],
            diffType: 'NONE',
          },
          nodeType: {
            original: 'TOPIC',
            other: 'TOPIC',
            diffType: 'NONE',
          },
          contexts: {
            diffType: 'NONE',
            ignored: true,
            original: [
              {
                publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                contextId: 'top',
              },
            ],
            other: [
              {
                publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                contextId: 'top',
              },
            ],
          },
        },
      ],
      resourceTypes: {
        original: [],
        other: [],
        diffType: 'NONE',
      },
      nodeType: {
        original: 'TOPIC',
        other: 'TOPIC',
        diffType: 'NONE',
      },
      contexts: {
        diffType: 'NONE',
        ignored: true,
        original: [
          {
            publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            contextId: 'top',
          },
        ],
        other: [
          {
            publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            contextId: 'top',
          },
        ],
      },
    },
  ],
};

export const nodeTreeInOriginalVersionDiff: DiffTree = {
  root: {
    changed: { diffType: 'DELETED' },
    childrenChanged: { diffType: 'NONE' },
    id: {
      original: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: undefined,
      diffType: 'DELETED',
    },
    name: {
      original: 'Samfunnskunnskap',
      other: undefined,
      diffType: 'DELETED',
    },
    contentUri: {
      original: 'urn:frontpage:62',
      other: undefined,
      diffType: 'DELETED',
    },
    path: {
      original: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      other: undefined,
      diffType: 'DELETED',
      ignored: true,
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: undefined,
      diffType: 'DELETED',
      ignored: true,
    },
    metadata: {
      changed: { diffType: 'DELETED' },
      grepCodes: {
        original: ['KV48'],
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
        'old-subject-id': {
          original: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          other: undefined,
          diffType: 'DELETED',
        },
        subjectCategory: {
          original: 'active',
          other: undefined,
          diffType: 'DELETED',
        },
      },
    },
    relevanceId: {
      original: undefined,
      other: undefined,
      diffType: 'DELETED',
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
      other: undefined,
      diffType: 'DELETED',
    },
    supportedLanguages: {
      original: ['en', 'nb', 'nn'],
      other: undefined,
      diffType: 'DELETED',
    },
    resources: [],
    resourcesChanged: { diffType: 'NONE' },
    resourceTypes: { diffType: 'DELETED', original: [], other: undefined },
    nodeType: { diffType: 'DELETED', original: 'SUBJECT', other: undefined },
    contexts: {
      diffType: 'DELETED',
      ignored: true,
      original: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
      other: undefined,
    },
  },
  children: [],
};

export const nodeTreeInOtherVersionDiff: DiffTree = {
  root: {
    changed: { diffType: 'ADDED' },
    childrenChanged: { diffType: 'NONE' },
    id: {
      original: undefined,
      other: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'ADDED',
    },
    name: {
      original: undefined,
      other: 'Samfunnskunnskap',
      diffType: 'ADDED',
    },
    contentUri: {
      original: undefined,
      other: 'urn:frontpage:62',
      diffType: 'ADDED',
    },
    path: {
      original: undefined,
      other: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      diffType: 'ADDED',
      ignored: true,
    },
    paths: {
      original: undefined,
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'ADDED',
      ignored: true,
    },
    metadata: {
      changed: { diffType: 'ADDED' },
      grepCodes: {
        original: undefined,
        other: ['KV48'],
        diffType: 'ADDED',
      },
      visible: {
        original: undefined,
        other: true,
        diffType: 'ADDED',
      },
      customFields: {
        changed: { diffType: 'ADDED' },
        'old-subject-id': {
          original: undefined,
          other: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          diffType: 'ADDED',
        },
        subjectCategory: {
          original: undefined,
          other: 'active',
          diffType: 'ADDED',
        },
      },
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
      diffType: 'ADDED',
    },
    supportedLanguages: {
      original: undefined,
      other: ['en', 'nb', 'nn'],
      diffType: 'ADDED',
    },
    resources: [],
    resourcesChanged: { diffType: 'NONE' },
    resourceTypes: { diffType: 'ADDED', original: undefined, other: [] },
    nodeType: { diffType: 'ADDED', original: undefined, other: 'SUBJECT' },
    contexts: {
      diffType: 'ADDED',
      ignored: true,
      original: undefined,
      other: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
    },
  },
  children: [],
};

export const nodeTreeWithNestedChildrenAndResources: NodeTree = {
  root: {
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
    resources: [],
    resourceTypes: [],
    nodeType: 'SUBJECT',
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
  },
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
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
      resources: [],
      resourceTypes: [],
      nodeType: 'TOPIC',
      contexts: [
        {
          publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      name: 'Samfunnsfaglige metoder',
      contentUri: 'urn:article:20161',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
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
      resources: [
        {
          id: 'urn:resource:1:168358',
          name: 'Ulike metoder',
          contentUri: 'urn:article:7',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
          metadata: {
            grepCodes: [],
            visible: true,
            customFields: {},
          },
          resourceTypes: [
            {
              id: 'urn:resourcetype:subjectMaterial',
              parentId: undefined,
              name: 'Fagstoff',
              translations: [
                {
                  name: 'Subject Material',
                  language: 'en',
                },
              ],
              supportedLanguages: ['en'],
              connectionId: 'urn:resource-resourcetype:ea2dd1b9-0931-4ede-b51c-32a744fc2384',
            },
            {
              id: 'urn:resourcetype:academicArticle',
              parentId: 'urn:resourcetype:subjectMaterial',
              name: 'Fagartikkel',
              translations: [
                {
                  name: 'Article',
                  language: 'en',
                },
              ],
              supportedLanguages: ['en'],
              connectionId: 'urn:resource-resourcetype:e31b24eb-eeab-48ef-968e-dc2c3398ea00',
            },
          ],
          paths: [
            '/subject:1:19dae192-699d-488f-8218-d81535ce3ae3/topic:2:179373/topic:2:170165/resource:1:168358',
            '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
            '/subject:1:5f50e974-6251-42c7-8f04-c4fabf395d0f/topic:1:089ff1c8-82dd-4934-b717-0d4994ed0425/topic:1:ce7888fb-3851-45d7-9182-4452da85daea/topic:2:7c5d7c38-22e4-4998-ab7f-797695263f8c/resource:1:168358',
          ],
          translations: [
            {
              name: 'Ulike metoder',
              language: 'nb',
            },
            {
              name: 'Ulike metodar',
              language: 'nn',
            },
          ],
          supportedLanguages: ['nb', 'nn'],
          parentId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          connectionId: 'urn:topic-resource:4e8305fa-7aac-4c08-97dc-9630becdb83a',
          rank: 2,
          relevanceId: 'urn:relevance:core',
          isPrimary: true,
          nodeType: 'RESOURCE',
          contexts: [
            {
              publicId: 'urn:resource:1:168358',
              rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
              contextId: 'res',
            },
          ],
        },
      ],
      resourceTypes: [],
      nodeType: 'TOPIC',
      contexts: [
        {
          publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      name: 'Kildebruk og kildekritikk oppdatert',
      contentUri: 'urn:article:20162',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
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
      resources: [],
      resourceTypes: [],
      nodeType: 'TOPIC',
      contexts: [
        {
          publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          contextId: 'top',
        },
      ],
    },
  ],
};

export const nodeTreeWithNestedChildrenAndResourcesUpdated: NodeTree = {
  root: {
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
    resources: [],
    resourceTypes: [],
    nodeType: 'SUBJECT',
    contexts: [
      {
        publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
        contextId: 'sub',
      },
    ],
  },
  children: [
    {
      id: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      name: 'Verktøy for utforskning',
      contentUri: 'urn:article:20136',
      parentId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
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
      resources: [],
      resourceTypes: [],
      nodeType: 'TOPIC',
      contexts: [
        {
          publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
          contextId: 'top',
        },
      ],
    },
    {
      id: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
      name: 'Samfunnsfaglige metoder',
      contentUri: 'urn:article:20161',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
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
      contexts: [
        {
          publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          contextId: 'top',
        },
      ],
      resources: [
        {
          id: 'urn:resource:1:168358',
          name: 'Ulike metoder oppdatert',
          contentUri: 'urn:article:7',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
          metadata: {
            grepCodes: [],
            visible: true,
            customFields: {},
          },
          resourceTypes: [
            {
              id: 'urn:resourcetype:subjectMaterial',
              parentId: undefined,
              name: 'Fagstoff',
              translations: [
                {
                  name: 'Subject Material',
                  language: 'en',
                },
              ],
              supportedLanguages: ['en'],
              connectionId: 'urn:resource-resourcetype:ea2dd1b9-0931-4ede-b51c-32a744fc2384',
            },
            {
              id: 'urn:resourcetype:academicArticle',
              parentId: 'urn:resourcetype:subjectMaterial',
              name: 'Fagartikkel',
              translations: [
                {
                  name: 'Article',
                  language: 'en',
                },
              ],
              supportedLanguages: ['en'],
              connectionId: 'urn:resource-resourcetype:e31b24eb-eeab-48ef-968e-dc2c3398ea00',
            },
          ],
          paths: [
            '/subject:1:19dae192-699d-488f-8218-d81535ce3ae3/topic:2:179373/topic:2:170165/resource:1:168358',
            '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
            '/subject:1:5f50e974-6251-42c7-8f04-c4fabf395d0f/topic:1:089ff1c8-82dd-4934-b717-0d4994ed0425/topic:1:ce7888fb-3851-45d7-9182-4452da85daea/topic:2:7c5d7c38-22e4-4998-ab7f-797695263f8c/resource:1:168358',
          ],
          translations: [
            {
              name: 'Ulike metoder',
              language: 'nb',
            },
            {
              name: 'Ulike metodar',
              language: 'nn',
            },
          ],
          supportedLanguages: ['nb', 'nn'],
          parentId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
          connectionId: 'urn:topic-resource:4e8305fa-7aac-4c08-97dc-9630becdb83a',
          rank: 2,
          relevanceId: 'urn:relevance:core',
          nodeType: 'RESOURCE',
          contexts: [
            {
              publicId: 'urn:resource:1:168358',
              rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
              path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
              contextId: 'res',
            },
          ],
          isPrimary: true,
        },
      ],
      nodeType: 'TOPIC',
      resourceTypes: [],
    },
    {
      id: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
      name: 'Kildebruk og kildekritikk oppdatert',
      contentUri: 'urn:article:20162',
      parentId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
      path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
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
      resources: [],
      nodeType: 'TOPIC',
      resourceTypes: [],
      contexts: [
        {
          publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
          contextId: 'top',
        },
      ],
    },
  ],
};

export const nodeTreeWithNestedChildrenAndResourcesDiff: DiffTree = {
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
      ignored: true,
    },
    paths: {
      original: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      other: ['/subject:1:470720f9-6b03-40cb-ab58-e3e130803578'],
      diffType: 'NONE',
      ignored: true,
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
    resources: [],
    resourcesChanged: { diffType: 'NONE' },
    resourceTypes: { diffType: 'NONE', original: [], other: [] },
    nodeType: { diffType: 'NONE', original: 'SUBJECT', other: 'SUBJECT' },
    contexts: {
      diffType: 'NONE',
      ignored: true,
      original: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
      other: [
        {
          publicId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
          contextId: 'sub',
        },
      ],
    },
  },
  children: [
    {
      changed: { diffType: 'NONE' },
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
      parentId: {
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
        ignored: true,
      },
      paths: {
        original: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        other: [
          '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
        ],
        diffType: 'NONE',
        ignored: true,
      },
      childrenChanged: { diffType: 'MODIFIED' },
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
      resources: [],
      resourcesChanged: { diffType: 'NONE' },
      children: [
        {
          changed: { diffType: 'NONE' },
          children: [],
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
          parentId: {
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
            ignored: true,
          },
          paths: {
            original: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            ],
            other: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
            ],
            diffType: 'NONE',
            ignored: true,
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
          supportedLanguages: { original: ['nb', 'nn'], other: ['nb', 'nn'], diffType: 'NONE' },
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
          resourcesChanged: {
            diffType: 'MODIFIED',
          },
          nodeType: { diffType: 'NONE', original: 'TOPIC', other: 'TOPIC' },
          resourceTypes: { diffType: 'NONE', original: [], other: [] },
          resources: [
            {
              changed: { diffType: 'MODIFIED' },
              id: {
                original: 'urn:resource:1:168358',
                other: 'urn:resource:1:168358',
                diffType: 'NONE',
              },
              name: {
                original: 'Ulike metoder',
                other: 'Ulike metoder oppdatert',
                diffType: 'MODIFIED',
              },
              contentUri: { original: 'urn:article:7', other: 'urn:article:7', diffType: 'NONE' },
              path: {
                original:
                  '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
                other:
                  '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
                diffType: 'NONE',
                ignored: true,
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
              resourceTypes: {
                original: [
                  {
                    id: 'urn:resourcetype:subjectMaterial',
                    parentId: undefined,
                    name: 'Fagstoff',
                    translations: [
                      {
                        name: 'Subject Material',
                        language: 'en',
                      },
                    ],
                    supportedLanguages: ['en'],
                    connectionId: 'urn:resource-resourcetype:ea2dd1b9-0931-4ede-b51c-32a744fc2384',
                  },
                  {
                    id: 'urn:resourcetype:academicArticle',
                    parentId: 'urn:resourcetype:subjectMaterial',
                    name: 'Fagartikkel',
                    translations: [
                      {
                        name: 'Article',
                        language: 'en',
                      },
                    ],
                    supportedLanguages: ['en'],
                    connectionId: 'urn:resource-resourcetype:e31b24eb-eeab-48ef-968e-dc2c3398ea00',
                  },
                ],
                other: [
                  {
                    id: 'urn:resourcetype:subjectMaterial',
                    parentId: undefined,
                    name: 'Fagstoff',
                    translations: [
                      {
                        name: 'Subject Material',
                        language: 'en',
                      },
                    ],
                    supportedLanguages: ['en'],
                    connectionId: 'urn:resource-resourcetype:ea2dd1b9-0931-4ede-b51c-32a744fc2384',
                  },
                  {
                    id: 'urn:resourcetype:academicArticle',
                    parentId: 'urn:resourcetype:subjectMaterial',
                    name: 'Fagartikkel',
                    translations: [
                      {
                        name: 'Article',
                        language: 'en',
                      },
                    ],
                    supportedLanguages: ['en'],
                    connectionId: 'urn:resource-resourcetype:e31b24eb-eeab-48ef-968e-dc2c3398ea00',
                  },
                ],
                diffType: 'NONE',
              },
              paths: {
                original: [
                  '/subject:1:19dae192-699d-488f-8218-d81535ce3ae3/topic:2:179373/topic:2:170165/resource:1:168358',
                  '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
                  '/subject:1:5f50e974-6251-42c7-8f04-c4fabf395d0f/topic:1:089ff1c8-82dd-4934-b717-0d4994ed0425/topic:1:ce7888fb-3851-45d7-9182-4452da85daea/topic:2:7c5d7c38-22e4-4998-ab7f-797695263f8c/resource:1:168358',
                ],
                other: [
                  '/subject:1:19dae192-699d-488f-8218-d81535ce3ae3/topic:2:179373/topic:2:170165/resource:1:168358',
                  '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
                  '/subject:1:5f50e974-6251-42c7-8f04-c4fabf395d0f/topic:1:089ff1c8-82dd-4934-b717-0d4994ed0425/topic:1:ce7888fb-3851-45d7-9182-4452da85daea/topic:2:7c5d7c38-22e4-4998-ab7f-797695263f8c/resource:1:168358',
                ],
                diffType: 'NONE',
                ignored: true,
              },
              translations: {
                original: [
                  {
                    name: 'Ulike metoder',
                    language: 'nb',
                  },
                  {
                    name: 'Ulike metodar',
                    language: 'nn',
                  },
                ],
                other: [
                  {
                    name: 'Ulike metoder',
                    language: 'nb',
                  },
                  {
                    name: 'Ulike metodar',
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
              parentId: {
                original: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                other: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                diffType: 'NONE',
              },
              connectionId: {
                original: 'urn:topic-resource:4e8305fa-7aac-4c08-97dc-9630becdb83a',
                other: 'urn:topic-resource:4e8305fa-7aac-4c08-97dc-9630becdb83a',
                diffType: 'NONE',
              },
              rank: {
                original: 2,
                other: 2,
                diffType: 'NONE',
              },
              isPrimary: {
                original: true,
                other: true,
                diffType: 'NONE',
              },
              relevanceId: {
                original: 'urn:relevance:core',
                other: 'urn:relevance:core',
                diffType: 'NONE',
              },
              nodeType: {
                original: 'RESOURCE',
                other: 'RESOURCE',
                diffType: 'NONE',
              },
              contexts: {
                diffType: 'NONE',
                ignored: true,
                original: [
                  {
                    publicId: 'urn:resource:1:168358',
                    rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                    path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
                    contextId: 'res',
                  },
                ],
                other: [
                  {
                    publicId: 'urn:resource:1:168358',
                    rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                    path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6/resource:1:168358',
                    contextId: 'res',
                  },
                ],
              },
            },
          ],
          contexts: {
            diffType: 'NONE',
            ignored: true,
            original: [
              {
                publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                contextId: 'top',
              },
            ],
            other: [
              {
                publicId: 'urn:topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:35efa357-acc7-4828-b241-cad5467d1dc6',
                contextId: 'top',
              },
            ],
          },
        },
        {
          changed: { diffType: 'NONE' },
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
          parentId: {
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
            ignored: true,
          },
          paths: {
            original: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            ],
            other: [
              '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
            ],
            diffType: 'NONE',
            ignored: true,
          },
          children: [],
          childrenChanged: { diffType: 'NONE' },
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
          resources: [],
          resourcesChanged: {
            diffType: 'NONE',
          },
          resourceTypes: { diffType: 'NONE', original: [], other: [] },
          nodeType: { diffType: 'NONE', original: 'TOPIC', other: 'TOPIC' },
          contexts: {
            diffType: 'NONE',
            ignored: true,
            original: [
              {
                publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                contextId: 'top',
              },
            ],
            other: [
              {
                publicId: 'urn:topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
                path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6/topic:1:8d9885a4-a932-4a98-b8c4-2b89c914c3e8',
                contextId: 'top',
              },
            ],
          },
        },
      ],
      resourceTypes: { diffType: 'NONE', original: [], other: [] },
      nodeType: { diffType: 'NONE', original: 'TOPIC', other: 'TOPIC' },
      contexts: {
        diffType: 'NONE',
        ignored: true,
        original: [
          {
            publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            contextId: 'top',
          },
        ],
        other: [
          {
            publicId: 'urn:topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            rootId: 'urn:subject:1:470720f9-6b03-40cb-ab58-e3e130803578',
            path: '/subject:1:470720f9-6b03-40cb-ab58-e3e130803578/topic:1:a317f589-7995-43aa-8b68-92182c0b23c6',
            contextId: 'top',
          },
        ],
      },
    },
  ],
};
