// Gitmyart — AI Chat Route (Groq + DB search)
const express = require('express');
const router = express.Router();
const { all, get } = require('../db');

const GROQ_KEY = process.env.GROQ_API_KEY || '';

function getPlatformContext() {
  const collections = all('SELECT name, ticker, chain, floor_price, total_staked, total_stakers, reward_per_day FROM collections WHERE active = 1');
  const topUsers = all('SELECT l.wallet, l.chain, l.nfts_staked, l.points, u.display_name FROM leaderboard l LEFT JOIN users u ON u.wallet = l.wallet ORDER BY l.points DESC LIMIT 10');
  const stats = {
    atom: get('SELECT COUNT(*) as staked FROM staked_nfts WHERE chain = ?', ['atom']),
    megaeth: get('SELECT COUNT(*) as staked FROM staked_nfts WHERE chain = ?', ['megaeth']),
    ethereum: get('SELECT COUNT(*) as staked FROM staked_nfts WHERE chain = ?', ['ethereum']),
  };
  const liveRaffles = all("SELECT name, token, price, max_entries, current_entries, ends_at FROM raffles WHERE status = 'live' LIMIT 10");

  return `
LIVE DATA FROM DATABASE:

Collections:
${collections.map(c => `- ${c.name} (${c.ticker}) on ${c.chain} | Floor: ${c.floor_price} | Staked: ${c.total_staked} | Stakers: ${c.total_stakers} | Reward: ${c.reward_per_day}/day`).join('\n')}

Top 10 Leaderboard:
${topUsers.map((u, i) => `${i+1}. ${u.display_name || u.wallet} (${u.chain}) — ${u.points} pts, ${u.nfts_staked} NFTs`).join('\n')}

Platform Stats:
- Cosmos: ${stats.atom?.staked || 0} NFTs staked
- MegaETH: ${stats.megaeth?.staked || 0} NFTs staked
- Ethereum: ${stats.ethereum?.staked || 0} NFTs staked

Live Raffles:
${liveRaffles.map(r => `- ${r.name} (${r.token}) — ${r.price} per entry, ${r.current_entries}/${r.max_entries} entries`).join('\n')}
`;
}

const SYSTEM_PROMPT = `You are Drop Assistant, a friendly AI for Gitmyart — a multi-chain NFT staking and raffle platform.

You can chat about ANYTHING — be natural, fun, helpful. Not limited to platform topics.
When users ask about collections, tokens, points, accounts, leaderboard, or raffles — use the LIVE DATA provided below to give accurate answers.
If someone searches for a collection name, token ticker, or user — find it in the data.
Answer in the same language the user writes in. Be warm, casual, use emoji. Keep answers concise.`;

const conversations = new Map();

router.post('/chat', async (req, res) => {
  if (!GROQ_KEY) return res.json({ reply: '' });

  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const sid = sessionId || 'default';
  if (!conversations.has(sid)) {
    conversations.set(sid, []);
  }
  const msgs = conversations.get(sid);
  msgs.push({ role: 'user', content: message });
  if (msgs.length > 20) msgs.splice(0, msgs.length - 20);

  // Build messages with fresh DB context
  const dbContext = getPlatformContext();
  const fullMsgs = [
    { role: 'system', content: SYSTEM_PROMPT + '\n\n' + dbContext },
    ...msgs,
  ];

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: fullMsgs,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await resp.json();
    if (data.error) {
      console.error('[AI]', data.error.message);
      return res.json({ reply: '' });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    if (reply) msgs.push({ role: 'assistant', content: reply });
    res.json({ reply });
  } catch (e) {
    console.error('[AI]', e.message);
    res.json({ reply: '' });
  }
});

module.exports = router;
