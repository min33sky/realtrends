import React, { forwardRef, useCallback, useState } from 'react';
import type { Props as InputProps } from './Input';
import Input from './Input';

interface Props extends InputProps {
  label: string;
}

const LabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, onFocus, onBlur, ...rest }: Props, ref) => {
    const [focused, setFocused] = useState(false);

    // ? onFocus?.(e), onBlur?.(e)
    // Input의 Props에 onFocus, onBlur를 설정하고 ...rest로 onFocus, onBlur가 넘어가면
    // ...rest로 넘어간 onFocus, onBlur는 무시된다.
    // Props의 handler에 onFocus, onBlur를 넣어서 호출하는 방식으로 구현하면 된다.

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
        <Input ref={ref} onFocus={handleFocus} onBlur={handleBlur} {...rest} />
      </div>
    );
  },
);

LabelInput.displayName = 'LabelInput';

export default LabelInput;
