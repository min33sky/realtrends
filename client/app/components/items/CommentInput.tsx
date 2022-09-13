import { useUser } from '~/contexts/UserContext';
import useOpenLoginDialog from '~/hooks/useOpenLoginDialog';
import { useCommentInputStore } from '~/stores/useCommentInputStore';

export default function CommentInput() {
  const write = useCommentInputStore((store) => store.write);
  const user = useUser();
  const openLoginDialog = useOpenLoginDialog();

  const onClick = () => {
    if (!user) {
      openLoginDialog('comment');
      return;
    }

    write(); //? store의 visible이 true로 변경되면서 commentInputOVerlay가 보여진다.
  };

  return (
    <input
      type="text"
      className="flex h-12 w-full items-center rounded border border-gray-400 px-4 text-base outline-none"
      placeholder="댓글을 입력하세요"
      onClick={onClick}
    />
  );
}
