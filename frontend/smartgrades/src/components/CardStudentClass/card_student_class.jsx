import React from 'react';
import "./card_student_class.css"

const ClassCard = ({ data }) => {
    return (
        <div className="student-class-card">
            <h2 className="student-class-title">{data.level}</h2>
            <p className="student-class-text">Period: {data.period.name}</p>
            <p className="student-class-text">Class Group: {data.classGroup}</p>
            <p className="student-class-text">State: {data.state == 0 ? "FINISHED" : "ACTIVE"}</p>
        </div>
    );
};

export default ClassCard;