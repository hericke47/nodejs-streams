import http from 'http'
import { Readable } from 'node:stream'
import {
  randomUUID
} from 'node:crypto'

function * run() {
  for(let index = 0; index <= 99; index++) {
    const data = {
      id: randomUUID(),
      name: `Herick-${index}`,
      at: Date.now()
    }
    yield data
  }
}

function handler(request, response) {
  // const readableStream = Readable({
  //   read() {
  //     this.push('Hello')
  //     this.push('World')
  //     this.push(null)
  //   }
  // })

  const readableStream = Readable({
    read() {
      for(const data of run()) {
        this.push(JSON.stringify(data).concat("\n"))
      }

      // Just saying that the stream has finished!
      this.push(null)
    }
  })

  readableStream.pipe(response)
}

http.createServer(handler).listen(3000).on('listening', () => console.log("server is running at 3000"))