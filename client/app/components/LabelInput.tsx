import { useCallback, useState } from 'react';
import type { Props as InputProps } from './Input';
import Input from './Input';

interface Props extends InputProps {
  label: string;
}

export default function LabelInput({ label, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

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
      <Input onFocus={onFocus} onBlur={onBlur} {...rest} />
    </div>
  );
}
