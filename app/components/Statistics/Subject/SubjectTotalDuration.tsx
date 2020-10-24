/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/catch-or-return */
/* eslint-disable object-shorthand */
/* eslint-disable no-continue */
import { push } from 'connected-react-router';
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import { stringify } from 'querystring';
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import StudentBatch from '../../../entity/StudentBatch';

type totalDurationPropType = {
  selectedProgrammeId: number;
  selectedYearSem: string;
};

type TotalDurationType = {
  name: string;
  duration: number;
};

const colors = [
  '#33FFCC',
  '#B366CC',
  '#E6331A',
  '#66994D',
  '#4D8000',
  '#E666FF',
  '#FFB399',
  '#FF33FF',
  '#FF6633',
  '#991AFF',
  '#00B3E6',
  '#CC80CC',
  '#E6B333',
  '#3366E6',
  '#B34D4D',
  '#FFFF99',
  '#999966',
  '#B33300',
  '#99FF99',
  '#809900',
  '#66664D',
  '#6680B3',
  '#80B300',
  '#FF99E6',
  '#E6B3B3',
  '#FF1A66',
  '#66991A',
  '#CCFF1A',
];

export default function SubjectTotalDuration({
  selectedProgrammeId,
  selectedYearSem,
}: totalDurationPropType) {
  const [studentBatches, setStudentBatches] = useState<StudentBatch[]>([]);
  const [filteredStudentBatches, setFilteredStudentBatches] = useState<
    StudentBatch[]
  >([]);

  const [filteredData, setfilteredData] = useState<TotalDurationType[]>([]);

  const [chartData, setchartData] = useState({});

  const totalDuration = useRef(new Map<string, number>());

  const year = () => parseInt(selectedYearSem.charAt(1), 10);
  const seme = () => parseInt(selectedYearSem.charAt(3), 10);

  const filterStudentBatches = () => {
    if (selectedProgrammeId === -1) {
      return;
    }
    const f = studentBatches.filter(
      (b) =>
        b.get().ProgrammeId === selectedProgrammeId &&
        b.get().year === year() &&
        b.get().semester === seme()
    );
    console.log('filtering', f);

    setFilteredStudentBatches([...f]);
  };

  useEffect(() => {
    StudentBatch.findAll({ include: [{ all: true, nested: true }] }).then(
      (batches) => {
        setStudentBatches([...batches]);
      }
    );
  }, []);

  useEffect(() => {
    filterStudentBatches();
  }, [studentBatches]);

  const getTotalDuration = () => {
    totalDuration.current.clear();
    filteredStudentBatches.map((b) => {
      if (b.get().Sessions.length === 0) {
        setfilteredData([]);
        return;
      }
      b.get().Sessions.forEach((s: any) => {
        if (totalDuration.current.has(s.get().Subject?.get().name)) {
          const total =
            totalDuration.current.get(s.get().Subject?.get().name) * 60 +
            (s.durationHours * 60 + s.durationMinutes);

          totalDuration.current.set(
            s.get().Subject?.get().name,
            Math.floor(total / 60)
          );
        } else {
          totalDuration.current.set(
            s.get().Subject?.get().name,
            s.durationHours
          );
        }
      });
      const durations: TotalDurationType[] = [];
      totalDuration.current.forEach((value, key) => {
        durations.push({
          name: key,
          duration: value,
        });
      });
      setfilteredData([...durations]);
    });
  };

  useEffect(() => {
    getTotalDuration();
  }, [filteredStudentBatches]);

  useEffect(() => {
    filterStudentBatches();
  }, [selectedProgrammeId, selectedYearSem]);
  useEffect(() => {
    console.log('final data', filteredData);
  }, [filteredData]);

  const data = () => {
    const d: any[] = [];
    const l: string[] = [];
    totalDuration.current.forEach((value, key, x) => {
      l.push(key);
      d.push(value);
    });
    setchartData({
      datasets: [
        {
          data: d,
          backgroundColor: colors,
        },
      ],
      labels: l,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      data();
    }, 1000);
  }, [chartData]);

  return (
    <div>
      <Pie data={chartData} />

      {filteredStudentBatches.length === 0 && (
        <Alert variant="warning">
          The selected year, semester and programme filter combination does not
          have any information to display statistics
        </Alert>
      )}
    </div>
  );
}
