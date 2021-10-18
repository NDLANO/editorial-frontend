/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
