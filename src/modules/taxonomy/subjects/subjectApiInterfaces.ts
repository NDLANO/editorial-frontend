export interface SubjectTopicPostBody {
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
  subjectid: string;
  topicid: string;
}

export interface SubjectTopicPutBody {
  id?: string;
  rank?: number;
  primary?: boolean;
  relevanceId?: string;
}

export interface SubjectPostBody {
  contentUri?: string;
  id?: string;
  name: string;
}

export interface SubjectPutBody {
  name?: string;
  contentUri?: string;
}

export interface SubjectMetadataPutBody {
  grepCodes?: string[];
  visible?: boolean;
  customFields?: Record<string, any>;
}

export interface SubjectNameTranslationPutBody {
  name: string;
}
