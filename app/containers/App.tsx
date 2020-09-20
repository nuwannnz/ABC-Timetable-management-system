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
import Session from '../entity/Session';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  useEffect(() => {
    // lecture relationships
    Lecture.belongsTo(Faculty);
    Lecture.belongsTo(Department);
    Lecture.belongsTo(Center);
    Lecture.belongsTo(Building);
    Faculty.hasMany(Lecture);
    Department.hasMany(Lecture);
    Center.hasMany(Lecture);
    Building.hasMany(Lecture);

    // student batch relationships
    StudentBatch.belongsTo(Programme);
    Programme.hasMany(StudentBatch);

    // session relationships
    Session.belongsTo(Subject);
    Session.belongsTo(StudentBatch);
    Subject.hasMany(Session);
    StudentBatch.hasMany(Session);
    Lecture.belongsToMany(Session, { through: 'lecture_session' });
    Tag.belongsToMany(Session, { through: 'tag_session' });
    Session.belongsToMany(Lecture, { through: 'lecture_session' });
    Session.belongsToMany(Tag, { through: 'tag_session' });

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
    Session.findAll();
    const sync = async () => {
      await con.sync({ force: true });
      seedDB();
    };
    sync();
  }, []);
  return <div className="app">{children}</div>;
}
