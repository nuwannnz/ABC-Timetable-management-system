import React, { ReactNode, useCallback, useState, useEffect } from 'react';
import { connectToDb, getConnection } from '../utils/db';
import Subject from '../entity/Subject';
import Building from '../entity/Building';
import Room from '../entity/Room';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  useEffect(() => {
    connectToDb();
    const con = getConnection();
    // con.sync({ force: true });
  }, []);
  return <div className="app">{children}</div>;
}
