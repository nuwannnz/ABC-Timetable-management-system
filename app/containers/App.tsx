import React, { ReactNode, useCallback, useState, useEffect } from 'react';
import { connectToDb, getConnection } from '../utils/db';
import Subject from '../entity/Subject';
import Building from '../entity/Building';
import Room from '../entity/Room';
import Faculty from '../entity/Faculty';
import Department from '../entity/Department';
import Center from '../entity/Center';
import Lecture from '../entity/Lecture';
import Tag from '../entity/Tag';
import StudentBatch from '../entity/StudentBatch';
import Programme from '../entity/Programme';
import { seedDB } from '../utils/seed';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  useEffect(() => {
    Lecture.belongsTo(Faculty);
    Lecture.belongsTo(Department);
    Lecture.belongsTo(Center);
    Lecture.belongsTo(Building);
    StudentBatch.belongsTo(Programme);

    Faculty.hasMany(Lecture);
    Department.hasMany(Lecture);
    Center.hasMany(Lecture);
    Building.hasMany(Lecture);
    Programme.hasMany(StudentBatch);

    connectToDb();
    const con = getConnection();
    Tag.findAll();
    Faculty.findAll();
    Department.findAll();
    Center.findAll();
    Building.findAll();
    Lecture.findAll();
    Programme.findAll();
    StudentBatch.findAll();
    const sync = async () => {
      await con.sync({ force: true });
      seedDB();
    };
    sync();
  }, []);
  return <div className="app">{children}</div>;
}
