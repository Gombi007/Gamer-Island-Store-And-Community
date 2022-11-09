package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PaginationSorterDto {
    private int page;
    private int size;
    private String sortBy;
}
