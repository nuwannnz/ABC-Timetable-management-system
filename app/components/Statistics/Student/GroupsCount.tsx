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
import React, { useEffect, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Programme from '../../../entity/Programme';

import StudentBatch from '../../../entity/StudentBatch';

const colors = ['blue', 'orange', 'grey', 'yellow'];

type YearLableType = {
  year: number;
  semester: number;
  lable: string;
};

type GroupsCountPropType = {
  selectedProgrammeId: number;
};
export default function GroupsCount({
  selectedProgrammeId,
}: GroupsCountPropType) {
  const [chartData, setchartData] = useState<any>({});

  const [studentBatches, setStudentBatches] = useState<StudentBatch[]>([]);

  const [filteredStudentBatches, setFilteredStudentBatches] = useState<
    StudentBatch[]
  >([]);

  const [lables, setLables] = useState<YearLableType[]>([]);

  const loadLables = () => {
    const lbls: YearLableType[] = [];
    for (let i = 1; i <= 4; i++) {
      lbls.push({
        year: i,
        semester: 1,
        lable: `Y${i}S${1}`,
      });

      lbls.push({
        year: i,
        semester: 2,
        lable: `Y${i}S${2}`,
      });
    }
    setLables(lbls);
  };

  const filterStudentBatches = () => {
    if (selectedProgrammeId === -1) {
      return;
    }
    setFilteredStudentBatches([
      ...studentBatches.filter(
        (b) => b.get().ProgrammeId === selectedProgrammeId
      ),
    ]);
  };

  useEffect(() => {
    loadLables();
    StudentBatch.findAll().then((batches) => {
      setStudentBatches([...batches]);
    });
  }, []);

  useEffect(() => {
    filterStudentBatches();
  }, [studentBatches]);

  useEffect(() => {
    filterStudentBatches();
  }, [selectedProgrammeId]);

  const getMainGroupCount = (year: number, semester: number) => {
    let groupCount = 0;
    filteredStudentBatches
      .filter((b) => b.get().year === year && b.get().semester === semester)
      .forEach((b) => {
        groupCount += b.get().groups.length;
      });
    return groupCount;
  };

  const getSubGroupCount = (year: number, semester: number) => {
    let subGroupCount = 0;
    filteredStudentBatches
      .filter((b) => b.get().year === year && b.get().semester === semester)
      .forEach((b) => {
        b.get().groups.forEach((g: any) => {
          subGroupCount += g.subGroups.length;
        });
      });
    return subGroupCount;
  };

  useEffect(() => {
    const mainGroupData = {
      label: 'Main group',
      backgroundColor: 'blue',
      data: lables.map((l) => getMainGroupCount(l.year, l.semester)),
    };

    const subGroupData = {
      label: 'Sub group',
      backgroundColor: 'orange',
      data: lables.map((l) => getSubGroupCount(l.year, l.semester)),
    };

    setchartData({
      labels: lables.map((l) => l.lable),
      datasets: [mainGroupData, subGroupData],
    });
  }, [filteredStudentBatches]);

  return (
    <div>
      {selectedProgrammeId !== -1 ? (
        <div>
          <Bar
            data={chartData}
            options={{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
          <div>
            {console.log('labels : ', chartData)}
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  {lables.map((l) => (
                    <th>{l.lable}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Main Group</td>
                  {/* {[4, 5, 2, 5, 6, 4, 6, 7].map((x) => (
                    <td>{x}</td>
                  ))} */}

                  {chartData &&
                    chartData.datasets[0].data.map((d: any, i: number) => (
                      <td key={i}>{d}</td>
                    ))}
                </tr>
                <tr>
                  <td>Sub Group</td>
                  {chartData &&
                    chartData.datasets[1].data.map((d: any, i: number) => (
                      <td key={i}>{d}</td>
                    ))}
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          <Alert variant="warning">
            Please add programmes and student batches to view statistics
          </Alert>
        </div>
      )}
    </div>
  );
}
