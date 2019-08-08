module.exports = function() {
  let subs = [];
  return {
    send(e) {
      subs = subs.filter(sub => {
        for (let [ss, cb] of sub)
          if (ss.some(s => Object.keys(s).every(k => e[k] === s[k])))
            return cb(e), false;
        return true;
      });
    },
    next(ys, ns) {
      return new Promise((y, n) => subs.push([[ys, y], [ns || [], n]]));
    }
  };
}

