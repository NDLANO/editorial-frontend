export interface SubjectTopicPutBody {
  id?: string;
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}

export interface SubjectTopicPostBody {
  subjectid: string;
  topicid: string;
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}
