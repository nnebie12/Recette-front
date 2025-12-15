import React from 'react';
import { User } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';

const CommentItem = ({ comment }) => {
  return (
    <div className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-orange-500" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-gray-900">
            {comment.userName || 'Utilisateur anonyme'}
          </h4>
          <span className="text-sm text-gray-500">
            {formatRelativeTime(comment.dateCommentaire)}
          </span>
        </div>
        <p className="text-gray-700">{comment.contenu}</p>
      </div>
    </div>
  );
};

export default CommentItem;