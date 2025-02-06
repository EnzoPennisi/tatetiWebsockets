package com.example.tateti.controllers;

import com.example.tateti.models.Game;
import com.example.tateti.models.Move;
import com.example.tateti.services.GameService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@AllArgsConstructor
public class GameController {
    private final GameService gameService;

    @MessageMapping("/joinGame")
    @SendTo("/topic/game")
    public Game joinGame(@Payload Map<String, String> payload) {
       String clientId = payload.get("clientId");
       return gameService.joinGame(clientId);
    }

    @MessageMapping("/startNewGame")
    @SendTo("/topic/game")
    public Game handleStartGame() {
        return gameService.startNewGame();
    }

    @MessageMapping("/move")
    @SendTo("/topic/game")
    // synchronized para asegurarse de que el metodo sea ejecutado de manera sincrónica
    public synchronized Game handleMove(Move move) {
        return gameService.handleMove(move);
    }
}
