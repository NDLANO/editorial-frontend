/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TranslateType {
  (
    key: string,
    values?: {
      [key: string]: string | number;
    },
  ): string;
}

interface Status {
  current: string;
  other: string[];
}

export interface ResourceType {
  id: string;
  name: string;
  resources?: Resource[];
}

export interface ContentResultType {
  id: number;
  title: { title: string };
  url?: string;
  metaDescription?: { metaDescription: string };
  metaImage?: { alt: string; url: string; language: string };
  contexts: [
    {
      learningResourceType: string;
      resourceTypes: ResourceType[];
    },
  ];
}

export interface ArticleType {
  id: number;
  title: {
    title: string;
    language: string;
  };
  language: string;
  agreementId: number;
  introduction: string;
  validTo: string;
  validFrom: string;
  visualElement: string;
  metaDescription: string;
  tags: string[];
  published: string;
  copyright: {
    license: {
      license: string;
      description: string;
      url: string;
    };
    processors: [
      {
        name: string;
        type: string;
      },
    ];
    origin: [
      {
        name: string;
        type: string;
      },
    ];
    rightsholders: [
      {
        type: string;
        name: string;
      },
    ];
    creators: [
      {
        type: string;
        name: string;
      },
    ];
  };
  metaImage: {
    url: string;
    alt: string;
    language: string;
  };
  oldNdlaUrl: string;
  revision: number;
  updated: string;
  supportedLanguages: string[];
  updatedBy: string;
  articleType: string;
  created: string;
  contentUri: string;
  requiredLibraries: [
    {
      mediaType: string;
      url: string;
      name: string;
    },
  ];
  notes: [
    {
      note: string;
      user: string;
      status: Status;
      timestamp: string;
    },
  ];
  taxonomy: {
    topics: [
      {
        id: string;
        name: string;
        contentUri: string;
        path: string;
        paths: string[];
      },
    ];
  };
  status: Status;
  content: string;
  competences: string[];
}

export interface Topic {
  contentUri: string,
  id: string,
  name: string,
  path: string,
  paths: string[],
}

export interface Resource {
  connectionId: string;
  contentUri?: string;
  id: string;
  isPrimary: boolean;
  name: string;
  path: string;
  paths: string[];
  rank: number;
  resourceTypes: [
    {
      id: string;
      name: string;
    },
  ];
  topicId: string;
}

export interface Learningpath {
  copyright: {
    license: {
      license: string;
      description: string;
      url: string;
    };
    contributors: [
      {
        type: string;
        name: string;
      },
    ];
  };
  duration: number;
  canEdit: boolean;
  verificationStatus: string;
  lastUpdated: string;
  description: {
    description: string;
    language: string;
  };
  tags: {
    tags: string[];
    language: string;
  };
  isBasedOn: number;
  learningsteps: [
    {
      seqNo: number;
      metaUrl: string;
      id: number;
      title: {
        title: string;
        language: string;
      };
      type: string;
    },
  ];
  metaUrl: string;
  revision: number;
  learningstepUrl: string;
  id: number;
  status: string;
  ownerId: string;
  supportedLanguages: string[];
  message: {
    message: string;
    date: string;
  };
  coverPhoto: {
    url: string;
    metaUrl: string;
  };
  title: {
    title: string;
    language: string;
  };
}
