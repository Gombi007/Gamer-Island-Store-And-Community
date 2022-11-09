package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PaginationInfo {
    private int actualPage;
    private int totalPages;
    private long totalElements;
}
