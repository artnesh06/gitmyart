const { get } = require('./server/db');

const result = get('SELECT id FROM staked_nfts WHERE wallet = ? AND token_id = ? AND collection_id = ? ORDER BY staked_at DESC LIMIT 1',
  ['0xtest123', '999', 'col-atom-1']);

console.log('Result:', result);
console.log('ID:', result?.id);
