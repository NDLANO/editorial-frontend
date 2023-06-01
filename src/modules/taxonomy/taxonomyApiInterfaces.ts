import { Metadata } from '@ndla/types-taxonomy';

export interface TaxonomyElement {
  id: string;
  name: string;
  metadata: Metadata;
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

export interface SubjectType extends TaxonomyElement {
  contentUri: string;
  path: string;
}
