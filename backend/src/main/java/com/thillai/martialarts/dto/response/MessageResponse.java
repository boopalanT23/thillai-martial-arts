package com.thillai.martialarts.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageResponse {
    private String message;

    public static MessageResponse of(String msg) {
        return MessageResponse.builder().message(msg).build();
    }
}
