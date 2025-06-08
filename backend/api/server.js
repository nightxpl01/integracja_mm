const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const userWiki = require('./routes/userWiki');
const movieRoutes = require('./routes/movieRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const exportRoutes = require('./routes/exportRoutes');
const userMedia = require('./routes/userMedia');


const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api', userWiki);
app.use('/api', movieRoutes);
app.use('/api', seriesRoutes);
app.use('/api', exportRoutes);
const wikiRoutes = require('./routes/wiki');
app.use('/api', wikiRoutes);
app.use('/api', userMedia);


sequelize.sync().then(() => {
  app.listen(3000, () => console.log('API running on http://localhost:3000'));
});
