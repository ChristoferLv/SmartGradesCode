package com.projeto1.demo.reportCard;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto1.demo.messages.MessageResponseDTO;

@Service
public class ReportCardService {

    private final ReportCardRepository reportCardRepository;

    @Autowired
    public ReportCardService(ReportCardRepository reportCardRepository) {
        this.reportCardRepository = reportCardRepository;
    }

    public MessageResponseDTO addNewReportCard(ReportCardDTO reportCardDTO) {
        System.out.println("[ReportCard Service] addNewReportCard " + reportCardDTO.toString() + "\n");
        ReportCard reportCard = ReportCardMapper.INSTANCE.toModel(reportCardDTO);
        reportCardRepository.save(reportCard);
        return MessageResponseDTO.builder().message("Report Card created with ID " + reportCard.getId()).build();
    }

    public List<String> listAll() {
        System.out.println("[ReportCard Service] listAll\n");
        return reportCardRepository.findAll().stream()
                .map(reportCard -> reportCard.toString())
                .collect(Collectors.toList());
    }
}
