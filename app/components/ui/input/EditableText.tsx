// app/components/ui/input/EditableText.tsx
"use client";
import React, { useState } from 'react';
import { updateTripAttribute } from '../utils/updateTrip';

// Editable Text Component for inline editing
export const EditableText = ({
    tripId, SK, createdAt, attributeKey, attributeValue, isReadyOnly, isTextArea = false, className = ""
}: {
    tripId?: string;
    SK?: string;
    createdAt?: string;
    attributeKey: string;
    attributeValue: string;
    isReadyOnly: boolean;
    isTextArea?: boolean;
    className?: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(attributeValue);

    const handleSave = async () => {
        setIsEditing(false);
        console.log('handlesave : tripId is : ', tripId)
        if (!isReadyOnly && tripId && SK && editValue !== attributeValue ) {
            const result = await updateTripAttribute(
                { tripId, SK, attributeKey, attributeValue: editValue }
            );
            if (!result.success) {
                console.error(`Failed to update ${attributeKey}:`, result.error);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            setEditValue(attributeValue);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        if (isTextArea) {
            return (
                <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
                    autoFocus />
            );
        }
        return (
            <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
                autoFocus />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer hover:bg-gray-50 rounded-lg p-2 ${className}`}
        >
            {attributeValue}
        </div>
    );
};
