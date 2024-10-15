package com.projeto1.demo.reportCard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto1.demo.messages.MessageResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reportCard")
public class ReportCardController {

    private ReportCardService reportCardService;

    @Autowired
    public ReportCardController(ReportCardService reportCardService) {
        this.reportCardService = reportCardService;
    }

    @PostMapping
    public MessageResponseDTO createNewReportCard(@RequestBody @Valid ReportCardDTO reportCardDTO) {
        System.out.println("[ReportCard Controller] createNewReportCard " + reportCardDTO.getStudentId());
        return reportCardService.addNewReportCard(reportCardDTO);
    }

    @GetMapping("/list-report-cards-from/{studentId}")
    public ResponseEntity<List<ReportCardDTO>> getReportCardsByStudentId(@PathVariable Long studentId) {
        List<ReportCardDTO> reportCards = reportCardService.listReportCardByUserId(studentId);
        if (reportCards.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reportCards);
    }

    @GetMapping()
    public List<String> listAllReportCards() {
        System.out.println("[ReportCard Controller] listAllReportCards");
        return reportCardService.listAll();
    }
}
