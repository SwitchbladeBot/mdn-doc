import { NowRequest, NowResponse } from '@vercel/node';
import mdn from '../util/mdn';

export default async function search(req: NowRequest, res: NowResponse) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'You need to pass the search query using the q parameter' });

  const data = await mdn.search(q as string);
  if (!Array.isArray(data) || !data.length) return res.status(404).json({ message: 'Could not find anything' });

  return res.json(data);
}
