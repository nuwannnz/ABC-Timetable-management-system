/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import styles from '../components/Statistics/Lecturer/Lecturer.css';
import LecturerCount from '../components/Statistics/Lecturer/LecturerCount';
import LecturerLevelCount from '../components/Statistics/Lecturer/LecturerLevel';

export default function LecturerStatistics() {
  return (
    <div>
      <h2>Lecturer Statistics</h2>
      <div className={styles.tabWrap}>
        <Tabs
          defaultActiveKey="home"
          transition={false}
          id="noanim-tab-example"
        >
          <Tab
            eventKey="home"
            title="Lecturer Count"
            tabClassName={styles.tabColor}
          >
            <h3 className={styles.center}> Lecturer Count</h3>
            <LecturerCount />
          </Tab>
          <Tab
            eventKey="level"
            title="Lecturer Level"
            tabClassName={styles.tabColor}
          >
            <h3 className={styles.center}> Lecturer Level Count</h3>
            <LecturerLevelCount />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
