import { useLocation, useNavigate } from '@remix-run/react';
import { useCallback } from 'react';
import { useDialog } from '~/contexts/DialogContext';

const descriptionMap = {
  like: '이 글이 마음에 드시나요? 이 글을 다른 사람들에게도 추천하기 위해서 로그인을 해주세요.',
};

export default function useOpenLoginDialog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useDialog();

  const openLoginDialog = useCallback(
    (type: keyof typeof descriptionMap) => {
      const description = descriptionMap[type];
      open({
        title: '로그인이 필요합니다',
        description,
        onConfirm: () => navigate(`/auth/login?next=${location.pathname}`),
      });
    },
    [location, navigate, open],
  );

  return openLoginDialog;
}
