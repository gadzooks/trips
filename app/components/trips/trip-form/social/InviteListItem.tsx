// app/components/trips/trip-form/social/InviteListItem.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { Invite, InviteStatus } from '@/types/invitation';

interface InviteListItemProps {
    invite: Invite;
    onStatusChange: (email: string, newStatus: InviteStatus) => Promise<Invite | null>;
}

const InviteListItem: React.FC<InviteListItemProps> = ({ invite, onStatusChange }) => {
    const getStatusColor = (status: InviteStatus): string => {
        switch (status) {
            case InviteStatus.ACCEPTED: return 'bg-green-500';
            case InviteStatus.DECLINED: return 'bg-red-500';
            case InviteStatus.PENDING: return 'bg-yellow-500';
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
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
                            onClick={() => onStatusChange(invite.email, InviteStatus.ACCEPTED)}
                        >
                            <Check className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20"
                            aria-label="Decline invitation"
                            onClick={() => onStatusChange(invite.email, InviteStatus.DECLINED)}
                        >
                            <X className="w-4 h-4 mr-1" /> Decline
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(invite.status)}>
                            {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </Badge>
                        {invite.status === 'accepted' ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 ml-2"
                                aria-label="Change to declined"
                                onClick={() => onStatusChange(invite.email, InviteStatus.DECLINED)}
                            >
                                <X className="w-4 h-4 mr-1" /> Decline Instead
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 ml-2"
                                aria-label="Change to accepted"
                                onClick={() => onStatusChange(invite.email, InviteStatus.ACCEPTED)}
                            >
                                <Check className="w-4 h-4 mr-1" /> Accept Instead
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InviteListItem;