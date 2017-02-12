const mongoose = require('mongoose');
const _ = require('lodash');

let errDoc = (err, doc) => {
  if (err)
    throw err;
  }

let artSchema = mongoose.Schema({
  img: {
    type: String
  },
  title: {
    type: String
  },
  created: {
    type: String
  },
  medium: {
    type: String
  },
  dimensions: {
    type: String
  },
  credit: {
    type: String
  },
  accession: {
    type: String
  }
});

Artwork = module.exports = mongoose.model('Artwork', artSchema);

// --------------------------- Database queries ----------------------- //

// gets all art works in database
module.exports.getArtWorks = (callback, limit) => {
  Artwork.find(callback).limit(limit);
}

// insert a document into this database
module.exports.addArt = update => {
  let options = {
    upsert: true,
    'new': true
  }

  let insert = item => {
    Artwork.findOneAndUpdate(item, item, options, errDoc);
  }

  _.map(update, insert);
}
