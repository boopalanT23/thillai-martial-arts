package com.thillai.martialarts.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NotificationSendRequest {
    /** Null = broadcast to all students */
    private String studentId;
    private String title;
    private String message;
}
