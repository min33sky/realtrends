import FooterTapItem from './FooterTapItem';

export default function Footer() {
  return (
    <footer className="flex h-14 border-t border-gray-400 xs:hidden">
      <FooterTapItem icon="home" to="/" />
      <FooterTapItem icon="search" to="/search" />
      <FooterTapItem icon="plus" to="/write" />
      <FooterTapItem icon="bookmark" to="/bookmarks" />
      <FooterTapItem icon="setting" to="/setting" />
    </footer>
  );
}
