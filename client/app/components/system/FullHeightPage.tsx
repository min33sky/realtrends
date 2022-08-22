interface Props {
  children: React.ReactNode;
}

export default function FullHeightPage({ children }: Props) {
  return <div className="flex h-screen flex-col">{children}</div>;
}
