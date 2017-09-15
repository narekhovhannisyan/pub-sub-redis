const redis = require('redis')
const pub = redis.createClient()

const PUBSUBKEY = 'PUBSUBKEY'
const TRESHOLD = 4
/* request publisher function */
module.exports = (req, timeElapsed) => {
  const method = req.method.toString().substr(0, 1)
  const path = req.path
  const ip = (req.headers['x-real-ip']) ? req.headers['x-real-ip'] : req.ip
  const time = +new Date()
  const hour = (time - (time % 3600)).toString().substr(0, 9)
  const key = `${method}:${path}:${ip}:${hour}`

  /* C stands for count, T for Time */
  const cKey = `C:${key}`
  const tKey = `T:${key}`

  pub.incr(cKey, (err, itog) => {
    if (err) return
    if (itog > TRESHOLD) {
      pub.publish(PUBSUBKEY, key)
    } else {
      if (itog <= 5) {
        pub.expire(cKey, 300, (err, res) => {
          // TODO: implement callback
        })
        pub.expire(tKey, 300, (err, res) => {
          // TODO: implement callback
        })
      } else if (itog > 5) {
        pub.expire(cKey, 0, (err, res) => {
          // TODO: implement callback
        })
        pub.expire(tKey, 0, (err, res) => {
          // TODO: implement callback
        })
      }
    }
  })
  pub.incrbyfloat(tKey, timeElapsed)
}

// const sub = redis.createClient()
// sub.on('subscribe', (channel, count) => {
//   console.log('SUBSCRIBED', channel, count)
// })

// sub.on('message', (PUBSUBKEY, key) => {
//   // console.log(PUBSUBKEY + ': ' + key)
// })

// sub.subscribe(PUBSUBKEY)
