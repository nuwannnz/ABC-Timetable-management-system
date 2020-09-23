/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import styles from '../components/Statistics/Lecturer/Lecturer.css';
import LecturerLevelCount from '../components/Statistics/Lecturer/LecturerLevel';
import StudentCount from '../components/Statistics/Student/StudentCount';

export default function StudentStatistics() {
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
            eventKey="level"
            title="Main and Sub Group Count"
            tabClassName={styles.tabColor}
          >
            <h3 className={styles.center}> Main and Sub Group Count</h3>
            <LecturerLevelCount />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
