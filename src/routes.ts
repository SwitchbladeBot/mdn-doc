import { Router } from 'express';
import mdn from './util/mdn';

const routes = Router();

routes.get('/', (_, res) => res.json({ message: 'Available routes: /search and /info' }));

routes.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'You need to pass the search query using the q parameter' });

  const data = await mdn.search(q as string);
  if (!Array.isArray(data) || !data.length) return res.status(404).json({ message: 'Could not find anything' });

  return res.json(data);
});

routes.get('/info', async (req, res) => {
  const { l } = req.query;
  if (!l) return res.status(400).json({ message: 'You need to pass the link query using the l parameter' });

  const data = await mdn.getInfo(l as string);
  if (!data) return res.status(400).json({ message: 'The link you inputted was not valid' });

  return res.json(data);
});

export default routes;
