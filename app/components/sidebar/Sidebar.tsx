import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.css';
import {
  SideBarMenuItem,
  SideBarMenuItemList,
} from '../../constants/SideBarMenuItems';

const Title = (): JSX.Element => (
  <div className={styles.titleContainer}>
    <h5>ABC Timetable Management</h5>
  </div>
);

type SideBarMenuItemProp = {
  menuItem: SideBarMenuItem;
};
const SideBarMenuItemElement = (props: SideBarMenuItemProp): JSX.Element => {
  const { menuItem } = props;
  const [active, setActive] = useState(false);
  return (
    <div
      className={`${styles.sideBarMenuItemContainer} ${
        active ? styles.sideBarMenuItemActive : ''
      }`}
    >
      <Link to={menuItem.link}>
        <div
          className={styles.sideBarMenuItem}
          onClick={() => setActive(!active)}
          onKeyPress={() => {}}
          role="link"
          tabIndex={menuItem.index}
        >
          <span>{menuItem.content}</span>
        </div>
      </Link>
      {menuItem.childrenMenuItems && active && (
        <div className={styles.sideBarMenuItemChildWrapper}>
          {menuItem.childrenMenuItems.map((m) => (
            <SideBarMenuItemElement key={m.index} menuItem={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar(): JSX.Element {
  return (
    <div className={styles.sidebarContainer}>
      <Title />
      {SideBarMenuItemList.map((m) => (
        <SideBarMenuItemElement key={m.index} menuItem={m} />
      ))}
    </div>
  );
}
