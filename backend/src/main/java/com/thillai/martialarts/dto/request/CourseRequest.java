package com.thillai.martialarts.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CourseRequest {
    private String slug;
    private String name;
    private String category;
    private Integer feePerMonth;
    private Long batchId;
    private String icon;
    private String tagline;
    private String overview;
    private String benefits;
    private String curriculum;
    private String imageUrl;
}
