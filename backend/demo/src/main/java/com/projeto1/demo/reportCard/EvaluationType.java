package com.projeto1.demo.reportCard;

public enum EvaluationType {
    FIRST_EVALUATION(0),
    FINAL_EVALUATION(1);

    private final int eval;

    EvaluationType(int eval){
        this.eval = eval;
    }

    public int getEval(){
        return eval;
    }

    public static EvaluationType fromString(String eval){
        return switch (eval.toUpperCase()){
            case "FIRST EVALUATION" -> FIRST_EVALUATION;
            case "FINAL EVALUATION" -> FINAL_EVALUATION;
            default -> throw new IllegalArgumentException("Invalid evaluation type: " + eval);
        };
    }

    public static EvaluationType fromCode(int code){
        return switch (code){
            case 0 -> FIRST_EVALUATION;
            case 1 -> FINAL_EVALUATION;
            default -> throw new IllegalArgumentException("Invalid code: " + code);
        };
    }
}
