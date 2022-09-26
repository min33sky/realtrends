import React from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import AccountSetting from '~/components/setting/AccountSetting';

export default function AccountPage() {
  return (
    <BasicLayout title="내 계정" hasBackButton>
      <AccountSetting />
    </BasicLayout>
  );
}
