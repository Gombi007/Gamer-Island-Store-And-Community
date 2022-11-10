package com.gombino.mynotes.services;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketServiceImpl implements WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyFrontend(Map<String, String> message) {
        Gson gson = new Gson();
        messagingTemplate.convertAndSend("/topic/notes", gson.toJson(message));
    }
}
