package com.projeto1.demo.reportCard;

import org.springframework.data.annotation.ReadOnlyProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class EvaluationDTO {

    private Long id;

    private Long reportCardId;

    private Integer OT;

    private Integer WT;

    private int evaluationType;

    @ReadOnlyProperty
    private Integer finalGrade;


}
