import algoliasearch from 'algoliasearch';

if (!process.env.ALGOLIA_APP_ID) {
  throw new Error('ALGOLIA_APP_ID is not defined');
}

if (!process.env.ALGOLIA_ADMIN_KEY) {
  throw new Error('ALGOLIA_ADMIN_KEY is not defined');
}

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY,
);

const index = client.initIndex('realtrends_items');

const algolia = {
  async search(query: string) {
    const result = await index.search(query);
    console.log('result: ', result);
    return result.hits;
  },
};

export default algolia;
