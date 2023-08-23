import { Metadata } from '@ndla/types-taxonomy';

interface TaxonomyElement {
  id: string;
  name: string;
  metadata: Metadata;
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

interface ResourceResourceType {
  id: string;
  name: string;
  parentId?: string;
  connectionId: string;
}

export interface SubjectType extends TaxonomyElement {
  contentUri: string;
  path: string;
}
