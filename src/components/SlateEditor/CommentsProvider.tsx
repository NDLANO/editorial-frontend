/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CommentType = { uid: string; content: string };

interface Props {
  children: ReactNode;
}
interface CommentsContextType {
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

const CommentsProvider = ({ children }: Props) => {
  const [comments, setComments] = useState<CommentType[]>([]);

  return (
    <CommentsContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentsContext.Provider>
  );
};

const useCommentsContext = (): CommentsContextType => {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error('useCommentsContext must be used within a CommentsProvider');
  }
  return context;
};

export { CommentsProvider, useCommentsContext };
