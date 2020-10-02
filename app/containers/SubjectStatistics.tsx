/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import styles from '../components/Statistics/Subject/Subject.css';
import Programme from '../entity/Programme';
import SessionCount from '../components/Statistics/Subject/SessionCount';
import SubjectTotalDuration from '../components/Statistics/Subject/SubjectTotalDuration';
import StudentBatch from '../entity/StudentBatch';

export default function SubjectStatistics() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [yearSem, setYearSem] = useState<StudentBatch[]>([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<number>(-1);
  const [selectedYearSem, setSelectedYearSem] = useState<string>('');

  const loadProgrammes = async () => {
    const p = await Programme.findAll();
    setProgrammes([...p]);
    setSelectedProgrammeId(p.length > 0 ? p[0].get().id : null);
  };

  const loadBatches = async () => {
    const b = await StudentBatch.findAll();
    setYearSem([...b]);
    setSelectedYearSem(
      b.length > 0 ? `Y${b[0].get().year}S${b[0].get().semester}` : ''
    );
  };

  useEffect(() => {
    loadProgrammes();
    loadBatches();
  }, []);

  return (
    <div>
      <h2>Subject Statistics</h2>
      <div className={styles.tabWrap}>
        <Tabs
          defaultActiveKey="home"
          transition={false}
          id="noanim-tab-example"
        >
          {/* <Tab
            eventKey="home"
            title="Session Count"
            tabClassName={styles.tabColor}
          >
            <h3 className={styles.center}> Session Count</h3>
            <SessionCount />
          </Tab> */}
          <Tab
            eventKey="home"
            title="Subject Total Duration"
            tabClassName={styles.tabColor}
          >
            <div className={styles.progWrap}>
              <div className={styles.filtersWrap}>
                <Form inline>
                  <Form.Label
                    className="my-1 mr-1"
                    htmlFor="inlineFormCustomSelectPref"
                  >
                    Year &amp; Semester
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2"
                    id="inlineFormCustomSelectPref"
                    value={selectedYearSem ? selectedYearSem : ''}
                    onChange={(e) => setSelectedYearSem(e.target.value)}
                    custom
                  >
                    {yearSem.map((y: any) => (
                      <option
                        key={y.id}
                        value={`Y${y.get().year}S${y.get().semester}`}
                      >
                        {`Y${y.get().year}S${y.get().semester}`}
                      </option>
                    ))}
                    {console.log('selectedYearSem:', selectedYearSem)}
                  </Form.Control>
                </Form>
                <Form inline>
                  <Form.Label
                    className="my-1 mr-1"
                    htmlFor="inlineFormCustomSelectPref"
                  >
                    Programme
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-1"
                    id="inlineFormCustomSelectPref"
                    value={selectedProgrammeId ? selectedProgrammeId : -1}
                    onChange={(e) =>
                      setSelectedProgrammeId(parseInt(e.target.value, 10))
                    }
                    custom
                  >
                    {programmes.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form>
              </div>
            </div>

            <h3 className={styles.center}> Subject Total Duration</h3>
            <SubjectTotalDuration
              selectedProgrammeId={selectedProgrammeId}
              selectedYearSem={selectedYearSem}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
