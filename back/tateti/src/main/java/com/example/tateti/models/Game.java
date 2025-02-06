package com.example.tateti.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Game {
    private String[] board = new String[9];
    private Player currentPlayer = Player.X;
    private boolean isGameOver = false;
    private Player winner;

    private String playerXSessionId;
    private String playerOSessionId;
}
