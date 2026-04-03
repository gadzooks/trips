// app/components/trips/trip-form/CompactTripView.tsx
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { TripRecordDTO } from '@/types/trip';
import { EditableText } from '../../ui/input/EditableText';
import { Plane } from 'lucide-react';
import TripInvitesAndComments from './TripInvitesAndComments';
import { Invite } from '@/types/invitation';
import { useSession } from "next-auth/react"


interface CompactTripViewProps {
  isReadOnly: boolean;
  formData: Partial<TripRecordDTO>;
  handleAttributeUpdate: (key: keyof TripRecordDTO, value: TripRecordDTO[keyof TripRecordDTO]) => Promise<boolean>;
}

const CompactTripView: React.FC<CompactTripViewProps> = ({
  isReadOnly,
  formData,
  handleAttributeUpdate,
}) => {
  const tags = Array.isArray(formData.tags)
    ? formData.tags
    : (formData.tags || "").split(" ").filter(Boolean);

  const { data: session } = useSession();

  return (
    <>
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Plane className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {formData.name}
            </h1>
          </div>

          <div className="flex justify-evenly space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              {!isReadOnly && (
                <label
                  htmlFor="tripTags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Edit Tags
                </label>
              )}
              <EditableText
                id="tripTags"
                tripId={formData.tripId}
                SK={formData.SK}
                createdAt={formData.createdAt}
                createdBy={formData.createdBy}
                attributeValue={
                  Array.isArray(formData.tags)
                    ? formData.tags.join(" ")
                    : formData.tags || ""
                }
                attributeKey="tags"
                isReadyOnly={isReadOnly}
                onSave={(value: string) =>
                  handleAttributeUpdate(
                    "tags",
                    value.split(" ").filter(Boolean)
                  )
                }
                className="block w-full h-12 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter tags separated by spaces"
                tabIndex={2}
              />
            </div>

            {!isReadOnly && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    handleAttributeUpdate("isPublic", checked)
                  }
                  className="bg-red-400 data-[state=checked]:bg-green-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formData.isPublic ? "Public" : "Private"} Trip
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <TripInvitesAndComments
        isOwner={formData.createdBy === session?.user?.email}
        isReadOnly={isReadOnly}
        formData={formData}
        handleAttributeUpdate={handleAttributeUpdate}
        initialComments={[]}
        initialInvites={[]}
        onSendInvites={async (emails: string[]) => {
          try {
            const response = await fetch(
              `/api/trips/${formData.tripId}/invites`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ emails }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to send invites");
            }

            const newInvites = await response.json();
            console.log("Successfully sent invites to:", emails);
            return newInvites;
          } catch (error) {
            console.error("Error sending invites:", error);
            throw error;
          }
        }}
        onUpdateInviteStatus={async (inviteId: string, status: string) => {
          try {
            const response = await fetch(
              `/api/trips/${formData.tripId}/invites/${inviteId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to update invite status");
            }

            const updatedInvite = await response.json();
            console.log(`Updated invite ${inviteId} status to:`, status);
            return updatedInvite as Invite;
          } catch (error) {
            console.error("Error updating invite status:", error);
            throw error;
          }
        }}
        onPostComment={async (comment: string) => {
          try {
            const response = await fetch(
              `/api/trips/${formData.tripId}/comments`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: comment }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to post comment");
            }

            const newComment = await response.json();
            console.log("Successfully posted comment:", comment);
            return newComment;
          } catch (error) {
            console.error("Error posting comment:", error);
            throw error;
          }
        }}
      />
    </>
  );
};

export default CompactTripView;