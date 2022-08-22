import React, { useCallback, useState } from 'react';
import type { Props as InputProps } from './Input';
import Input from './Input';

interface Props extends InputProps {
  label: string;
}

export default function LabelInput({ label, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(e);
      setFocused(true);
    },
    [onFocus],
  );
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      setFocused(false);
    },
    [onBlur],
  );

  return (
    <div className="group peer flex flex-col">
      <label
        htmlFor=""
        className={`mb-2 text-base font-semibold leading-normal ${
          focused ? 'text-purple-500' : 'text-gray-500'
        } `}
      >
        {label}
      </label>
      <Input onFocus={handleFocus} onBlur={handleBlur} {...rest} />
    </div>
  );
}
