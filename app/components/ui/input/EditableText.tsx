// app/components/ui/input/EditableText.tsx
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Pencil } from 'lucide-react';
import { updateTripAttribute } from '../utils/updateTrip';
import MyTextComponent from './MyTextComponent';

export type EditableTextProps = {
    id: string;
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
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isTextArea?: boolean;
    tags?: string;
    className?: string;
};

export const EditableText = ({
    id,
    placeholder,
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
    onChange,
    isTextArea = false,
    tags,
    className = ""
}: EditableTextProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(attributeValue);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const touchStartY = useRef<number>(0);

    useEffect(() => {
        setEditValue(attributeValue);
    }, [attributeValue]);

    const handleSave = async () => {
        setIsEditing(false);
    
        if (editValue === attributeValue) return;
    
        if (tripId && SK) {
            // Ensure default values
            const result = await updateTripAttribute({
                tripId,
                createdAt: createdAt || '',
                createdBy: createdBy || '',
                attributeKey,
                attributeValue: editValue,
                tags: tags || '',
                name: name || ''
            });
    
            if (!result.success) {
                setEditValue(attributeValue);
                return;
            }
        }
    
        onSave?.(editValue);
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
            // // Use requestAnimationFrame to ensure the input is rendered before focusing
            // requestAnimationFrame(() => {
            //     if (inputRef.current) {
            //         inputRef.current.focus();
            //         // // Position cursor at the end of the text
            //         // const length = editValue.length;
            //         // if ('setSelectionRange' in inputRef.current) {
            //         //     inputRef.current.setSelectionRange(length, length);
            //         // }
            //     }
            // });
        }
    };

    useEffect(() => {
        if (isEditing && isTextArea && inputRef.current) {
            const el = inputRef.current as HTMLTextAreaElement;
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    }, [isEditing, isTextArea]);

    if (isEditing) {
        const InputComponent = isTextArea ? 'textarea' : 'input';
        const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setEditValue(e.target.value);
            onChange?.(e);
            if (isTextArea && e.target instanceof HTMLTextAreaElement) {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
            }
        };
        return (
            <InputComponent
                data-testid={`editable-input-${id}`}
                ref={inputRef as any}
                type={isTextArea ? undefined : "text"}
                name={attributeKey}
                value={editValue}
                onChange={handleChange}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                tabIndex={tabIndex}
                rows={isTextArea ? 3 : undefined}
                className={`w-full p-2 rounded-lg
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    bg-transparent text-gray-900 dark:text-gray-100
                    hover:bg-opacity-10 hover:bg-gray-500
                    dark:hover:bg-opacity-20 dark:hover:bg-gray-200
                    ${isTextArea ? 'overflow-hidden resize-none' : ''}
                    ${className}`}
            />
        );
    }

    return (
        <div
            className={isTextArea && !isReadyOnly ? 'relative' : undefined}
            onFocus={(e) => {
                if (e.target instanceof HTMLAnchorElement) return; // Ignore clicks on links
                handleFocus();
            }}
            onMouseDown={(e) => {
                if (e.target instanceof HTMLAnchorElement) return; // Ignore clicks on links
                handleFocus();
            }}
            onTouchStart={(e) => {
                if (e.target instanceof HTMLAnchorElement) return;
                touchStartY.current = e.touches[0].clientY;
            }}
            onTouchEnd={(e) => {
                if (e.target instanceof HTMLAnchorElement) return;
                const delta = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
                if (delta < 8) handleFocus();
            }}
        >
            {isTextArea && !isReadyOnly && (
                <button
                    type="button"
                    aria-label="Edit description"
                    onClick={handleFocus}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded sm:hidden"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            )}
            <MyTextComponent
                id={id}
                editValue={editValue}
                placeholder={placeholder}
                isReadyOnly={isReadyOnly}
                tabIndex={tabIndex}
                handleFocus={handleFocus}
                className={className}
                spanRef={spanRef}
            />
        </div>
    );
    
};