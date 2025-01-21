// app/components/ui/input/EditableText.tsx
import React, { useState, useEffect } from 'react';
import { updateTripAttribute } from '../utils/updateTrip';

export const EditableText = ({
    tripId,
    SK,
    createdAt,
    attributeKey,
    attributeValue,
    isReadyOnly,
    isTextArea = false,
    className = ""
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

    useEffect(() => {
        setEditValue(attributeValue);
    }, [attributeValue]);

    const handleSave = async () => {
        setIsEditing(false);
        if (!isReadyOnly && tripId && SK && editValue !== attributeValue) {
            const result = await updateTripAttribute(
                { tripId, SK, attributeKey, attributeValue: editValue }
            );
            if (!result.success) {
                console.error(`Failed to update ${attributeKey}:`, result.error);
                setEditValue(attributeValue); // Revert on failure
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
        const InputComponent = isTextArea ? 'textarea' : 'input';
        return (
            <InputComponent
                type={isTextArea ? undefined : "text"}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
                autoFocus
            />
        );
    }

    return (
        <div
            onClick={() => !isReadyOnly && setIsEditing(true)}
            className={`${!isReadyOnly ? 'cursor-pointer hover:bg-gray-50' : ''} rounded-lg p-2 ${className}`}
        >
            {editValue}
        </div>
    );
};