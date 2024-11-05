package com.projeto1.demo.presence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT COUNT(a) FROM Aula a WHERE a.studentsClass.id = :classId")
    int countTotalAulas(@Param("classId") Long classId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :studentId AND a.aula.studentsClass.id = :classId AND a.status = true")
    int countTotalPresentAttendances(@Param("studentId") Long studentId, @Param("classId") Long classId);
}
