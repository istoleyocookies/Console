import io from 'socket.io-client'

export default io(process.env.SOCKETIO_ENDPOINT,
  {
    autoConnect: false
  }
)
