// app/components/ui/input/MyTextComponent.tsx
import React from 'react';
import Linkify from 'react-linkify';
import { EditableTextProps } from './EditableText';

type MyTextComponentProps = EditableTextProps & {
  id: string;
  spanRef: React.RefObject<HTMLSpanElement>;
  editValue: string;
  handleFocus: () => void;
};

const MyTextComponent = ({
  id,
  editValue,
  isReadyOnly,
  tabIndex,
  placeholder,
  handleFocus,
  className = '',
  spanRef,
}: Partial<MyTextComponentProps>) => {

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>, url: string) => {
    event.preventDefault(); // Prevent default opening behavior
    event.stopPropagation(); // Stop event from bubbling to EditableText

    const userChoice = window.confirm(`Do you want to open this link?\n${url}`);
    if (userChoice) {
      window.location.href = url;
    }
};

return (
    <span
        data-testid={`readonly-span-${id}`}
        ref={spanRef}
        role={isReadyOnly ? 'readonly' : 'textbox'}
        tabIndex={isReadyOnly ? undefined : tabIndex}
        onClick={!isReadyOnly ? handleFocus : undefined}
        className={`
            ${!isReadyOnly ? 'cursor-text hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
            inline-block w-full whitespace-pre-wrap rounded-lg p-2
            ${className} focus:ring-2 focus:ring-purple-500 focus:outline-none
        `}
    >
        <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
                <a
                    key={key}
                    href={decoratedHref}
                    className="text-blue-500 dark:text-blue-400 underline"
                    onClick={(event) => handleLinkClick(event, decoratedHref)}
                    onTouchStart={(event) => handleLinkClick(event, decoratedHref)}
                >
                    {decoratedText}
                </a>
            )}
        >
            {editValue || placeholder}
        </Linkify>
    </span>
);

};


export default MyTextComponent;
