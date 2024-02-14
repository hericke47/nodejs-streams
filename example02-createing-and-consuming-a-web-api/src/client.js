import { get } from 'node:http'
import { Transform, Writable } from 'node:stream'
import { createWriteStream } from 'node:fs'

const url = "http://localhost:3000"

const getHttpStream = () => new Promise(resolve => get(url, response => resolve(response)))

const stream = await getHttpStream()

stream
.pipe(
  Transform({
    // this will force the stream to use string instead of buffers
    objectMode: true,
    transform(chunk, enc, cb) {
      const item = JSON.parse(chunk)
      // console.log('chunk', JSON.parse(chunk))

      const myNumber = /\d+/.exec(item.name)
      const isEven = myNumber % 2 === 0
      item.name = item.name.concat(isEven ? ' is even' : ' is odd')

      cb(null, JSON.stringify(item))
    }
  })
)
.filter(chunk => chunk.includes('even'))
.map(chunk => chunk.toUpperCase() + "\n")
.pipe(
  // flag A => append data if existent
  createWriteStream('response.log', {
    flags: 'a'
  })
)
// we can't have two writable streams on the same pipeline
// .pipe(
//   Writable({
//     objectMode: true,
//     write(chunk, env, cb) {
//       console.log('chunk', chunk)

//       return cb()
//     }
//   })
// )
// .pipe(process.stdout)