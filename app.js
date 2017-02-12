const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const async = require('async');
const _ = require('lodash');
const xr = require('x-ray')();
const $ = require('jquery');
const fs = require('fs');

const config = require('./config.js');
const realMouse = require('nightmare-real-mouse');
const Nightmare = require('nightmare');
require('nightmare-real-mouse')(Nightmare);
nightmare = Nightmare(config.NIGHTMARE);

const URL = config.NGA.root;
const URI = config.DB.uri;

// --------------------------- App/Express ----------------------- //
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

// --------------------------- Utility Functions ------------------ //

function Paginate(url, pgd) {

  this.url = url;
  this.array = pgd.split(" ");

  this.currentPage = Number(this.array[0]);
  this.totalItems = Number(_.join(_.filter(this.array[4], char => char != ","), ''));
  this.itemsPerPage = Number(this.array[2]);
  this.totalPages = Math.floor(this.totalItems / this.itemsPerPage)
  this.next = true;

  this.update = () => {
    let chunks = url.split("&").filter(segment => !segment.includes('Number='));

    this.currentPage += 1;
    if (this.currentPage >= this.totalPages)
      this.next = false;

    this.url = _.join(chunks, "") + '&pageNumber=' + this.currentPage;
  }

  this.state = () => {
    console.log("-------- Pagination ----------")
    console.log("current page: " + this.currentPage);
    console.log("total pages: " + this.totalPages);
    console.log("total items: " + this.totalItems);
    console.log("items per page: " + this.itemsPerPage);
    console.log("has next page: " + this.next);
    console.log("current url: " + this.url);
    console.log("------------------------------\n");
  }

}

// --------------------------- API STUFFS ------------------------- //

// scrapes all image data on one page and updates to db
function scrapeImages(html) {
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
}

// takes a paginate object and scrapes until instance is false

function scrapeEach(paginate) {

  // condition
  let hasNext = () => paginate.next

  // action to execute in while loop
  let nightmareScrape = next => {
    nightmare.goto(paginate.url).wait(4000).evaluate(() => {
      return document.body.innerHTML
    }).then(result => {
      scrapeImages(result);
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
}

// --------------------------- CLI TESTS ------------------------- //
process.argv.forEach((val, index, array) => {
  if (val == '--h')
    help();
  if (val == '--e')
    showEndpoints();
  if (val == '--v')
    onView();
  }
);

// the onview endpoint
function onView() {
  nightmare.goto(config.NGA.online)
  nightmare.wait(3000)
  nightmare.evaluate(() => {
    return [document.location.href, document.querySelector('span.results-span').innerHTML]
  }).then(([url, pgd]) => {
    scrapeEach(new Paginate(url, pgd))
  }).catch(error => {
    console.error('Search failed:', error);
  });

}

// shows all available endpoints
function showEndpoints() {
  console.log("Available Endpoints: \n");
  Object.keys(config.NGA).forEach(point => console.log(point));
}

function help() {
  console.log("supported commands: \n");
  console.log("--h: help menu");
  console.log("--e: view endpoints");
  console.log("--v: scrape the onview endpoint");
}
