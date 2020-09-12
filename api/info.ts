import { NowRequest, NowResponse } from '@vercel/node';
import mdn from '../util/mdn';

export default async function search(req: NowRequest, res: NowResponse) {
  const { l } = req.query;
  if (!l) return res.status(400).json({ message: 'You need to pass the link query using the l parameter' });

  const data = await mdn.getInfo(l as string);
  if (!data) return res.status(400).json({ message: 'The link you inputted was not valid' });

  return res.json(data);
}
