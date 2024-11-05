package com.projeto1.demo.presence;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceStatsDTO {

    private int totalAulas;
    private int totalPresentAttendances;

}
