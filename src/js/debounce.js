module.exports = (function() {
  var debouncees = [];

  function findDebouncee(target, method) {
    var index = -1;

    for (var i = 0; i < debouncees.length; i++) {
      var item = debouncees[i];

      if (item[0] === target && item[1] === method) {
        index = i;
        break;
      }
    }

    return index;
  }

  function debounce(target, method /* , args, wait, [immediate] */) {
    var args      = [].slice.call(arguments, 2);
    var immediate = [].pop.call(args);
    var wait, index, debouncee, timer;

    if (typeof(immediate) === "number" || typeof(immediate) === "string") {
      wait = immediate;
      immediate = false;
    } else {
      wait = [].pop.call(args);
    }

    wait = parseInt(wait, 10);
    index = findDebouncee(target, method);

    if (index > -1) {
      debouncee = debouncees[index];
      debouncees.splice(index, 1);
      clearTimeout(debouncee[2]);
    }

    if (immediate) {
      method.apply(target, args);
    }
    else {
      timer = setTimeout(function() {
        method.apply(target, args)
      }, wait);

      debouncee = [target, method, timer];
      debouncees.push(debouncee);
    }
  }

  return debounce;
})();
