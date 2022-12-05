package com.gombino.mynotes.services;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

@Service
public class FileService {
    @Value("${ADULT_PATH}")
    private String path;

    private File initFileWriter(String fileNameByUser) {
        String fileName = fileNameByUser;
        String directoryName = "Data";
        try {

            File directory = new File(path, directoryName);
            if (!directory.exists()) {
                directory.mkdir();
            }

            File file = new File(directory, fileName);
            if (!file.exists()) {
                file.createNewFile();
            }
            return file;
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
        }
        return null;
    }

    //adult section
    public JsonObject getAdultFilterJsonObject() {
        File file = initFileWriter("adult.json");
        String result = "";

        if (file != null) {
            String temp;
            try {
                BufferedReader reader = new BufferedReader(new FileReader(file));
                while ((temp = reader.readLine()) != null) {
                    result += temp;
                }
                reader.close();
            } catch (Exception exception) {
                System.out.println("There is an issue with file reading");
                System.out.println(exception.getMessage());
            }
        }
        JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();
        return jsonObject;
    }
}
