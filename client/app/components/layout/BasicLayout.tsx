import React from 'react';
import useGoBack from '~/hooks/useGoBack';
import Header from '../base/Header';
import HeaderBackButton from '../base/HeaderBackButton';
import FullHeightPage from '../system/FullHeightPage';

interface Props {
  hasBackButton?: boolean;
  title?: string;
  children: React.ReactNode;
}

export default function BasicLayout({ hasBackButton, title, children }: Props) {
  const goBack = useGoBack();

  return (
    <FullHeightPage>
      <Header
        title={title}
        headerLeft={
          hasBackButton ? <HeaderBackButton onClick={goBack} /> : undefined
        }
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </FullHeightPage>
  );
}
