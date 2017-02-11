const mongoose = require('mongoose');

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
module.exports.addArt = (art, callback) => {
  Artwork.create(art, callback);
}
