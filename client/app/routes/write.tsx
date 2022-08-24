import React from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import { useProtectedRoute } from '~/hooks/useProtectedRoute';

export default function Write() {
  // const hasPermission = useProtectedRoute();
  // if (!hasPermission) {
  //   return null;
  // }

  return (
    <BasicLayout title="새 글 작성" hasBackButton>
      글 쓰는 곳
    </BasicLayout>
  );
}
