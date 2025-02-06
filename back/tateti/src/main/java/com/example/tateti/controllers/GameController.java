package com.example.tateti.controllers;

import com.example.tateti.models.Game;
import com.example.tateti.models.Move;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Arrays;

@Controller
public class GameController {
    private Game game = new Game();

    @MessageMapping("/startNewGame")
    @SendTo("/topic/game")
    public Game handleStartGame() {
        System.out.println("New game started");
        game = new Game();
        String[] filledBoard = game.getBoard();
        Arrays.fill(filledBoard, "");
        game.setBoard(filledBoard);
        return game;
    }

    @MessageMapping("/move")
    @SendTo("/topic/game")
    public Game handleMove(Move move) {
        if (!game.isGameOver()) {

            if (!game.getBoard()[move.getPosition()].isEmpty()) {
                System.out.println("Movimiento inválido. La posición ya está ocupada.");
                return game;
            }

            game.getBoard()[move.getPosition()] = move.getPlayer();

            checkWinner();

            game.setCurrentPlayer(move.getPlayer().equals("X") ? "O" : "X");
        }

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
        return game;
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
