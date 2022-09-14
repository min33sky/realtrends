import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import CommentInputOverlay from '~/components/items/CommentInputOverlay';
import CommentList from '~/components/items/CommentList';
import ItemViewer from '~/components/items/ItemViewer';
import BasicLayout from '~/components/layout/BasicLayout';
import { useDialog } from '~/contexts/DialogContext';
import { useUser } from '~/contexts/UserContext';
import { useCommentsQuery } from '~/hooks/query/useCommentsQuery';
import { deleteItem, getComments, getItem } from '~/lib/api/items';
import type { Comment, Item } from '~/lib/api/types';
import { useBottomSheetModalStore } from '~/stores/useBottomSheetModalStore';

export const loader: LoaderFunction = async ({ params }) => {
  /** @todo: validate itemId */
  const itemId = parseInt(params.itemId!, 10);

  const [item, comments] = await Promise.all([
    getItem(itemId),
    getComments(itemId),
  ]);

  return json({
    item,
    comments,
  });
};

interface ItemLoaderData {
  item: Item;
  comments: Comment[];
}

export default function ItemPage() {
  const loaderData = useLoaderData<ItemLoaderData>();
  const navigate = useNavigate();
  const user = useUser();
  const isMyItem = user?.id === loaderData.item.user.id;

  const { open: openBottomSheetModal } = useBottomSheetModalStore(); //? Item 수정 및 삭제를 위한 하단 Modal
  const { open: oepnDialog } = useDialog(); //? Item 삭제 여부를 묻을 Dialog

  const onClickMore = () => {
    openBottomSheetModal([
      {
        name: '수정',
        onClick() {
          // TODO
        },
      },
      {
        name: '삭제',
        onClick() {
          oepnDialog({
            mode: 'YESNO',
            title: '삭제하시겠습니까?',
            description: '삭제된 아이템은 복구할 수 없습니다.',
            confirmText: '삭제',
            cancelText: '취소',
            async onConfirm() {
              // TODO: show fullscreen spinner on loading
              await deleteItem(loaderData.item.id);
              navigate('/');
            },
          });
        },
      },
    ]);
  };

  const { data: comments } = useCommentsQuery(loaderData.item.id, {
    initialData: loaderData.comments,
  });

  return (
    <BasicLayout
      hasBackButton
      title={null}
      headerRight={
        isMyItem && (
          <EllipsisVerticalIcon
            onClick={onClickMore}
            className="h-6 w-6 cursor-pointer"
          />
        )
      }
    >
      <ItemViewer item={loaderData.item} />
      {/* 'comments' is always valid due to SSR */}
      <CommentList comments={comments!} />
      <CommentInputOverlay />
    </BasicLayout>
  );
}
