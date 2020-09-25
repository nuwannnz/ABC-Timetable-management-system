import { count } from 'console';
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import { stringify } from 'querystring';
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import Faculty from '../../../entity/Faculty';
import Session from '../../../entity/Session';

const colors = ['blue', 'orange', 'red', 'yellow'];

export default function StudentCount() {
  const [chartData, setchartData] = useState({});

  const faculties = useRef(new Map<string, number>());

  const facultyName: string[] = [];

  const data = () => {
    const d: any[] = [];
    let colorIndex = 0;

    const c: number[] = [];

    faculties.current.forEach((v, k, m) => {
      c.push(v);

      facultyName.push(k);
    });
    d.push({
      label: 'Student Count',
      data: c,
      fill: false,
      pointRadius: 5,
      borderColor: '#aaa',
      backgroundColor: colors.slice(0, facultyName.length),
    });
    colorIndex += 1;

    const chardData = {
      labels: facultyName,
      datasets: d,
    };

    setchartData({
      labels: facultyName,
      datasets: d,
    });
  };

  const loadSessions = async () => {
    await Faculty.findAll().then(async (fa) => {
      await Session.findAll({ include: { all: true, nested: true } }).then(
        (s) => {
          fa.forEach((fac) => {
            s.forEach((ses) => {
              if (
                ses
                  .get()
                  .Lectures.some((l: any) => l.Faculty.id === fac.get().id)
              ) {
                if (faculties.current.has(fac.get().name)) {
                  faculties.current.set(
                    fac.get().name,
                    faculties.current.get(fac.get().name) +
                      ses.get().studentCount
                  );
                } else {
                  faculties.current.set(fac.get().name, ses.get().studentCount);
                }
              }
            });
          });

          data();
        }
      );
    });
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const getTableLabelValues = () => {
    const trs: any[] = [];
    faculties.current.forEach((values, key, m) => {
      trs.push(
        <tr>
          <th>{key}</th>
          <td>{values}</td>
        </tr>
      );
    });

    return trs.map((tr) => tr);
  };

  return (
    <div>
      <Line
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
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Student Count</th>

              {faculties.current.forEach((values, key, m) => {
                <th>{key}</th>;
              })}
            </tr>
          </thead>

          <tbody>{getTableLabelValues()}</tbody>
        </Table>
      </div>
    </div>
  );
}
