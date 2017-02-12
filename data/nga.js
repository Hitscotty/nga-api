const mongoose = require('mongoose');
const async = require('async');
const xr = require('x-ray')();
const $ = require('jquery');
const fs = require('fs');
const Paginate = require('./paginate');

const config = require('../config.js');
const realMouse = require('nightmare-real-mouse');
const Nightmare = require('nightmare');
require('nightmare-real-mouse')(Nightmare);
nightmare = Nightmare(config.NIGHTMARE);

const URI = config.DB.uri;

module.exports = {
  // scrapes all image data on one page and updates to db
  scrapeImages: (html) => {
    xr(html, '#returns > li', [
      {
        img: 'dl.return-art > dd > a > img@src',
        title: 'dl.return-art > dt > a@html',
        created: 'dl.return-art > .created',
        medium: 'dl.return-art > .medium',
        dimensions: 'dl.return-art > .dimensions',
        credit: 'dl.return-art > .credit',
        accession: 'dl.return-art > .accession'
      }
    ])((err, res) => {
      if (err)
        throw err;
      Artwork.addArt(res);
    })
  },
  // takes a paginate object and scrapes until instance is false
  scrapeEach: (paginate) => {
    // condition
    let hasNext = () => paginate.next
    // action to execute in while loop
    let nightmareScrape = next => {
      nightmare.goto(paginate.url).wait(4000).evaluate(() => {
        return document.body.innerHTML
      }).then(result => {
        module.exports.scrapeImages(result);
        paginate.update();
        paginate.state();
        next();
      }).catch(error => {
        console.error('Search failed:', error);
      });
    }
    // debugging info
    let err = err => {
      if (err)
        throw err;
      console.log("finished!");
    }
    // while paginate hasNext execute nigthmareScrape
    async.whilst(hasNext, nightmareScrape, err);

    return nightmare;
  },
  // the onview endpoint
  onView: () => {
    nightmare.goto(config.NGA.recent)
    nightmare.wait(3000)
    nightmare.evaluate(() => {
      return [document.location.href, document.querySelector('span.results-span').innerHTML]
    }).then(([url, pgd]) => {
      module.exports.scrapeEach(new Paginate(url, pgd))
    }).catch(error => {
      console.error('Search failed:', error);
    });
  },
  // shows all available endpoints
  showEndpoints: () => {
    console.log("Available Endpoints: \n");
    Object.keys(config.NGA).forEach(point => console.log(point));
  }
}
