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
import Center from '../../../entity/Center';
import Faculty from '../../../entity/Faculty';
import Lecture from '../../../entity/Lecture';

const colors = ['blue', 'orange', 'grey', 'yellow'];

export default function LecturerCount() {
  const [chartData, setchartData] = useState({});
  const [facultyList, setfacultyList] = useState<Faculty[]>([]);
  const [centerList, setcenterList] = useState<Center[]>([]);
  const [lecturerList, setlecturerList] = useState<Lecture[]>([]);

  const faculties = new Map<string, number[]>();

  const loadFaculties = () => {
    Faculty.findAll()
      .then((result) => setfacultyList(result))
      .catch(() => console.log('Failed to load faculties.'));
  };

  const loadCenters = () => {
    Center.findAll()
      .then((result) => {
        setcenterList(result);
      })
      .catch(() => console.log('Failed to load centers.'));
  };

  const loadLectures = () => {
    Lecture.findAll({ include: [Faculty, Center] })
      .then((result) => {
        setlecturerList(result);
        return true;
      })
      .catch(() => console.log('Failed to load lecturers.'));
  };

  let i = 0;

  const centersNameList = centerList.map((c) => c.get().name);
  const facultiesNameList = facultyList.map((f) => f.get().name);

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
      labels: centersNameList,
      datasets: d,
    });
  };

  useEffect(() => {
    loadFaculties();
    loadCenters();
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
          {values.map((c) => (
            <td>{c}</td>
          ))}
        </tr>
      );
    });

    return trs.map((tr) => tr);
  };

  return (
    <div>
      {facultiesNameList.map((f) => {
        centersNameList.map((c) => {
          lecturerList.map((l) => {
            if (f === l.get().Faculty.name && c === l.get().Center.name) {
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
              {centersNameList.map((c) => (
                <th>{c}</th>
              ))}
            </tr>
          </thead>

          <tbody>{getTableLabelValues()}</tbody>
        </Table>
      </div>
    </div>
  );
}
