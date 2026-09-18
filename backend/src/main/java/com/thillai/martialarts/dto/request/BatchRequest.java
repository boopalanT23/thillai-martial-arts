package com.thillai.martialarts.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BatchRequest {
    private String name;
    private String days;
    private String time;
    private String description;
}
