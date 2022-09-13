import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useCreateCommentMutation from '~/hooks/mutation/useCreateCommentMutation';
import { useCommentsQuery } from '~/hooks/query/useCommentsQuery';
import useItemId from '~/hooks/useItemId';
import type { Comment } from '~/lib/api/types';
import Button from '../system/Button';
import Overlay from '../system/Overlay';
import produce from 'immer';
import { useCommentInputStore } from '~/stores/useCommentInputStore';
import { useDialog } from '~/contexts/DialogContext';
import { editComment } from '~/lib/api/items';

/**
 * 댓글 Input, 대댓글 버튼을 눌렀을 때 나오는 댓글 입력 오버레이
 */
export default function CommentInputOverlay() {
  const { visible, close, parentCommentId, commentId, defaultText } =
    useCommentInputStore();
  const { open } = useDialog();
  const [text, setText] = useState('');
  const itemId = useItemId(); // 현재 글의 ID
  const queryClient = useQueryClient();

  /**
   * 입력 한 댓글로 스크롤을 이동시키는 함수
   * @param commentId 댓글의 ID
   */
  const scrollToCommentId = (commentId: number) => {
    const comment = document.body.querySelector<HTMLDivElement>(
      `[data-comment-id="${commentId}"]`,
    );
    if (!comment) return;
    comment.scrollIntoView({ behavior: 'smooth' });
  };

  const { mutate: write, isLoading: isLoadingWrite } = useCreateCommentMutation(
    {
      onSuccess: (data) => {
        if (!itemId) return;

        //? 새로운 댓글에 대해서 캐시 업데이트
        queryClient.setQueryData(
          useCommentsQuery.extractKey(itemId),
          (prevComments: Comment[] | undefined) => {
            if (!prevComments) return;
            if (parentCommentId) {
              //* 대댓글인 경우
              return produce(prevComments, (draft) => {
                const rootComment =
                  draft.find((comment) => comment.id === parentCommentId) ?? //? 루트 댓글중에서 찾기
                  draft.find((comment) =>
                    comment.subcomments?.find(
                      (subcomment) => subcomment.id === parentCommentId,
                    ),
                  ); //? 대댓글중에서 부모댓글 ID가 있다면 대댓글이 존재하는 댓글이 루트댓글이다.

                rootComment?.subcomments?.push(data);
              });
            } else {
              //* 일반 댓글인 경우
              return [...prevComments, data];
            }
          },
        );

        //? 새로운 댓글로 스크롤 이동
        setTimeout(() => {
          scrollToCommentId(data.id);
        }, 0);

        close();
      },

      onError(error, variables, context) {
        open({
          title: '오류',
          description: '댓글 작성 실패',
        });
      },
    },
  );

  const { mutate: edit, isLoading: isLoadingEdit } = useMutation(editComment, {
    onSuccess: (data) => {
      if (!itemId) return;
      //? 이전 쿼리 무효화
      queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
      close();
    },
    onError(error, variables, context) {
      open({
        title: '오류',
        description: '댓글 수정 실패',
      });
    },
  });

  useEffect(() => {
    if (visible) {
      setText('');
    }
  }, [visible]);

  const onClick = () => {
    if (!itemId) return;

    if (text.length === 0) {
      open({
        title: '오류',
        description: '댓글을 입력하지 않으셨습니다.',
      });
      return;
    }

    // 수정모드일 경우
    if (commentId) {
      edit({
        commentId,
        itemId,
        text,
      });
      return;
    }

    // 새로운 댓글 작성
    write({ parentCommentId: parentCommentId ?? undefined, itemId, text });
  };

  useEffect(() => {
    if (defaultText !== '') {
      setText(defaultText);
    }
  }, [defaultText]);

  const buttonText = commentId ? '수정' : '작성';
  const isLoading = isLoadingEdit || isLoadingWrite;

  return (
    <>
      <Overlay visible={visible} onClose={close} />
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{ damping: 0 }}
            className="fixed bottom-0 flex h-12 w-full bg-white"
          >
            <input
              autoFocus
              className="h-full flex-1 pl-4 outline-none"
              placeholder="댓글을 입력하세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={onClick} disabled={isLoading} variant="secondary">
              {buttonText}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
