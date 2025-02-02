import React, { useState, useEffect } from 'react';
import { updateTripAttribute } from '../utils/updateTrip';

export const EditableText = ({
    tripId,
    SK,
    createdAt,
    attributeKey,
    attributeValue,
    isReadyOnly,
    tabIndex,
    onSave,
    isTextArea = false,
    className = ""
}: {
    tripId?: string;
    SK?: string;
    createdAt?: string;
    attributeKey: string;
    attributeValue: string;
    isReadyOnly: boolean;
    placeholder?: string;
    tabIndex?: number;
    onSave?: (value: string) => void;
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
        if (editValue !== attributeValue) {
            if (tripId && SK) {
                const result = await updateTripAttribute(
                    { tripId, SK, attributeKey, attributeValue: editValue }
                );
                if (!result.success) {
                    setEditValue(attributeValue);
                    return;
                }
            }
            onSave?.(editValue);
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
        // Add Enter key handling for non-editing mode
        if (e.key === 'Enter' && !isEditing && !isReadyOnly) {
            setIsEditing(true);
        }
    };

    if (isEditing) {
        const InputComponent = isTextArea ? 'textarea' : 'input';
        return (
            <InputComponent
                type={isTextArea ? undefined : "text"}
                name={attributeKey}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder={attributeValue}
                tabIndex={tabIndex}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
                autoFocus
            />
        );
    }

    return (
        <div
            onClick={() => !isReadyOnly && setIsEditing(true)}
            onKeyDown={handleKeyDown}
            tabIndex={isReadyOnly ? undefined : tabIndex}
            className={`${!isReadyOnly ? 'cursor-pointer hover:bg-gray-50' : ''} rounded-lg p-2 ${className} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
        >
            {editValue}
        </div>
    );
};