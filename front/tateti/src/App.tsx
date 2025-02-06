import { useEffect, useState } from 'react';
import './App.css'
import { Client } from "@stomp/stompjs";
import { Status } from './components/Status';
import { Board } from './components/Board';

function App() {

  const [game, setGame] = useState<Game | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const client = connect();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = () => {
    // Initial handshake with the server
    const client = new Client({
      brokerURL: 'ws://localhost:8080/tictactoeGame',
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log('Connected to the server');

      client.subscribe('/topic/game', (message) => {
        console.log('Received a message from the server');
        const game = JSON.parse(message.body);
        console.log(game);
        setGame(game);
      });

      startNewGame(client);
    };

    client.activate();
    setClient(client);
    return client;
  }

  const startNewGame = (client: Client | null) => {
    console.log('Starting a new game');
    if (client && client.connected) {
      client.publish({
        destination: '/app/startNewGame',
        body: JSON.stringify({})
      })
    }
  }

  const makeMove = (position: number) => {

    if (game?.board[position] === "" && !game.gameOver) {
      const move: Move = {
        position,
        player: game.currentPlayer
      };

      if (client && client.connected) {
        client.publish({
          destination: '/app/move',
          body: JSON.stringify(move)
        });
      }
    }
  }


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {game &&
        <>
          <Status game={game} />
          <Board game={game} makeMove={makeMove} />
        </>
      }

      {game?.gameOver &&
        <button onClick={() => startNewGame(client)} style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '20px',
          cursor: 'pointer'
        }}>Empezar nuevo juego</button>
      }
    </div>
  )
}

export default App
