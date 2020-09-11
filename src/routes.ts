import { Router } from 'express';
import mdn from './util/mdn';

const routes = Router();

routes.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'You need to pass the search query using the q parameter' });

  const data = await mdn.search(q as string);
  if (!data || (Array.isArray(data) && !data.length)) return res.status(404).json({ message: 'Could not find anything' });

  return res.json(data);
});

export default routes;
