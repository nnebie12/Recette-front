import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun commentaire pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;