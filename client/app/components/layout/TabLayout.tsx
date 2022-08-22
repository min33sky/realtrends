import React from 'react';
import Footer from '../base/Footer';
import Header from '../base/Header';
import FullHeightPage from '../system/FullHeightPage';

interface Props {
  children: React.ReactNode;
}

export default function TabLayout({ children }: Props) {
  return (
    <FullHeightPage>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </FullHeightPage>
  );
}
