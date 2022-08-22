import Footer from '~/components/base/Footer';
import Header from '~/components/base/Header';
import FullHeightLayout from '~/components/system/FullHeightLayout';

export default function Index() {
  return (
    <FullHeightLayout>
      <Header />
      <div className="flex-1">Content</div>
      <Footer />
    </FullHeightLayout>
  );
}
