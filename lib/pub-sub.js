const redis = require('redis')
const sub = redis.createClient()
const pub = redis.createClient()

const PUBSUBKEY = 'PUBSUBKEY'
const TRESHOLD = 4

const publishRequests = function (req, res, next) {
  console.log(req.get('method'))
  const method = req.method
  const path = req.path
  const ip = (req.headers['x-real-ip']) ? req.headers['x-real-ip'] : req.ip
  const time = +new Date()
  const hour = (time - (time % 3600)).toString().substr(0, 9)
  const key = `${method}:${path}:${ip}:${hour}`
  const timeElapsed = parseFloat(Math.random() * 100).toFixed(2)

  const cKey = `C:${key}`
  const tKey = `T:${key}`

  pub.incr(cKey, (err, itog) => {
    if (err) return
    if (itog > TRESHOLD) {
      pub.publish(PUBSUBKEY, key)
    } else {
      if (itog <= 5) {
        pub.setex(cKey, 300, key, (err, res) => {

        })
        pub.setex(tKey, 300, key, (err, res) => {

        })
      } else if (itog > 5) {

      }
    }
  })

  pub.incrbyfloat(tKey, timeElapsed)
  const caller = () => {
    const INTERV = setInterval(() => {
      publishRequests()
      pub.dbsize((err, count) => {
        if (err) {
          return
        }
        if (count > 100000) {
          console.log('limit has been reached: ' + count)
          clearInterval(INTERV)
        }
      })
    }, 0)
  }

  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()

  sub.on('subscribe', (channel, count) => {
    console.log('SUBSCRIBED', channel, count)
  })

  sub.on('message', (PUBSUBKEY, key) => {
    // console.log(PUBSUBKEY + ': ' + key)
  })

  sub.subscribe(PUBSUBKEY)

  next()
}

const axmaxFunction = (req, res, next) => {
  const publishReq = () => {
    const method = parseInt(Math.random() * 10) % 2 === 0 ? 'G' : 'P'
    const endpoint = '/api/v1/projects/' + parseInt(Math.random() * 1000)
    const userId = parseInt(Math.random() * 10) % 2 === 0 ? 33 : null
    const time = +new Date()
    const hour = (time - (time % 3600)).toString().substr(0, 9)
    const key = `${method}:${endpoint}:${userId}:${hour}`
    const timeElapsed = parseFloat(Math.random() * 100).toFixed(2)

    const cKey = `C:${key}`
    const tKey = `T:${key}`

    pub.incr(cKey, (err, itog) => {
      if (err) return
      if (itog > TRESHOLD) {
        pub.publish(PUBSUBKEY, key)
      } else {
        if (itog <= 5) {
          // pub.setex(cKey, 300, key, (err, res) => {

          // })
          // pub.setex(tKey, 300, key, (err, res) => {

          // })
        } else if (itog > 5) {
        }
      }
    })
    pub.incrbyfloat(tKey, timeElapsed)
  }

  const caller = () => {
    const INTERV = setInterval(() => {
      publishReq()
      pub.dbsize((err, count) => {
        if (err) {
          return
        }
        if (count > 100000) {
          console.log('limit has been reached: ' + count)
          clearInterval(INTERV)
        }
      })
    }, 0)
  }

  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()
  caller()

  sub.on('subscribe', (channel, count) => {
    console.log('SUBSCRIBED', channel, count)
  })

  sub.on('message', (PUBSUBKEY, key) => {
    // console.log(PUBSUBKEY + ': ' + key)
  })

  sub.subscribe(PUBSUBKEY)

  next()
}

module.exports = {
  publishRequests
}
