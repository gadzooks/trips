// app/components/trips/trip-form/social/TripInvitesTab.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { Invite, InviteStatus, InviteAccessLevel } from '@/types/invitation';
import InviteListItem from './InviteListItem';

interface TripInvitesTabProps {
    isOwner?: boolean;
    isReadOnly?: boolean;
    invitedBy?: string;
    invites: Invite[];
    onSendInvites: (emails: string[]) => Promise<void>;
    onUpdateInviteStatus: (email: string, newStatus: InviteStatus) => Promise<Invite | null>;
    onAccessLevelChange?: (email: string, newAccessLevel: InviteAccessLevel) => Promise<void>;
}

const TripInvitesTab: React.FC<TripInvitesTabProps> = ({
    isOwner = true,
    isReadOnly = false,
    invitedBy,
    invites,
    onSendInvites,
    onUpdateInviteStatus,
    onAccessLevelChange,
}) => {
    const [inviteEmails, setInviteEmails] = useState('');

    const handleSendInvites = async () => {
        if (inviteEmails.trim()) {
            const emailsArray = inviteEmails.split(',').map(email => email.trim());
            await onSendInvites(emailsArray);
            setInviteEmails(''); // Clear input after sending
        }
    };

    return (
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
                        <Button aria-label="Send invites" onClick={handleSendInvites}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Send Invites
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                        Separate multiple emails with commas
                    </p>
                </div>
            )}

            {isOwner ? (
                <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Invited People ({invites.length})
                    </h3>
                    <div className="space-y-2">
                        {invites.map((invite) => (
                            <InviteListItem
                                key={invite.email}
                                invite={invite}
                                isOwner={isOwner}
                                onStatusChange={onUpdateInviteStatus}
                                onAccessLevelChange={onAccessLevelChange}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    You were invited by <span className="font-medium text-gray-900 dark:text-gray-100">{invitedBy}</span>
                </p>
            )}
        </div>
    );
};

export default TripInvitesTab;
