interface TopicPutBodyBase {
  id?: string;
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}

export type TopicSubtopicPutBody = TopicPutBodyBase;

export type SubjectTopicPutBody = TopicPutBodyBase;
