import routes from './routes.json';

export type SideBarMenuItem = {
  index: number;
  content: string;
  link: string;
  childrenMenuItems?: SideBarMenuItem[];
  rootLevelContent?: string;
};

export const SideBarMenuItemList: SideBarMenuItem[] = [
  {
    index: 1,
    content: 'Lectures',
    link: routes.LECTURE,
  },
  {
    index: 2,
    content: 'Subjects',
    link: routes.SUBJECT,
    rootLevelContent: 'Subject section',
    childrenMenuItems: [
      {
        index: 22,
        content: 'Prefered Subject Rooms',
        link: routes.SUBJECT_ROOMS,
      },
    ],
  },
  {
    index: 3,
    content: 'Locations',
    link: routes.LOCATION,
  },
  {
    index: 4,
    content: 'Working days',
    link: routes.WORKING_DAYS,
  },
  {
    index: 5,
    content: 'Students',
    link: routes.STUDENT_BATCHES,
    rootLevelContent: 'Student section',
    childrenMenuItems: [
      {
        index: 21,
        content: 'Prefered Group Rooms',
        link: routes.STUDENT_GROUP_ROOMS,
      },
    ],
  },
  {
    index: 6,
    content: 'Lecture statistics',
    link: routes.STATISTICS_LECTURE,
    rootLevelContent: 'Statistics section',
    childrenMenuItems: [
      {
        index: 8,
        content: 'Subject statistics',
        link: routes.STATISTICS_SUBJECT,
      },
      {
        index: 9,
        content: 'Student statistics',
        link: routes.STATISTICS_STUDENT,
      },
    ],
  },
  {
    index: 10,
    content: 'Tags',
    link: routes.TAGS,
    rootLevelContent: 'Tag section',
    childrenMenuItems: [
      {
        index: 20,
        content: 'Prefered Rooms',
        link: routes.TAGS_ROOMS,
      },
    ],
  },
  {
    index: 11,
    content: 'Programmes',
    link: routes.PROGRAMMES,
  },
  {
    index: 12,
    content: 'Sessions',
    rootLevelContent: 'Session section',
    link: routes.SESSIONS,
    childrenMenuItems: [
      {
        index: 14,
        content: 'Consecutive Sessions',
        link: routes.CONSECUTIVE_SESSIONS,
      },
      {
        index: 15,
        content: 'Parrerall Sessions',
        link: routes.PARALLEL_SESSIONS,
      },
    ],
  },
  {
    index: 24,
    content: 'Not Availble Time',
    link: routes.NOT_AVAILABLE_TIME,
  },
  {
    index: 25,
    content: 'Timetables',
    link: routes.NOT_AVAILABLE_TIME,
  },
];
