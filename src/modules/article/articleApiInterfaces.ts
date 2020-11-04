export interface ArticleSearchResult {
  totalCount: number;
  page?: number;
  pageSize: number;
  language: string;
  results: ArticleSearchSummaryApiType[];
}

export interface ArticleSearchSummaryApiType {
  id: number;
  title: {
    title: string;
    language: string;
  };
  visualElement?: {
    visualElement: string;
    language: string;
  };
  introduction?: {
    introduction: string;
    language: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  url: string;
  license: string;
  articleType: string;
  lastUpdated: string;
  supportedLanguages: string[];
  grepCodes: string[];
}

export interface ArticleApiType {
  id: number;
  revision: number;
  status: {
    status: string;
    other: string[];
  };
  title: {
    title: string;
    language: string;
  };
  content: {
    content: string;
    language: string;
  };
  copyright: Copyright;
  tags: {
    tags: string[];
    language: string;
  };
  requiredLibraries: [
    {
      mediaType: string;
      name: string;
      url: string;
    },
  ];
  visualElement?: {
    visualElement: string;
    language: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  introduction?: {
    introduction: string;
    language: string;
  };
  metaDescription: {
    metaDescription: string;
    language: string;
  };
  created: string;
  updated: string;
  updatedBy: string;
  published: string;
  articleType: string;
  supportedLanguages: string[];
  grepCodes: string[];
}

interface Copyright {
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
}
