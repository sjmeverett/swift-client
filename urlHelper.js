var combineUrl = function (firstPart, secondPart) {
  var result = trimSlashes(firstPart, false, true) + "/" + trimSlashes(secondPart, true, true);
  return result;
};

var trimSlashes = function (text, onStart, onEnd) {
  var result = text;
  if (onStart) {
    result = result.replace(/^[\/ ]*/, "");
  }
  if (onEnd) {
    result = result.replace(/[\/ ]*$/, "");
  }
  return result;
};


module.exports = {
  combineUrl: combineUrl,
  trimSlashes: trimSlashes
};
