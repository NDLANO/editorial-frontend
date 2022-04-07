export interface TopicPostBody {
  contentUri?: string;
  id?: string;
  name: string;
}

export interface TopicPutBody {
  name?: string;
  contentUri?: string;
}

export interface TopicSubtopicPostBody {
  subtopicid: string;
  topicid: string;
  relevanceId?: string;
  primary?: boolean;
  rank?: number;
}

export interface TopicSubtopicPutBody {
  id?: string;
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}
