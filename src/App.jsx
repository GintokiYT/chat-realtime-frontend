import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
// const socket = io('https://stunning-gumption-198819.netlify.app/');

const App = () => {

  const [ message, setMessage ] = useState('');
  const [ messages, setMessages ] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(message.trim().length === 0) return;

    const newMessage = {
      body: message,
      from: 'Me'
    }
    setMessages([...messages, newMessage]);
    socket.emit('client:message', message);

    setMessage('');
  }

  const receiveMessage = (message) => {
    setMessages((state) => [...state, message]);
  }

  useEffect(() => {
    socket.on('server:message', (message) => receiveMessage(message));

    return () => socket.off('server:message');
  }, []);

  return (  
    <div className='bg-zinc-900 text-white'>
      <form 
        className='bg-zinc-900 w-full h-screen flex flex-col max-w-md m-auto'
        onSubmit={handleSubmit}
      >
        <h1 className='text-2xl font-bold text-center bg-whatsapp py-3 border-zinc-100 border-b-1'>GeorApp</h1>
        <ul className='bg-slate-300 flex-1 overflow-hidden overflow-y-scroll p-4 flex flex-col gap-2 bg-[url(./assets/fondo.jpg)] bg-cover bg-no-repeat bg-center custom-scroll'>
          {messages.map( (message, index) => {
            return (
              <li 
                className={`p-2 text-sm rounded-md flex flex-col ${message.from === 'Me'? 'bg-sky-700 ml-auto': 'bg-black mr-auto'}`}
                key={index}
              >
                <span className={`text-xs font-bold ${message.from === 'Me'? 'text-indigo-800' : 'text-green-800'}`}>{message.from}</span>
                <span className='text-sm'>{message.body}</span>
              </li>
            )
          })}
        </ul>
        <input 
          className='border-2 border-zinc-500 p-2 w-full text-black outline-none'
          type='text' 
          placeholder='Escribe tu mensaje...' 
          value={message}
          onChange={ (e) => setMessage(e.target.value) }
        />
      </form>
    </div>
  );
}
 
export default App;