import React from 'react';
import BasicLayout from '../layout/BasicLayout';
import Button from '../system/Button';

interface Props {
  onProceed: () => void;
}

/**
 * @deprecated ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ
 * @param param0
 * @returns
 */
export default function WriteLinkForm({ onProceed }: Props) {
  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <Button onClick={onProceed}>다음</Button>
    </BasicLayout>
  );
}
