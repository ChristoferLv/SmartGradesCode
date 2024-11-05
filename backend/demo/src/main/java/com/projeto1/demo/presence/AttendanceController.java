package com.projeto1.demo.presence;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/stats/{studentId}/{classId}")
    public AttendanceStatsDTO getAttendanceStats(
            @PathVariable Long studentId,
            @PathVariable Long classId) {

        return attendanceService.getAttendanceSummary(studentId, classId);
    }
}
