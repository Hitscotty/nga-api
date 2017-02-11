module.exports = {

  Paginate: (url, pgd) => {

    this.url   = url;
    this.array = pgd.split(" ");

    this.total   = Number(_.join(_.filter(this.array[4], char => char != ","), ''));
    this.current = Number(this.array[0]);
    this.pages   = Number(this.array[2]);
    this.next    = true;

    this.state = () => { 
      console.log("current page: "   + this.current);
      console.log("total pages: "    + this.total);
      console.log("items per page: " + this.pages);
      console.log("has next page: "  + this.next);
    } 

  }

}
