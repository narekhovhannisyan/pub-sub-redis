/* this middleware function is calculating http response time, after calling given function with req, res, elapsed */
module.exports = fn => {
  return (req, res, next) => {
    req._start = +new Date()
    res.on('finish', function () {
      const elapsed = new Date() - req._start
      fn(req, elapsed)
    })
    next()
  }
}
