/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import styles from '../components/Statistics/Student/Student.css';
import GroupsCount from '../components/Statistics/Student/GroupsCount';
import StudentCount from '../components/Statistics/Student/StudentCount';
import Programme from '../entity/Programme';

export default function StudentStatistics() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<number>(-1);

  const loadProgrammes = async () => {
    const p = await Programme.findAll();
    setProgrammes([...p]);
    setSelectedProgrammeId(p.length > 0 ? p[0].get().id : null);
  };
  useEffect(() => {
    loadProgrammes();
  }, []);

  return (
    <div>
      <h2>Student Statistics</h2>
      <div className={styles.tabWrap}>
        <Tabs
          defaultActiveKey="home"
          transition={false}
          id="noanim-tab-example"
        >
          <Tab
            eventKey="home"
            title="Student Count"
            tabClassName={styles.tabColor}
          >
            <h3 className={styles.center}> Student Count</h3>
            <StudentCount />
          </Tab>
          <Tab
            eventKey="group"
            title="Main and Sub Group Count"
            tabClassName={styles.tabColor}
          >
            <div className={styles.progWrap}>
              <div className={styles.filtersWrap}>
                <Form inline>
                  <Form.Label
                    className="my-1 mr-2"
                    htmlFor="inlineFormCustomSelectPref"
                  >
                    Programme
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2"
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

            <h3 className={styles.center}> Main and Sub Group Count</h3>
            <GroupsCount selectedProgrammeId={selectedProgrammeId} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
