const _ = require('lodash');

function Paginate(url, pgd) {

  let parseNumber = string => Number(_.join(_.filter(string, char => char != ","), ''));

  this.url = url;
  this.array = pgd.split(" ");

  this.itemsViewed = parseNumber(this.array[0]);
  this.itemsNext = parseNumber(this.array[2]);
  this.totalItems = parseNumber(this.array[4]);

  this.itemsPerPage = (this.itemsNext - this.itemsViewed) + 1;
  this.totalPages = Math.floor(this.totalItems / this.itemsPerPage);
  this.currentPage = Math.floor(this.itemsViewed / this.itemsPerPage);
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

module.exports = Paginate;
