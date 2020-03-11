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
    current: string,
    other: string[],
  }
  requiredLibraries: [
    {
      mediaType: string;
      url: string;
      name: string;
    },
  ];
}
