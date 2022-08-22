import { useLocation } from '@remix-run/react';
import { useMemo } from 'react';
import FooterTapItem from './FooterTapItem';

const paths = ['search', 'bookmark', 'setting'] as const;

function isValidPath(path: any): path is typeof paths[number] {
  return paths.includes(path);
}

export default function Footer() {
  const location = useLocation();

  const currentPage = useMemo(() => {
    const path = location.pathname.split('/')[1];
    if (isValidPath(path)) {
      return path;
    }
    return 'home';
  }, [location.pathname]);

  return (
    <footer className="flex h-14 border-t border-gray-400">
      <FooterTapItem icon="home" isActive={currentPage === 'home'} to="/" />
      <FooterTapItem
        icon="search"
        isActive={currentPage === 'search'}
        to="/search"
      />
      <FooterTapItem icon="plus" />
      <FooterTapItem
        icon="bookmark"
        isActive={currentPage === 'bookmark'}
        to="/bookmark"
      />
      <FooterTapItem
        icon="setting"
        isActive={currentPage === 'setting'}
        to="/setting"
      />
    </footer>
  );
}
