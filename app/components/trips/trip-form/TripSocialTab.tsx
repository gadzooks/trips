// app/components/trips/trip-form/TripSocialTab.tsx
import React, { useState, useEffect } from 'react';
import { TripRecordDTO } from '@/types/trip';
import { Comment, Invite, InviteAccessLevel, InviteStatus } from '@/types/invitation';
import { useSession } from 'next-auth/react';
import TripInvitesTab from './social/TripInvitesTab';
import TripCommentsTab from './social/TripCommentsTab';

const toComment = (raw: Record<string, unknown>, isNew = false): Comment => ({
  id: (raw.commentId as string) ?? String(Date.now()),
  author: (raw.userName as string) ?? 'Anonymous',
  content: raw.content as string,
  timestamp: raw.timestamp as string,
  isNew,
});

interface TripSocialTabProps {
  panel: 'invites' | 'comments';
  isReadOnly: boolean;
  formData: Partial<TripRecordDTO>;
  handleAttributeUpdate: (key: keyof TripRecordDTO, value: TripRecordDTO[keyof TripRecordDTO]) => Promise<boolean>;
}

const TripSocialTab: React.FC<TripSocialTabProps> = ({
  panel,
  isReadOnly,
  formData,
}) => {
  const { data: session } = useSession();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!formData.tripId) return;
    fetch(`/api/trips/${formData.tripId}/invites`)
      .then(r => r.ok ? r.json() : [])
      .then(setInvites)
      .catch(() => {});
  }, [formData.tripId]);

  useEffect(() => {
    if (!formData.tripId) return;
    const fetchComments = () =>
      fetch(`/api/trips/${formData.tripId}/comments`)
        .then(r => r.ok ? r.json() : [])
        .then((items: Record<string, unknown>[]) => {
          const fetched = items.map(c => toComment(c));
          setComments(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const newOnes = fetched.filter(c => !existingIds.has(c.id));
            return newOnes.length ? [...newOnes, ...prev] : prev;
          });
        })
        .catch(() => {});
    fetchComments();
    const id = setInterval(fetchComments, 30_000);
    return () => clearInterval(id);
  }, [formData.tripId]);

  const isOwner = formData.createdBy === session?.user?.email;
  const invitedBy = !isOwner
    ? invites.find(i => i.email === session?.user?.email)?.invitedBy
    : undefined;

  if (panel === 'invites') {
    return (
      <TripInvitesTab
        isOwner={isOwner}
        isReadOnly={isReadOnly}
        invitedBy={invitedBy}
        invites={invites}
        onSendInvites={async (emails: string[]) => {
          const response = await fetch(`/api/trips/${formData.tripId}/invites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emails }),
          });
          if (!response.ok) throw new Error('Failed to send invites');
          const newInvites: Invite[] = await response.json();
          setInvites(prev => {
            const existingEmails = new Set(prev.map(i => i.email));
            return [...prev, ...newInvites.filter(i => !existingEmails.has(i.email))];
          });
        }}
        onUpdateInviteStatus={async (email: string, status: InviteStatus) => {
          const response = await fetch(
            `/api/trips/${formData.tripId}/invites/${encodeURIComponent(email)}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            }
          );
          if (!response.ok) throw new Error('Failed to update invite status');
          const updatedInvite: Invite = await response.json();
          setInvites(prev => prev.map(i => i.email === email ? updatedInvite : i));
          return updatedInvite;
        }}
        onAccessLevelChange={async (email: string, accessLevel: InviteAccessLevel) => {
          const response = await fetch(
            `/api/trips/${formData.tripId}/invites/${encodeURIComponent(email)}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessLevel }),
            }
          );
          if (!response.ok) throw new Error('Failed to update access level');
          const updatedInvite: Invite = await response.json();
          setInvites(prev => prev.map(i => i.email === email ? updatedInvite : i));
        }}
      />
    );
  }

  return (
    <TripCommentsTab
      isReadOnly={isReadOnly}
      comments={comments}
      onPostComment={async (content: string) => {
        const response = await fetch(`/api/trips/${formData.tripId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to post comment');
        const newComment = toComment(await response.json(), true);
        setComments(prev => [newComment, ...prev]);
        return newComment;
      }}
    />
  );
};

export default TripSocialTab;
