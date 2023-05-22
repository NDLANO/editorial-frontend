import { LocaleType } from '../../interfaces';

export interface TaxonomyElement {
  id: string;
  name: string;
  metadata: TaxonomyMetadata;
}

export interface TaxonomyMetadata {
  grepCodes: string[];
  visible: boolean;
  customFields: Record<string, string>;
}

export interface SubjectTopic extends TaxonomyElement {
  contentUri: string;
  isPrimary: boolean;
  relevanceId?: string;
  parentId: string;
  path: string;
  paths: string[];
  connectionId: string;
  subtopics?: SubjectTopic[];
  rank: number;
}

export interface ResolvedUrl {
  contentUri: string;
  id: string;
  name: string;
  parents: string[];
  path: string;
}

export interface Topic extends TaxonomyElement {
  contentUri: string;
  path: string;
  paths: string[];
}

export interface Resource extends TaxonomyElement {
  connectionId: string;
  contentUri?: string;
  isPrimary: boolean;
  path: string;
  paths: string[];
  rank: number;
  parentId?: string;
  resourceTypes: ResourceResourceType[];
  grepCodes: string[];
}

export interface ResourceWithParentTopics extends Resource {
  parents: ParentTopic[];
}

export interface ParentTopic extends TaxonomyElement {
  id: string;
  name: string;
  contentUri: string;
  path: string;
  isPrimary: boolean;
  connectionId: string;
  paths: string[];
}

export type ParentTopicWithRelevanceAndConnections = ParentTopic & {
  topicConnections: TopicConnections[];
  relevanceId: string;
  breadcrumb: TaxonomyElement[];
};

export interface TopicConnections {
  isPrimary: boolean;
  connectionId: string;
  paths: string[];
  targetId: string;
  type: string;
}

export interface ResourceResourceType {
  id: string;
  name: string;
  parentId?: string;
  connectionId: string;
}

export interface ResourceType {
  id: string;
  name: string;
  subtypes?: {
    id: string;
    name: string;
  }[];
}

export interface ResourceWithTopicConnection extends Resource {
  primary: boolean;
  relevanceId: string;
}

export interface SubjectType extends TaxonomyElement {
  contentUri: string;
  path: string;
}
