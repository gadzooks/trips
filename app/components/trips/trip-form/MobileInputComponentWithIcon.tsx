import React, { useRef, useEffect, useState } from 'react';
import Linkify from 'react-linkify';

type InputWithIconProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  multiline?: boolean;
  rows?: number;
  isReadOnly?: boolean;
};

const InputWithIcon = ({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  isReadOnly
}: InputWithIconProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (multiline && textareaRef.current && isEditing) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, multiline, isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isReadOnly) {
      setIsEditing(true);
      // Let parent know about the click if they want to handle it
      onChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const componentDecorator = (href: string, text: string, key: number) => (
    <a
      href={href}
      key={key}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.confirm(`Do you want to visit ${href}?`)) {
          window.open(href, '_blank');
        }
      }}
      className="text-blue-500 hover:underline"
    >
      {text}
    </a>
  );

  const renderContent = () => {
    if (isEditing) {
      return multiline ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onBlur={handleBlur}
          autoFocus
          rows={rows}
          className="min-h-[4rem] resize-none p-2 pt-8 w-full bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-900 dark:text-gray-100 focus:outline-none"
        />
      ) : (
        <input
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onBlur={handleBlur}
          autoFocus
          className="px-2 py-1 pl-20 w-full bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-900 dark:text-gray-100 focus:outline-none"
        />
      );
    }

    // Calculate min-height based on rows when displaying content
    const minHeightStyle = multiline ? 
      { minHeight: `${Math.max(4, rows) * 1}rem` } : 
      {};

    return (
      <Linkify componentDecorator={componentDecorator}>
        <span
          onClick={handleClick}
          className={`block w-full ${multiline ? 'p-2 pt-8' : 'px-2 py-1 pl-20'}
            bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-900 dark:text-gray-100
            ${!isReadOnly && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          style={minHeightStyle}
        >
          {value || placeholder}
        </span>
      </Linkify>
    );
  };

  return (
    <div className="relative">
      <div className="absolute left-2 top-2 flex items-center gap-1 text-gray-400 dark:text-gray-500">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      {renderContent()}
    </div>
  );
};

export default InputWithIcon;