function Pagination() {
  return function(input, start) {
    if (input) {
      start = +start;
      return _.where(input, {
        'deleted': false
      }).slice(start);
    }
    return [];
  };
}
export default Pagination;
