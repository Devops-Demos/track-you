function Highlight($sce) {
  return function (text, phrase) {
    if (phrase) {
      text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
        '<span class="highlighted">$1</span>');
    }
    return $sce.trustAsHtml(text);
  };
}
export default Highlight;
