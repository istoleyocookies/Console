import io from 'socket.io-client'

export default io(process.env.VUE_APP_SOCKETIO_ENDPOINT,
  {
    autoConnect: false
  }
)
