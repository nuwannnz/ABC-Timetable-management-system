/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import Lecture from '../entity/Lecture';
// eslint-disable-next-line import/no-cycle
import LectureDialog from '../components/lecture/LectureDialog';
import Faculty from '../entity/Faculty';
import Center from '../entity/Center';
import Department from '../entity/Department';
import Building from '../entity/Building';
import { formatLectureId } from '../utils/formatters';

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
  const [lectureToUpdate, setLecturetoUpdate] = useState<Lecture | null>(null);
  const [displayDialog, setDisplayDialog] = useState(false);

  const loadLectures = () => {
    Lecture.findAll({
      include: { all: true, nested: true },
    })
      .then((result) => {
        setLectureList(result);
        return true;
      })
      .catch(() => console.log('failed to load lectures'));
  };

  const handleLectureDialogSubmit = () => {
    setDisplayDialog(false);
    setLecturetoUpdate(null);
    loadLectures();
  };

  const deleteLectureHandler = (id: any) => {
    if (confirm('Delete this lecture permanantly?')) {
      Lecture.destroy({ where: { id } })
        .then(() => loadLectures())
        .catch(() => console.log('Failed to delete lecture'));
    }
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
      <Table striped bordered hover>
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
            <th>Rooms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lectureList.map((l: any) => (
            <tr key={l.id}>
              <td>{formatLectureId(l.id)}</td>
              <td>{`${l.level}.${formatLectureId(l.id)}`}</td>
              <td>{l.fName}</td>
              <td>{l.lName}</td>
              <td>
                {LectureLevels.find((level) => level.level === l.level)?.name}
              </td>
              <td>{l.Faculty.name}</td>
              <td>{l.Department.name}</td>
              <td>{l.Center.name}</td>
              <td>{l.Building.name}</td>
              <td>
                {l.get().Rooms.map((r: any) => (
                  <div key={r.get().id}>{r.get().name}</div>
                ))}
              </td>

              <td>
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    className="mr-1"
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setLecturetoUpdate(l);
                      setDisplayDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteLectureHandler(l.id)}
                  >
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
          closeClickHandler={() => {
            setDisplayDialog(false);
            setLecturetoUpdate(null);
          }}
          show={displayDialog}
          lecture={lectureToUpdate}
          onSubmit={handleLectureDialogSubmit}
        />
      )}
    </div>
  );
}
