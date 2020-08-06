/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FieldProps, FormikHelpers, FormikValues } from 'formik';

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
  learningResourceType: string;
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
  grepCodes: string[];
}

export interface Topic {
  contentUri: string;
  id: string;
  name: string;
  path: string;
  paths: string[];
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

export interface Filter {
  id: string;
  connectionId: string;
  relevanceId: string;
  name: string;
}

export interface SearchResult {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: string[];
}

export interface SubjectType {
  id: string;
  contentUri: string;
  name: string;
  path: string;
}

export interface SubjectpageType {
  facebook: string;
  filters: string[];
  goTo: string[];
  id: string;
  latestContent: string[];
  layout: string;
  metaDescription: string;
  mostRead: string[];
  name: string;
  topical: string;
  twitter: string;
  supportedLanguages: string[];
}

export interface SubjectpageApiType extends SubjectpageType {
  about: {
    visualElement: {
      type: string;
      url: string;
      alt: string;
      caption: string;
      resource_id: string;
    };
    title: string;
    description: string;
  };
  banner: {
    mobileUrl: string;
    mobileId: number;
    desktopUrl: string;
    desktopId: number;
  };
  editorsChoices: string[];
}

export interface SubjectpageEditType extends SubjectpageType {
  description: string;
  desktopBanner: VisualElement;
  editorsChoices: ArticleType[];
  language: string;
  mobileBanner: number;
  subjectId: string;
  title: string;
  visualElement: {
    resource: string;
    url: string;
    resource_id: string;
  };
  visualElementAlt: string;
}

export interface VisualElement {
  resource: string;
  resource_id: string;
  size: string;
  align: string;
  alt: string;
  caption: string;
  url: string;
  metaData: Image;
}

export interface Image {
  alttext: {
    alttext: string;
    language: string;
  };
  caption: {
    caption: string;
    language: string;
  };
  contentType: string;
  copyright: {
    creators: [
      {
        name: string;
      },
    ];
    license: {
      description: string;
      license: string;
      origin: string;
      processors: string[];
      rightsholders: string[];
    };
  };
  id: string;
  imageUrl: string;
  metaUrl: string;
  size: string;
  supportedLanguages: string[];
  tags: {
    language: string;
    tags: string[];
  };
  title: {
    title: string;
    language: string;
  };
}

export interface AccordionProps {
  openIndexes: string[];
  handleItemClick: Function;
}

export interface FormikProps {
  field: FieldProps<ArticleType[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}
