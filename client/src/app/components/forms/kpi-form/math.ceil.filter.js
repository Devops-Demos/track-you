function MathCeil() {
  return function(input) {
    if (parseInt(input) > 0) {
      return Math.ceil(input);
    }
    return 0;
  };
}
export default MathCeil;
