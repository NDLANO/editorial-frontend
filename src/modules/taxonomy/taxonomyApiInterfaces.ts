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
  relevanceId: string | null;
  parent: string;
  path: string;
  connectionId: string;
  subtopics?: SubjectTopic[];
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
  resourceTypes: ResourceResourceType[];
  topicId: string;
}

export interface TopicResourceType {
  id: string;
  resourceTypeId: string;
  topicId: string;
}

export interface ResourceWithParentTopics extends Resource {
  parentTopics: ParentTopic[];
}

export interface ParentTopic {
  id: string;
  name: string;
  contentUri: string;
  path: string;
  primary: boolean;
  isPrimary: boolean;
  connectionId: string;
}

export type ParentTopicWithRelevanceAndConnections = ParentTopic & {
  topicConnections: TopicConnections[];
  relevanceId: string;
};

export interface ResourceTranslation {
  name: string;
  language: string;
}

export interface TopicWithResourceConnection {
  connectionId: string;
  isPrimary: boolean;
  rank: number;
}

export interface TopicConnections {
  connectionId: string;
  primary: boolean;
  paths: string;
  targetId: string;
  type: string;
}

export interface ResourceResourceType {
  id: string;
  name: string;
  parentId: string;
  connectionId: string;
}

export interface ResourceType {
  id: string;
  name: string;
  subtypes: {
    id: string;
    name: string;
  }[];
}

export interface ResourceWithTopicConnection extends Resource {
  primary: boolean;
  relevanceId: string;
}

export interface TopicSubtopic {
  id: string;
  primary: boolean;
  rank: number;
  relevanceId: string;
  subtopicid: string;
  topicid: string;
}

export interface SubjectType extends TaxonomyElement {
  contentUri: string;
  path: string;
}
