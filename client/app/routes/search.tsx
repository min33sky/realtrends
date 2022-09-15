import React, { useState } from 'react';
import Header from '~/components/base/Header';
import TabLayout from '~/components/layout/TabLayout';
import SearchInput from '~/components/search/SearchInput';
import { useDebounce } from 'use-debounce';

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [deboundcedSearchText] = useDebounce(searchText, 300);

  return (
    <TabLayout
      header={
        <Header
          title={
            <SearchInput value={searchText} onChangeText={setSearchText} />
          }
          titleFullWidth
        />
      }
    >
      {deboundcedSearchText}
    </TabLayout>
  );
}
