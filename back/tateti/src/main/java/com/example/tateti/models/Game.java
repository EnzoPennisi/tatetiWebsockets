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
    private String currentPlayer = "X";
    private boolean isGameOver = false;
    private String winner;
}
