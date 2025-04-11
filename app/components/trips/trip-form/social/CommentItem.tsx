// app/components/trips/trip-form/social/CommentItem.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Comment } from '@/types/invitation';

interface CommentItemProps {
    comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    return (
        <div key={comment.id} className={`p-4 ${comment.author === 'System' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'} rounded-lg space-y-2`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.author}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    {comment.isNew && (
                        <Badge className="bg-blue-500">New</Badge>
                    )}
                    <span className="text-sm text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <p className={`${comment.author === 'System' ? 'text-blue-700 dark:text-blue-300 italic' : 'text-gray-700 dark:text-gray-300'}`}>
                {comment.content}
            </p>
        </div>
    );
};

export default CommentItem;