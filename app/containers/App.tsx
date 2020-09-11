import React, { ReactNode, useCallback, useState, useEffect } from 'react';
import { connectToDb, getConnection } from '../utils/db';
import Subject from '../entity/Subject';
import Building from '../entity/Building';
import Room from '../entity/Room';
import Lecture from '../entity/Lecture';
import Faculty from '../entity/Faculty';
import Department from '../entity/Department';
import Center from '../entity/Center';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  useEffect(() => {
    connectToDb();
    const con = getConnection();
    Faculty.findAll();
    Department.findAll();
    Center.findAll();
    Building.findAll();
    Lecture.findAll();
    const sync = async () => {
      await con.sync({ force: true });
    };
    // sync();
  }, []);
  return <div className="app">{children}</div>;
}
