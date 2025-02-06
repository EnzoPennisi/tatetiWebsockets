import { useEffect, useState, useRef } from 'react';
import './App.css'
import { Client } from "@stomp/stompjs";
import { Status } from './components/Status';
import { Board } from './components/Board';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [game, setGame] = useState<Game | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<string>("");
  const [canPlay, setCanPlay] = useState<boolean>(false);

  const clientIdRef = useRef<string>(uuidv4());
  console.log('clientIdRef', clientIdRef.current);

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
        const game: Game = JSON.parse(message.body);
        setGame(game);

        if (game.playerXSessionId === clientIdRef.current) {
          setPlayerSymbol('X');
        } else if (game.playerOSessionId === clientIdRef.current) {
          setPlayerSymbol('O');
        }

        //Verify is both players are connected
        if (game.playerXSessionId && game.playerOSessionId) {
          setCanPlay(true);
        } else {
          setCanPlay(false);
        }

      });

      // Join the game with the clientId
      client.publish({
        destination: '/app/joinGame',
        body: JSON.stringify({ clientId: clientIdRef.current })
      });
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

    if (
      game &&
      canPlay &&
      game.board[position] === "" &&
      !game.gameOver &&
      client &&
      client.connected &&
      playerSymbol === game.currentPlayer
    ) {

      const move: Move = {
        position,
        player: playerSymbol,
        clientId: clientIdRef.current
      };

      client.publish({
        destination: '/app/move',
        body: JSON.stringify(move)
      });

    } else {
      console.log('No es su turno o el juego ha terminado');
    }
  }


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {game &&
        <>
          <Status game={game} playerSymbol={playerSymbol} canPlay={canPlay} />
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
