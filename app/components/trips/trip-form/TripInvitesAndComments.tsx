// app/components/trips/trip-form/TripInvitesAndComments.tsx
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronUp, ChevronDown, Badge } from 'lucide-react';
import { TripRecordDTO } from '@/types/trip';
import { Invite, InviteStatus } from '@/types/invitation';
import { Comment } from '@/types/invitation';
import TripCommentsTab from './social/TripCommentsTab';
import TripDescriptionTab from './social/TripDescriptionTab';
import TripInvitesTab from './social/TripInvitesTab';

interface TripInvitesAndCommentsProps {
    isOwner?: boolean;
    isReadOnly?: boolean;
    formData: Partial<TripRecordDTO>;
    handleAttributeUpdate: (key: keyof TripRecordDTO, value: TripRecordDTO[keyof TripRecordDTO]) => Promise<boolean>;
    // In a real app, you'd likely have handlers for sending invites and posting comments here
    onSendInvites: (emails: string[]) => Promise<void>;
    onPostComment: (content: string) => Promise<Comment | null>;
    onUpdateInviteStatus: (email: string, status: InviteStatus) => Promise<Invite | null>;
    initialInvites: Invite[]; // Pass real data
    initialComments: Comment[]; // Pass real data
}

const TripInvitesAndComments: React.FC<TripInvitesAndCommentsProps> = ({
    isOwner = true,
    isReadOnly = false,
    formData,
    handleAttributeUpdate,
    onSendInvites,
    onPostComment,
    onUpdateInviteStatus,
    initialInvites,
    initialComments,
}) => {
    const [activeTab, setActiveTab] = useState<string | null>('description');
    const [invites, setInvites] = useState<Invite[]>(initialInvites);
    const [comments, setComments] = useState<Comment[]>(initialComments);

    const handleTabClick = (value: string) => {
        setActiveTab(activeTab === value ? null : value);
    };

    const handleLocalStatusChange = async (email: string, newStatus: InviteStatus): Promise<Invite | null> => {
        const updatedInvite = await onUpdateInviteStatus(email, newStatus);
        if (updatedInvite) {
            setInvites(prevInvites =>
                prevInvites.map(invite =>
                    invite.email === email ? updatedInvite : invite
                )
            );
            // In a real app, you might fetch updated comments or add a local comment
            const inviteName = updatedInvite.name || email;
            const newStatusComment: Comment = {
                id: Date.now(),
                author: 'System',
                content: `${inviteName} has ${newStatus} the trip invitation.`,
                timestamp: new Date().toISOString(),
                isNew: true,
            };
            setComments([newStatusComment, ...comments]);
            return updatedInvite;
        }
        return null;
    };

    const handleLocalPostComment = async (content: string): Promise<Comment | null> => {
        const newComment = await onPostComment(content);
        if (newComment) {
            setComments([newComment, ...comments]);
        }
        return newComment;
    };

    return (
        <Tabs value={activeTab || ""} className="w-full">
            <TabsList className="w-full border-b">
                <TabsTrigger
                    value="description"
                    onClick={() => handleTabClick('description')}
                    className={`relative ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : ''}`}
                >
                    Description
                    {activeTab === 'description' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                </TabsTrigger>
                <TabsTrigger
                    value="invites"
                    onClick={() => handleTabClick('invites')}
                    className={`relative ${activeTab === 'invites' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : ''}`}
                >
                    Invites
                    {isOwner && <Badge className="ml-2 bg-blue-500">{invites.filter(i => i.status === 'pending').length}</Badge>}
                    {activeTab === 'invites' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                </TabsTrigger>
                <TabsTrigger
                    value="comments"
                    onClick={() => handleTabClick('comments')}
                    className={`relative ${activeTab === 'comments' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : ''}`}
                >
                    Comments
                    {isOwner && <Badge className="ml-2 bg-blue-500">{comments.filter(c => c.isNew).length}</Badge>}
                    {activeTab === 'comments' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
                {activeTab === 'description' && (
                    <TripDescriptionTab
                        isReadOnly={isReadOnly}
                        formData={formData}
                        handleAttributeUpdate={handleAttributeUpdate}
                    />
                )}
            </TabsContent>

            <TabsContent value="invites">
                {activeTab === 'invites' && (
                    <TripInvitesTab
                        isOwner={isOwner}
                        isReadOnly={isReadOnly}
                        invites={invites}
                        onSendInvites={onSendInvites}
                        onUpdateInviteStatus={handleLocalStatusChange}
                    />
                )}
            </TabsContent>

            <TabsContent value="comments">
                {activeTab === 'comments' && (
                    <TripCommentsTab
                        isReadOnly={isReadOnly}
                        comments={comments}
                        onPostComment={handleLocalPostComment}
                    />
                )}
            </TabsContent>
        </Tabs>
    );
};

export default TripInvitesAndComments;