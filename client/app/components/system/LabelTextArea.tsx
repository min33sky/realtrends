import React, { useState } from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const LabelTextArea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ label, onBlur, onFocus, className, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocus?.(e);
      setFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(e);
      setFocused(false);
    };

    return (
      <div className="flex flex-1 flex-col">
        <label
          htmlFor=""
          className={`mb-2 text-base font-semibold leading-normal ${
            focused ? 'text-purple-500' : 'text-gray-500'
          } `}
        >
          {label}
        </label>
        <textarea
          ref={ref}
          className={`flex-1 resize-none rounded border p-4 text-base leading-6 text-gray-800 outline-none transition ease-in-out
          placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-500
          ${focused ? 'border-purple-500' : 'border-gray-400'}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </div>
    );
  },
);

LabelTextArea.displayName = 'LabelTextArea';

export default LabelTextArea;
