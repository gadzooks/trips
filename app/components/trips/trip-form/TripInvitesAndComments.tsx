// app/components/trips/trip-form/TripInvitesAndComments.tsx

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare, UserPlus, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import { EditableText } from '../../ui/input/EditableText';
import { TripRecordDTO } from '@/types/trip';

type InviteStatus = 'accepted' | 'pending' | 'declined';

interface Invite {
  email: string;
  status: InviteStatus;
  name: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  isNew: boolean;
}

interface TripInvitesAndCommentsProps {
  isOwner?: boolean;
  isReadOnly?: boolean;
  formData: Partial<TripRecordDTO>;
  handleAttributeUpdate: (key: keyof TripRecordDTO, value: TripRecordDTO[keyof TripRecordDTO]) => Promise<boolean>;
}

// Mock data for demonstration
const MOCK_INVITES: Invite[] = [
  { email: 'alice@example.com', status: 'accepted', name: 'Alice Smith' },
  { email: 'bob@example.com', status: 'pending', name: 'Bob Jones' },
  { email: 'carol@example.com', status: 'declined', name: 'Carol Wilson' },
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: 'Alice Smith',
    content: 'Looking forward to this trip! Should I bring hiking gear?',
    timestamp: '2024-04-04T10:00:00Z',
    isNew: true,
  },
  {
    id: 2,
    author: 'Bob Jones',
    content: 'I know a great restaurant near our destination.',
    timestamp: '2024-04-03T15:30:00Z',
    isNew: false,
  },
];

const TripInvitesAndComments: React.FC<TripInvitesAndCommentsProps> = ({ 
  isOwner = true, 
  isReadOnly = false,
  formData,
  handleAttributeUpdate
}) => {
  const [inviteEmails, setInviteEmails] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>('description');
  const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  
  const getStatusColor = (status: InviteStatus): string => {
    switch(status) {
      case 'accepted': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
    }
  };

  const handleTabClick = (value: string) => {
    if (activeTab === value) {
      setActiveTab(null); // Collapse tab if it's already active
    } else {
      setActiveTab(value); // Set as active tab
    }
  };

  const handleStatusChange = (email: string, newStatus: InviteStatus) => {
    // Update invite status
    const updatedInvites = invites.map(invite => 
      invite.email === email ? { ...invite, status: newStatus } : invite
    );
    setInvites(updatedInvites);
    
    // Add a comment about the status change
    const inviteName = invites.find(invite => invite.email === email)?.name || email;
    const newStatusComment: Comment = {
      id: Date.now(), // Use timestamp as a simple unique ID
      author: 'System',
      content: `${inviteName} has ${newStatus} the trip invitation.`,
      timestamp: new Date().toISOString(),
      isNew: true
    };
    
    setComments([newStatusComment, ...comments]);
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        author: 'You', // In a real app, this would be the current user's name
        content: newComment,
        timestamp: new Date().toISOString(),
        isNew: true
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    }
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
          <div className="space-y-2 p-4">
            <label
              htmlFor="tripDescription"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description*
            </label>
            <EditableText
              id="tripDescription"
              tripId={formData.tripId}
              SK={formData.SK}
              createdAt={formData.createdAt}
              createdBy={formData.createdBy}
              attributeKey="description"
              attributeValue={formData.description || ""}
              isReadyOnly={isReadOnly}
              onSave={(value: string) =>
                handleAttributeUpdate("description", value)
              }
              isTextArea={true}
              className="block w-full h-32 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter trip description"
              tabIndex={3}
            />
          </div>
        )}
      </TabsContent>

      <TabsContent value="invites">
        {activeTab === 'invites' && (
          <div className="p-4 space-y-6">
            {isOwner && !isReadOnly && (
              <div className="space-y-2">
                <label htmlFor="invite-emails" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Invite People
                </label>
                <div className="flex gap-2">
                  <Input
                    id="invite-emails"
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    placeholder="Enter email addresses (comma-separated)"
                    className="flex-1"
                    aria-label="Email addresses for invites"
                  />
                  <Button aria-label="Send invites">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Send Invites
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Separate multiple emails with commas
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Invited People ({invites.length})
              </h3>
              <div className="space-y-2">
                {invites.map((invite) => (
                  <div key={invite.email} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{invite.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invite.name}</p>
                        <p className="text-sm text-gray-500">{invite.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {invite.status === 'pending' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20"
                            aria-label="Accept invitation"
                            onClick={() => handleStatusChange(invite.email, 'accepted')}
                          >
                            <Check className="w-4 h-4 mr-1" /> Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20"
                            aria-label="Decline invitation"
                            onClick={() => handleStatusChange(invite.email, 'declined')}
                          >
                            <X className="w-4 h-4 mr-1" /> Decline
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(invite.status)}>
                            {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                          </Badge>
                          {/* Allow changing status even after initial decision */}
                          {invite.status === 'accepted' ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 ml-2"
                              aria-label="Change to declined"
                              onClick={() => handleStatusChange(invite.email, 'declined')}
                            >
                              <X className="w-4 h-4 mr-1" /> Decline Instead
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 ml-2"
                              aria-label="Change to accepted"
                              onClick={() => handleStatusChange(invite.email, 'accepted')}
                            >
                              <Check className="w-4 h-4 mr-1" /> Accept Instead
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="comments">
        {activeTab === 'comments' && (
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
                <div key={comment.id} className={`p-4 ${comment.author === 'System' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'} rounded-lg space-y-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
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
              ))}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TripInvitesAndComments;