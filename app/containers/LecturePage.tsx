import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import Lecture from '../entity/Lecture';
// eslint-disable-next-line import/no-cycle
import LectureDialog from '../components/lecture/LectureDialog';

export const LectureLevels = [
  { level: 1, name: 'Professor' },
  { level: 2, name: 'Assistant Professor' },
  { level: 3, name: 'Senior Lecture(HG)' },
  { level: 4, name: 'Senior Lecture' },
  { level: 5, name: 'Lecture' },
  { level: 6, name: 'Assistant Lecture' },
  { level: 7, name: 'Instructors' },
];

export default function LecturePage() {
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [displayDialog, setDisplayDialog] = useState(false);

  const loadLectures = () => {
    Lecture.findAll()
      .then((result) => setLectureList(result))
      .catch(() => console.log('failed to load lectures'));
  };

  useEffect(() => {
    loadLectures();
  }, []);

  return (
    <div className="d-flex flex-column">
      <div className="d-flex align-items-center mb-3">
        <h2>Lecture page</h2>
        <Button
          className="ml-3"
          size="sm"
          onClick={() => setDisplayDialog(true)}
        >
          Add new lecture
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Emp no</th>
            <th>Rank</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Level</th>
            <th>Faculty</th>
            <th>Department</th>
            <th>Center</th>
            <th>Building</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lectureList.map((l: any) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.rank}</td>
              <td>{l.fName}</td>
              <td>{l.lName}</td>
              <td>{l.level}</td>
              <td>{l.faculty}</td>
              <td>{l.department}</td>
              <td>{l.center}</td>
              <td>{l.building}</td>
              <td>
                <div className="d-flex justify-content-center align-items-center">
                  <Button className="mr-1" variant="info" size="sm">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {displayDialog && (
        <LectureDialog
          closeClickHandler={() => setDisplayDialog(false)}
          show={displayDialog}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
}
