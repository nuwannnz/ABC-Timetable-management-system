/* eslint-disable no-plusplus */
import { stringify } from 'querystring';
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { values } from 'sequelize/types/lib/operators';
import Faculty from '../../../entity/Faculty';
import Lecture from '../../../entity/Lecture';

const colors = ['blue', 'orange', 'grey', 'yellow'];

export default function LecturerLevelCount() {
  const [chartData, setchartData] = useState({});
  const [facultyList, setfacultyList] = useState<Faculty[]>([]);
  const [lecturerList, setlecturerList] = useState<Lecture[]>([]);

  const faculties = new Map<string, number[]>();

  const loadFaculties = () => {
    Faculty.findAll()
      .then((result) => setfacultyList(result))
      .catch(() => console.log('Failed to load faculties.'));
  };

  const loadLectures = () => {
    Lecture.findAll({ include: [Faculty] })
      .then((result) => {
        setlecturerList(result);
        return true;
      })
      .catch(() => console.log('Failed to load lecturers.'));
  };

  let i = 0;

  const facultiesNameList = facultyList.map((f) => f.get().name);

  const LectureLevels = [
    { level: 1, name: 'Professor' },
    { level: 2, name: 'Assistant Professor' },
    { level: 3, name: 'Senior Lecture(HG)' },
    { level: 4, name: 'Senior Lecture' },
    { level: 5, name: 'Lecture' },
    { level: 6, name: 'Assistant Lecture' },
    { level: 7, name: 'Instructors' },
  ];

  const l: string[] = [];
  LectureLevels.map((level) => {
    l.push(level.name);
  });

  const data = () => {
    const d: any[] = [];
    let colorIndex = 0;

    faculties.forEach((value, key, m) => {
      d.push({
        label: key,
        data: value,
        backgroundColor: value.map((v) => colors[colorIndex]),
      });
      colorIndex += 1;
    });

    setchartData({
      labels: l,
      datasets: d,
    });
  };

  useEffect(() => {
    loadFaculties();
    loadLectures();

    setTimeout(() => {
      data();
    }, 1000);
  }, [chartData]);

  const getTableLabelValues = () => {
    const trs: any[] = [];
    faculties.forEach((values, key, m) => {
      trs.push(
        <tr>
          <td>{key}</td>
          {values.map((v) => (
            <td>{v}</td>
          ))}
        </tr>
      );
    });

    return trs.map((tr) => tr);
  };

  return (
    <div>
      {facultiesNameList.map((f) => {
        LectureLevels.map((level) => {
          lecturerList.map((l) => {
            if (f === l.get().Faculty.name && level.level === l.get().level) {
              i += 1;
            }
          });

          if (faculties.has(f)) {
            faculties.set(f, [...(faculties.get(f) as number[]), i]);
          } else {
            faculties.set(f, [i]);
          }

          i = 0;
        });
      })}

      <Bar data={chartData} />

      <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              {l.map((level) => (
                <th>{level}</th>
              ))}
            </tr>
          </thead>
          <tbody>{getTableLabelValues()}</tbody>
        </Table>
      </div>
    </div>
  );
}
