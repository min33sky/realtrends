export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export default function Input({ errorMessage, ...rest }: Props) {
  return (
    <>
      <input
        className="h-12 rounded border border-gray-400 px-4 text-base outline-none placeholder:text-gray-400
        focus:border-purple-500 disabled:bg-gray-200"
        {...rest}
      />
      {errorMessage && (
        <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
      )}
    </>
  );
}
