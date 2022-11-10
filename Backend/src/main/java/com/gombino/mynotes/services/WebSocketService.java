package com.gombino.mynotes.services;

import java.util.Map;

public interface WebSocketService {

    void notifyFrontend(Map<String, String> message);
}
