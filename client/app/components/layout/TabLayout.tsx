import React from 'react';
import Footer from '../base/Footer';
import Header from '../base/Header';
import FullHeightPage from '../system/FullHeightPage';

interface Props {
  children?: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * Shows content with a header and a tab bar
 */
export default function TabLayout({ header, children }: Props) {
  return (
    <FullHeightPage>
      {header ?? <Header />}

      <main className="flex flex-1 flex-col overflow-y-scroll pt-4 pl-4 pr-4">
        {children}
      </main>

      <Footer />
    </FullHeightPage>
  );
}
