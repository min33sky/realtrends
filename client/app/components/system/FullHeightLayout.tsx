interface Props {
  children: React.ReactNode;
}

export default function FullHeightLayout({ children }: Props) {
  return <div className="flex h-screen flex-col">{children}</div>;
}
