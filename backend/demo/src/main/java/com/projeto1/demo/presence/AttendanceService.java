package com.projeto1.demo.presence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.studentsClass.StudentsClass;
import com.projeto1.demo.studentsClass.StudentsClassRepository;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private StudentsClassRepository studentsClassRepository;

    public AttendanceStatsDTO getAttendanceSummary(Long studentId, Long classId) {
        int totalAulas = attendanceRepository.countTotalAulas(classId);
        int totalPresentAttendances = attendanceRepository.countTotalPresentAttendances(studentId, classId);

        return new AttendanceStatsDTO(totalAulas, totalPresentAttendances);
    }
}
