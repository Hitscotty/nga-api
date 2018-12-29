# nga-api

To get started with developing this repo first

```bash
git clone https://github.com/Hitscotty/nga-api.git && cd nga-api
npm install
```

create a `config.js` file with your info, be sure to have a db uri to plug in. Copy and paste the following.

``` javascript
const config = {
  PORT: 3000,
  NGA: {
    root: "https://images.nga.gov/en/search/show_advanced_search_page/?service=search&action=do_advanced_search&language=en&form_name=&all_words=&exact_phrase=&exclude_words=&artist_last_name=&keywords_in_title=&accession_number=&school=&Classification=&medium=&year=&year2=",
    onview: "http://www.nga.gov/content/ngaweb/collection-search-result.html?onview=On_View&pageNumber=1",
    online: "http://www.nga.gov/content/ngaweb/collection-search-result.html?artobj_imagesonly=Images_online&pageNumber=1&lastFacet=artobj_imagesonly"
    // add more endpoints here
  },
  NIGHTMARE: {
    waitTimeout: 800000,
    openDevTools: {
      mode: 'detach'
    },
    show: false
  },
  DB: {
    uri: "YOUR_DB_URI_HERE"
  }
}

module.exports = config;
```

for CLI use you can check supported commands with `node app.js --h`

# endpoints

- `/onview`

You can access all the same search categories from the [nga website](http://www.nga.gov/content/ngaweb.html). Heres a sample image object:

```json
{
    "img": "http://media.nga.gov/public/supplemental/objects/1/2/9/9/9/7/129997-crop-0-90x90.jpg",
    "title": "Horgász-stég (Fisherman's Dock)",
    "created": "c. 1930 ",
    "medium": "gelatin silver print ",
    "dimensions": "overall: 22.4 x 17.5 cm (8 13/16 x 6 7/8 in.) ",
    "credit": "Patrons' Permanent Fund ",
    "accession": "2004.63.4 "
  }
```


