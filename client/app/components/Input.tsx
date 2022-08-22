import { forwardRef } from 'react';

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ errorMessage, ...rest }: Props, ref) => {
    return (
      <>
        <input
          className="h-12 rounded border border-gray-400 px-4 text-base outline-none placeholder:text-gray-400
        focus:border-purple-500 disabled:bg-gray-200"
          {...rest}
        />
        {errorMessage && (
          <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
        )}
      </>
    );
  },
);

Input.displayName = 'Input';

export default Input;
