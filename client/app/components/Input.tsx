export interface Props extends React.HTMLAttributes<HTMLInputElement> {}

export default function Input(props: Props) {
  return (
    <input
      className="h-12 rounded border border-gray-400 px-4 text-base outline-none focus:border-purple-500"
      {...props}
    />
  );
}
