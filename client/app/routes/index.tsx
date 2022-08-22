import Footer from '~/components/base/Footer';
import Header from '~/components/base/Header';
import FullHeightPage from '~/components/system/FullHeightPage';

export default function Index() {
  return (
    <FullHeightPage>
      <Header />
      <div className="flex-1">Content</div>
      <Footer />
    </FullHeightPage>
  );
}
