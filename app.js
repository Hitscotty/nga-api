const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const nga = require('./data/nga');
const config = require('./config.js');
const URI = config.DB.uri;
const app = express();

app.use(express.static('./views'));
app.use(logger('dev'));

//connect to database
Artwork = require('./models/artwork');
mongoose.connect(URI)
var db = mongoose.connection;

app.get('/onview', (req, res) => {
  Artwork.getArtWorks((err, data) => {
    if (err)
      throw err;
    res.json(data);
  })
})

app.listen(config.PORT, () => console.log("\nrunning on port " + config.PORT + " ...\n"));

// --------------------------- CLI TESTS ------------------------- //

process.argv.forEach((val, index, array) => {
  if (val == '--h')
    nga.help();
  if (val == '--e')
    nga.showEndpoints();
  if (val == '--v')
    nga.onView();
  }
);
