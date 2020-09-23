/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

export default function LecturerCountTest() {
  const [chartData, setchartData] = useState({});

  const facultyNameList = [
    'Computing',
    'Engineering',
    'Business',
    'Huminities & Sciences',
  ];
  const centerList = [
    'Malabe',
    'Matara',
    'Metro',
    'Kandy',
    'Kurunagala',
    'Jaffna',
  ];

  const lecturerList = [
    { id: 1, faculty: 'Computing', center: 'Malabe' },
    { id: 2, faculty: 'Engineering', center: 'Kandy' },
    { id: 3, faculty: 'Computing', center: 'Malabe' },
    { id: 4, faculty: 'Engineering', center: 'Malabe' },
    { id: 5, faculty: 'Huminities & Sciences', center: 'Malabe' },
    { id: 6, faculty: 'Computing', center: 'Kandy' },
    { id: 7, faculty: 'Engineering', center: 'Kandy' },
    { id: 8, faculty: 'Business', center: 'Malabe' },
    { id: 9, faculty: 'Huminities & Sciences', center: 'Kurunagala' },
    { id: 10, faculty: 'Business', center: 'Kurunagala' },
    { id: 11, faculty: 'Engineering', center: 'Kurunagala' },
    { id: 12, faculty: 'Business', center: 'Kurunagala' },
    { id: 13, faculty: 'Computing', center: 'Kurunagala' },
    { id: 14, faculty: 'Business', center: 'Kurunagala' },
    { id: 15, faculty: 'Business', center: 'Kurunagala' },
    { id: 16, faculty: 'Engineering', center: 'Kurunagala' },
    { id: 17, faculty: 'Business', center: 'Kurunagala' },
    { id: 18, faculty: 'Huminities & Sciences', center: 'Malabe' },
    { id: 19, faculty: 'Huminities & Sciences', center: 'Malabe' },
    { id: 20, faculty: 'Huminities & Sciences', center: 'Malabe' },
    { id: 21, faculty: 'Huminities & Sciences', center: 'Malabe' },
    { id: 22, faculty: 'Huminities & Sciences', center: 'Metro' },
    { id: 23, faculty: 'Huminities & Sciences', center: 'Jaffna' },
    { id: 24, faculty: 'Huminities & Sciences', center: 'Jaffna' },
    { id: 25, faculty: 'Business', center: 'Jaffna' },
    { id: 26, faculty: 'Business', center: 'Jaffna' },
    { id: 27, faculty: 'Business', center: 'Jaffna' },
    { id: 28, faculty: 'Engineering', center: 'Jaffna' },
    { id: 29, faculty: 'Computing', center: 'Jaffna' },
    { id: 30, faculty: 'Computing', center: 'Jaffna' },
    { id: 31, faculty: 'Business', center: 'Kandy' },
    { id: 32, faculty: 'Huminities & Sciences', center: 'Kandy' },
    { id: 33, faculty: 'Computing', center: 'Metro' },
    { id: 34, faculty: 'Business', center: 'Metro' },
    { id: 35, faculty: 'Huminities & Sciences', center: 'Metro' },
    { id: 36, faculty: 'Engineering', center: 'Metro' },
    { id: 37, faculty: 'Computing', center: 'Matara' },
    { id: 38, faculty: 'Computing', center: 'Matara' },
    { id: 39, faculty: 'Computing', center: 'Matara' },
    { id: 40, faculty: 'Engineering', center: 'Matara' },
    { id: 41, faculty: 'Business', center: 'Matara' },
    { id: 42, faculty: 'Business', center: 'Matara' },
  ];

  const computing: number[] = [];
  const engineering: number[] = [];
  const business: number[] = [];
  const science: number[] = [];
  let i = 0;

  const data = () => {
    setchartData({
      labels: centerList,
      datasets: [
        {
          label: 'Computing',
          data: computing,
          backgroundColor: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
        },
        {
          label: 'Engineering',
          data: engineering,
          backgroundColor: [
            'orange',
            'orange',
            'orange',
            'orange',
            'orange',
            'orange',
          ],
        },
        {
          label: 'Business',
          data: business,
          backgroundColor: ['gray', 'gray', 'gray', 'gray', 'gray', 'gray'],
        },
        {
          label: 'Huminities & Sciences',
          data: science,
          backgroundColor: [
            'yellow',
            'yellow',
            'yellow',
            'yellow',
            'yellow',
            'yellow',
          ],
        },
      ],
    });
  };

  useEffect(() => {
    data();
  }, []);

  return (
    <div>
      {facultyNameList.map((f) => {
        centerList.map((c) => {
          lecturerList.map((l) => {
            if (f === l.faculty && c === l.center) {
              i += 1;
            }
          });

          if (f === 'Computing') {
            computing.push(i);
          } else if (f === 'Engineering') {
            engineering.push(i);
          } else if (f === 'Business') {
            business.push(i);
          } else if (f === 'Huminities & Sciences') {
            science.push(i);
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
              {centerList.map((c) => (
                <th>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Computing</td>
              {computing.map((c) => (
                <td>{c}</td>
              ))}
            </tr>

            <tr>
              <td>Engineering</td>
              {engineering.map((e) => (
                <td>{e}</td>
              ))}
            </tr>
            <tr>
              <td>Business</td>
              {business.map((b) => (
                <td>{b}</td>
              ))}
            </tr>
            <tr>
              <td>Huminities &amp; Sciences </td>
              {science.map((s) => (
                <td>{s}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      </div>

      {console.log('Computing')}
      {console.log(
        computing.map((c) => {
          return c;
        })
      )}

      {console.log('Centers List')}
      {console.log(
        centerList.map((c) => {
          return c;
        })
      )}

      {console.log('Engineering')}
      {console.log(
        engineering.map((e) => {
          return e;
        })
      )}

      {console.log('Business')}
      {console.log(
        business.map((b) => {
          return b;
        })
      )}

      {console.log('Huminities & Sciences')}
      {console.log(
        science.map((s) => {
          return s;
        })
      )}
    </div>
  );
}
