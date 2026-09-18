package com.thillai.martialarts.dto.response;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentResponse {
    private Long id;
    private String studentId;
    private String name;
    private Integer age;
    private String dob;
    private String mobile;
    private String photo;
    private String aadhaarPdfUrl;
    private List<String> courses;
    private String batchName;
    private String days;
    private String time;
    private String joiningDate;
    private Integer monthlyFee;
    private String feeStatus;
    private List<CourseFeeDetail> courseFeeDetails;
    private Integer paidFee;
    private Integer dueFee;
}
