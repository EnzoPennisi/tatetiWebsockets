package com.example.tateti.controllers;

import com.example.tateti.models.Game;
import com.example.tateti.models.Move;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Arrays;
import java.util.Map;
import java.util.Objects;

@Controller
public class GameController {
    private Game game = new Game();

    @MessageMapping("/joinGame")
    @SendTo("/topic/game")
    public Game joinGame(@Payload Map<String, String> payload) {

        System.out.println(payload.get("clientId"));

        String clientId = payload.get("clientId");

        System.out.println("ClientId: " + clientId);

        if(game.getPlayerXSessionId() == null) {
            game.setPlayerXSessionId(clientId);
            System.out.println("Jugador x asignado: " + clientId);
        }else if (game.getPlayerOSessionId() == null) {
            game.setPlayerOSessionId(clientId);
            System.out.println("Jugador O asignado: " + clientId);

            // Ambos jugadores están conectados, inicializar el tablero
            String[] filledBoard = game.getBoard();
            Arrays.fill(filledBoard, "");
            game.setBoard(filledBoard);

            // Informar que el juego puede comenzar
            System.out.println("Ambos jugadores conectados, el juego puede comenzar");
        }else{
            System.out.println("El juego ya ha comenzado");
        }

        return game;
    }

    @MessageMapping("/startNewGame")
    @SendTo("/topic/game")
    public Game handleStartGame() {
        String currentPlayerXId = game.getPlayerXSessionId();
        String currentPlayerOId = game.getPlayerOSessionId();

        game = new Game();
        game.setPlayerXSessionId(currentPlayerXId);
        game.setPlayerOSessionId(currentPlayerOId);

        String[] filledBoard = game.getBoard();
        Arrays.fill(filledBoard, "");
        game.setBoard(filledBoard);

        return game;
    }

    @MessageMapping("/move")
    @SendTo("/topic/game")
    // synchronized para asegurarse de que el metodo sea ejecutado de manera sincrónica
    public synchronized Game handleMove(Move move) {
        String clientId = move.getClientId();

        if (game.isGameOver()) {
            System.out.println("El juego ya ha terminado");
            return game;
        }

        System.out.println("ClientId: " + clientId);
        System.out.println("Player: " + move.getPlayer());
        System.out.println("xClientId: " + game.getPlayerXSessionId());

        //Validar que sea el jugador correcto
        boolean isValidPlayer = (move.getPlayer().equals("X") && Objects.equals(clientId, game.getPlayerXSessionId())) ||
                (move.getPlayer().equals("O") && Objects.equals(clientId, game.getPlayerOSessionId()));

        if (!isValidPlayer) {
            System.out.println("Jugador no valido");
            return game;
        }

        //Validar que es el turno del jugador
        if (!move.getPlayer().equals(game.getCurrentPlayer())){
            System.out.println("Movimiento inválido. No es el turno de  " +move.getPlayer());
            return game;
        }

        //Validar que la posición no este ocupada
        if (!game.getBoard()[move.getPosition()].isEmpty()) {
            System.out.println("Movimiento inválido. La posición ya está ocupada.");
            return game;
        }

        //Actualizar el tablero
        game.getBoard()[move.getPosition()] = move.getPlayer();

        checkWinner();

        if(!game.isGameOver()) {
            game.setCurrentPlayer(move.getPlayer().equals("X") ? "O" : "X");
        }

        printGameState();
        return game;
    }

    private void printGameState() {
        System.out.println("Game State");
        int pos = 0;
        String[] board = game.getBoard();
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                System.out.print(" | " + board[pos]);
                pos++;
            }
            System.out.print(" |");
            System.out.println();
            System.out.println("--------------");
        }
        System.out.println();
    }
    private void checkWinner() {

        String[] board = game.getBoard();

        String player = game.getCurrentPlayer();

        int[][] winnPatterns = {
                {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // Filas
                {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // Columnas
                {0, 4, 8}, {2, 4, 6} // Diagonales
        };

        for (int[] pattern : winnPatterns) {
            String cell1 = board[pattern[0]];
            String cell2 = board[pattern[1]];
            String cell3 = board[pattern[2]];

            if (!cell1.isEmpty() && cell1.equals(cell2) && cell2.equals(cell3)) {
                game.setWinner(cell1);
                game.setGameOver(true);
                System.out.println("Ganador: " + cell1);
                break;
            }
        }

        //Verificar empate
        boolean boardIsFull = true;
        for (String cell : board) {
            if (cell.isEmpty()) {
                boardIsFull = false;
                break;
            }
        }

        if (boardIsFull && !game.isGameOver()) {
            game.setWinner("Empate");
            game.setGameOver(true);
        }
    }
}
