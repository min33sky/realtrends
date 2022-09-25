import React from 'react';
import DesktopHeader from '../base/DesktopHeader';
import Footer from '../base/Footer';
import MobileHeader from '../base/MobileHeader';
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
      {header ?? (
        <>
          <MobileHeader />
          <DesktopHeader />
        </>
      )}

      <main className="flex flex-1 flex-col overflow-y-scroll pt-4 pl-4 pr-4">
        {children}
      </main>

      <Footer />
    </FullHeightPage>
  );
}
