// app/components/ui/input/EditableText.tsx
import React, { useState, useEffect, useRef } from 'react';
import { updateTripAttribute } from '../utils/updateTrip';
import MyTextComponent from './MyTextComponent';

export type EditableTextProps = {
    tripId?: string;
    SK?: string;
    name?: string;
    createdAt?: string;
    createdBy?: string;
    attributeKey: string;
    attributeValue: string;
    isReadyOnly: boolean;
    placeholder?: string;
    tabIndex?: number;
    onSave?: (value: string) => void;
    isTextArea?: boolean;
    tags?: string;
    className?: string;
};

export const EditableText = ({
    tripId,
    name,
    SK,
    createdAt,
    createdBy,
    attributeKey,
    attributeValue,
    isReadyOnly,
    tabIndex,
    onSave,
    isTextArea = false,
    tags,
    className = ""
}: EditableTextProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(attributeValue);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setEditValue(attributeValue);
    }, [attributeValue]);

    const handleSave = async () => {
        setIsEditing(false);
        tags = tags || '';
        name = name || '';
        createdAt = createdAt || '';
        createdBy = createdBy || '';
        if (editValue !== attributeValue) {
            if (tripId && SK) {
                const result = await updateTripAttribute(
                    { tripId, createdAt, createdBy, attributeKey, attributeValue: editValue, tags, name }
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
        <div
            onMouseDown={(e) => {
                if (e.target instanceof HTMLAnchorElement) return; // Ignore clicks on links
                handleFocus();
            }}
            onTouchStart={(e) => {
                if (e.target instanceof HTMLAnchorElement) return; // Ignore taps on links
                handleFocus();
            }}
        >
            <MyTextComponent
                editValue={editValue}
                isReadyOnly={isReadyOnly}
                tabIndex={tabIndex}
                handleFocus={handleFocus}
                className={className}
                spanRef={spanRef}
            />
        </div>
    );
    
};