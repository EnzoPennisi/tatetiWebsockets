package com.example.tateti.services;

import com.example.tateti.models.Game;
import com.example.tateti.models.Move;
import com.example.tateti.models.Player;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Objects;

@Service
public class GameService {

    private Game game = new Game();

    public Game joinGame(String clientId) {
        if (game.getPlayerXSessionId() == null) {
            game.setPlayerXSessionId(clientId);
        } else if (game.getPlayerOSessionId() == null) {
            game.setPlayerOSessionId(clientId);
            iniciarTablero();
        }
        return game;
    }

    public Game startNewGame() {
        String playerXId = game.getPlayerXSessionId();
        String playerOId = game.getPlayerOSessionId();

        game = new Game();
        game.setPlayerXSessionId(playerXId);
        game.setPlayerOSessionId(playerOId);
        iniciarTablero();

        return game;
    }

    public synchronized Game handleMove(Move move) {
        if (game.isGameOver()) {
            return game;
        }

        if (!isValidPlayer(move)) {
            return game;
        }

        if (!isPlayerTurn(move)) {
            return game;
        }

        if (isPositionFree(move.getPosition())) {
            return game;
        }

        updateBoard(move);
        checkWinner();

        if (!game.isGameOver()) {
            changeTurn(move.getPlayer());
        }

        return game;
    }

    private void iniciarTablero() {
        Arrays.fill(game.getBoard(), "");
    }

    private boolean isValidPlayer(Move move) {
        String clientId = move.getClientId();
        Player player = move.getPlayer();
        return (player == Player.X && Objects.equals(clientId, game.getPlayerXSessionId())) ||
                (player == Player.O && Objects.equals(clientId, game.getPlayerOSessionId()));
    }

    private boolean isPlayerTurn(Move move) {
        return move.getPlayer() == game.getCurrentPlayer();
    }

    private boolean isPositionFree(int position) {
        return !game.getBoard()[position].isEmpty();
    }

    private void updateBoard(Move move) {
        game.getBoard()[move.getPosition()] = String.valueOf(move.getPlayer());
    }

    private void changeTurn(Player currentPlayer) {
        game.setCurrentPlayer(currentPlayer == Player.X ? Player.O : Player.X);
    }


    private void checkWinner() {
        String[] board = game.getBoard();

        Player player = game.getCurrentPlayer();

        int[][] winPatterns = {
                {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // Filas
                {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // Columnas
                {0, 4, 8}, {2, 4, 6}             // Diagonales
        };

        for (int[] pattern : winPatterns) {
            String cell1 = board[pattern[0]];
            String cell2 = board[pattern[1]];
            String cell3 = board[pattern[2]];

            if (!cell1.isEmpty() && cell1.equals(cell2) && cell2.equals(cell3)) {
                game.setWinner(player);
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
            game.setWinner(Player.TIE);
            game.setGameOver(true);
        }
    }
}
