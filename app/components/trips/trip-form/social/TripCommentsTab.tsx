// app/components/trips/trip-form/social/TripCommentsTab.tsx


// app/components/trips/trip-form/TripCommentsTab.tsx
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Comment } from '@/types/invitation';
import CommentItem from './CommentItem';

interface TripCommentsTabProps {
    isReadOnly?: boolean;
    comments: Comment[];
    onPostComment: (content: string) => Promise<Comment | null>;
}

const TripCommentsTab: React.FC<TripCommentsTabProps> = ({
    isReadOnly = false,
    comments,
    onPostComment,
}) => {
    const [newComment, setNewComment] = useState('');

    const handlePostComment = async () => {
        if (newComment.trim()) {
            await onPostComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="p-4 space-y-6">
            {!isReadOnly && (
                <div className="space-y-2">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="min-h-[100px]"
                        aria-label="New comment"
                    />
                    <Button
                        className="float-right"
                        aria-label="Post comment"
                        onClick={handlePostComment}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Post Comment
                    </Button>
                </div>
            )}

            <div className="space-y-4 clear-both pt-4">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default TripCommentsTab;