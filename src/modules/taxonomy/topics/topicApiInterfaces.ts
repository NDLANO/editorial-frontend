export interface TopicPostBody {
  contentUri?: string;
  id?: string;
  name: string;
}

export interface TopicSubtopicPostBody {
  subtopicid: string;
  topicid: string;
  relevanceId?: string;
  primary?: boolean;
  rank?: number;
}
