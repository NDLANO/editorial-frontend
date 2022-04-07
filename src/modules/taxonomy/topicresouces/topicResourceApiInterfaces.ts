export interface TopicResourcePostBody {
  resourceId: string;
  topicid: string;
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}

export interface TopicResourcePutBody {
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}
