const express = require('express');
const cors = require('cors');

const curiosities = require('./data/curiosities.json');

const app = express();
const version = process.env.LANTERNE_API_VERSION || '1.0.0';
const environment = process.env.LANTERNE_ENV || 'development';
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '32kb' }));

function withApiPrefix(path) {
  return [path, `/api${path}`];
}

function normalizeLimit(value) {
  const limit = Number.parseInt(value, 10);
  if (!Number.isFinite(limit) || limit < 1) return 20;
  return Math.min(limit, 100);
}

function filterCuriosities(items, query, category) {
  const normalizedQuery = query.trim().toLocaleLowerCase('fr-FR');
  const normalizedCategory = category.trim().toLocaleLowerCase('fr-FR');

  return items.filter((item) => {
    const searchableText = [item.title, item.city, item.description, item.category]
      .join(' ')
      .toLocaleLowerCase('fr-FR');

    return (!normalizedQuery || searchableText.includes(normalizedQuery))
      && (!normalizedCategory || item.category.toLocaleLowerCase('fr-FR') === normalizedCategory);
  });
}

app.get(withApiPrefix('/health'), (_request, response) => {
  response.json({
    status: 'ok',
    environment,
    version,
  });
});

app.get(withApiPrefix('/curiosities'), (request, response) => {
  const query = String(request.query.q || '');
  const category = String(request.query.category || '');
  const limit = normalizeLimit(request.query.limit);
  const filtered = filterCuriosities(curiosities, query, category);

  response.json({
    data: filtered.slice(0, limit),
    meta: {
      count: filtered.length,
      limit,
      query,
      category,
    },
  });
});

app.get(withApiPrefix('/curiosities/:slug'), (request, response) => {
  const curiosity = curiosities.find((item) => item.slug === request.params.slug);
  if (!curiosity) {
    return response.status(404).json({ error: 'Curiosity not found' });
  }

  return response.json({ data: curiosity });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
  const port = Number.parseInt(process.env.PORT || '3000', 10);
  app.listen(port, () => console.log(`Lanterne API listening on port ${port}`));
}

module.exports = app;
