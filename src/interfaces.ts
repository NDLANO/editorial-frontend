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

export interface ArticleType {
  id: number;
  title: string;
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
  };
  metaImage: {
    url: string;
    alt: string;
    language: string;
  };
  oldNdlaUrl: string;
  revision: number;
  updated: string;
  content: string;
  supportedLanguages: string[];
  updatedBy: string;
  articleType: string;
  created: string;
  contentUri: string;
  status: {
    current: string;
    other: string[];
  };
  requiredLibraries: [
    {
      mediaType: string;
      url: string;
      name: string;
    },
  ];
}

export interface ResourceType {
  connectionId: string;
  contentUri: string;
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

export interface LearningpathType {
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
