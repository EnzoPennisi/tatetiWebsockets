import { useEffect, useState, useRef } from 'react';
import './App.css'
import { Client } from "@stomp/stompjs";
import { Status } from './components/Status';
import { Board } from './components/Board';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [game, setGame] = useState<Game | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<string>("");
  const [canPlay, setCanPlay] = useState<boolean>(false);

  const clientRef = useRef<Client | null>(null);
  const clientIdRef = useRef<string>(uuidv4());

  useEffect(() => {
    connect();

    return () => {
      disconnect();
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

      subscribeToGame(client);
      joinGame(client);
    };

    client.activate();
    clientRef.current = client;
  }

  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
    }
  }

  const subscribeToGame = (client: Client) => {
    // Initial handshake with the server
    client.subscribe('/topic/game', (message) => {
      const gameData: Game = JSON.parse(message.body);
      setGame(gameData);
      updatePlayerState(gameData);
    });
  }

  const joinGame = (client: Client) => {
    client.publish({
      destination: '/app/joinGame',
      body: JSON.stringify({ clientId: clientIdRef.current })
    });
  }

  const updatePlayerState = (gameData: Game) => {
    if (gameData.playerXSessionId === clientIdRef.current) {
      setPlayerSymbol('X');
    } else if (gameData.playerOSessionId === clientIdRef.current) {
      setPlayerSymbol('O');
    }

    const bothPlayersConnected = gameData.playerXSessionId && gameData.playerOSessionId;
    setCanPlay(!!bothPlayersConnected);
  }

  const startNewGame = () => {
    console.log('Starting a new game');
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: '/app/startNewGame',
        body: JSON.stringify({})
      })
    }
  }

  const makeMove = (position: number) => {

    if (canMakeMove(position)) {

      const move: Move = {
        position,
        player: playerSymbol,
        clientId: clientIdRef.current
      };

      clientRef.current?.publish({
        destination: '/app/move',
        body: JSON.stringify(move)
      });

    } else {
      console.log('No es su turno o el juego ha terminado');
    }
  }

  const canMakeMove = (position: number) => {
    return (
      game &&
      canPlay &&
      game.board[position] === "" &&
      !game.gameOver &&
      clientRef.current &&
      clientRef.current.connected &&
      playerSymbol === game.currentPlayer
    )
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
        <button
          onClick={() => startNewGame()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            marginTop: '20px',
            cursor: 'pointer'
          }}>
          Empezar nuevo juego
        </button>
      }
    </div>
  )
}

export default App
