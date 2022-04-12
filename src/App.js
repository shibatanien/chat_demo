import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [received_messages, setReceivedMessages] = useState([])

  useEffect(() => {
    setSocket(new WebSocket('wss://b77vokhg67.execute-api.ap-southeast-1.amazonaws.com/production'))
    return () => {
      socket && socket.close()
    }
  }, [])

  useEffect(() => {
    if(socket) {
      socket.addEventListener('open', e => {
        console.log('websocket is connected')
      })
  
      socket.addEventListener('close', e => {
          console.log('websocket is closed')
      })
  
      socket.addEventListener('error', e => {
          console.error('websocket is in error', e)
      })
  
      socket.addEventListener('message', e => {
        setReceivedMessages(oldArray => [...oldArray, e.data])
      })
    }

    return() => {
      socket && socket.close()
    }
  }, [socket])

  async function handleSend() {
    setReceivedMessages(oldArray => [...oldArray, message])
    socket.send(JSON.stringify({
      action: 'sendMessage',
      message: message
    }))
  }

  return (
    <div className="App">
      <h1>Chat app</h1>
      <small>Powerd by API Gateway & Lambda & DynamoDB</small>
      <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ border: '2px solid black', flex: 1, overflow: 'scroll' }}>
          {received_messages.map((message, index) => (
            <p key={index} style={{ textAlign: 'left', marginLeft: 10 }}>{message}</p>
          ))}
        </div>
        <div >
          <input onChange={(e) => setMessage(e.target.value)} type="text" placeholder='type message...' />
          <button onClick={() => handleSend()}>SEND!</button>
        </div>
      </div>
    </div>
  );
}

export default App;
