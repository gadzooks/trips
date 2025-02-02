import React, { useState, useEffect, useRef } from 'react';
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
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

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
    };

    const handleFocus = () => {
        if (!isReadyOnly) {
            setIsEditing(true);
            // Use requestAnimationFrame to ensure the input is rendered before focusing
            requestAnimationFrame(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    // Position cursor at the end of the text
                    const length = editValue.length;
                    if ('setSelectionRange' in inputRef.current) {
                        inputRef.current.setSelectionRange(length, length);
                    }
                }
            });
        }
    };

    if (isEditing) {
        const InputComponent = isTextArea ? 'textarea' : 'input';
        return (
            <InputComponent
                ref={inputRef as any}
                type={isTextArea ? undefined : "text"}
                name={attributeKey}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder={attributeValue}
                tabIndex={tabIndex}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
            />
        );
    }

    return (
        <span
            ref={spanRef}
            role="textbox"
            tabIndex={isReadyOnly ? undefined : tabIndex}
            onFocus={handleFocus}
            onClick={handleFocus}
            className={`${!isReadyOnly ? 'cursor-text hover:bg-gray-50' : ''} inline-block w-full rounded-lg p-2 ${className} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
        >
            {editValue}
        </span>
    );
};