export interface SubjectTopicPostBody {
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
  subjectid: string;
  topicid: string;
}

export interface SubjectPutBody {
  name?: string;
  contentUri?: string;
}
