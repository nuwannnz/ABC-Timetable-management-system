/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable prefer-const */
import { v4 as uuidv4 } from 'uuid';
import Building from '../entity/Building';
import Center from '../entity/Center';
import Department from '../entity/Department';
import Faculty from '../entity/Faculty';
import Lecture from '../entity/Lecture';
import Programme from '../entity/Programme';
import Room from '../entity/Room';
import Session from '../entity/Session';
import StudentBatch from '../entity/StudentBatch';
/* eslint-disable import/prefer-default-export */
import Subject from '../entity/Subject';
import Tag from '../entity/Tag';

const subjectSeed = [
  {
    code: 'SPM',
    name: 'Sofware Project Management',
    lectureHours: 2,
    tutorialHours: 1,
    labHours: 2,
    evaluationHours: 3,
  },
  {
    code: 'DS',
    name: 'Database Systems',
    lectureHours: 2,
    tutorialHours: 2,
    labHours: 2,
    evaluationHours: 2,
  },
  {
    code: 'AF',
    name: 'Application Frameworks',
    lectureHours: 3,
    tutorialHours: 1,
    labHours: 2,
    evaluationHours: 4,
  },
  {
    code: 'MC',
    name: 'Maths for computing',
    lectureHours: 2,
    tutorialHours: 1,
    labHours: 0,
    evaluationHours: 2,
  },
  {
    code: 'MAD',
    name: 'Mobile Application Development',
    lectureHours: 1,
    tutorialHours: 1,
    labHours: 2,
    evaluationHours: 3,
  },
  {
    code: 'IP',
    name: 'Introduction to Programming',
    lectureHours: 2,
    tutorialHours: 1,
    labHours: 2,
    evaluationHours: 2,
  },
];

const buildingSeed = [
  {
    name: 'New building',
  },
  {
    name: 'A-block',
  },
  {
    name: 'B-block',
  },
  {
    name: 'Main building',
  },
  {
    name: 'Engineering building',
  },
];

const roomSeed = [
  {
    name: 'N3B',
    capacity: 50,
    BuildingId: 1,
  },
  {
    name: 'N3C',
    capacity: 100,
    BuildingId: 1,
  },
  {
    name: 'N3A',
    capacity: 100,
    BuildingId: 1,
  },
  {
    name: '405',
    capacity: 150,
    BuildingId: 2,
  },
  {
    name: '403',
    capacity: 150,
    BuildingId: 2,
  },
  {
    name: '404',
    capacity: 150,
    BuildingId: 2,
  },
  {
    name: '406',
    capacity: 150,
    BuildingId: 2,
  },
  {
    name: 'B406',
    capacity: 150,
    BuildingId: 3,
  },
  {
    name: 'B405',
    capacity: 100,
    BuildingId: 3,
  },
  {
    name: 'B402',
    capacity: 200,
    BuildingId: 3,
  },
  {
    name: 'M202',
    capacity: 150,
    BuildingId: 4,
  },
  {
    name: 'M203',
    capacity: 200,
    BuildingId: 4,
  },
  {
    name: 'E445',
    capacity: 200,
    BuildingId: 5,
  },
  {
    name: 'E193',
    capacity: 200,
    BuildingId: 5,
  },
];

const facultySeed = [
  {
    name: 'Computing',
  },
  {
    name: 'Engineering',
  },
  {
    name: 'Business',
  },
];

const departmentSeed = [
  {
    name: 'Information Technology',
  },
  {
    name: 'Software Engineering',
  },
  {
    name: 'Computer Science',
  },
  {
    name: 'Cyber Secuirity',
  },
  {
    name: 'Management',
  },
  {
    name: 'Finance',
  },
];

const centerSeed = [
  {
    name: 'Malabe',
  },
  {
    name: 'Matara',
  },
  {
    name: 'Kandy',
  },
  {
    name: 'Metro',
  },
];

const lectureSeed = [
  {
    fName: 'Nuwan',
    lName: 'Kodagoda',
    level: 3,
    FacultyId: 1,
    DepartmentId: 1,
    CenterId: 1,
    BuildingId: 1,
  },
  {
    fName: 'Saman',
    lName: 'Perera',
    level: 1,
    FacultyId: 1,
    DepartmentId: 2,
    CenterId: 1,
    BuildingId: 2,
  },
  {
    fName: 'Kamal',
    lName: 'Kumara',
    level: 3,
    FacultyId: 3,
    DepartmentId: 3,
    CenterId: 1,
    BuildingId: 1,
  },
  {
    fName: 'Dilani',
    lName: 'Perera',
    level: 5,
    FacultyId: 2,
    DepartmentId: 2,
    CenterId: 3,
    BuildingId: 3,
  },
  {
    fName: 'Dilki',
    lName: 'Perera',
    level: 7,
    FacultyId: 1,
    DepartmentId: 2,
    CenterId: 3,
    BuildingId: 3,
  },
  {
    fName: 'Sadun',
    lName: 'kamal',
    level: 6,
    FacultyId: 2,
    DepartmentId: 3,
    CenterId: 2,
    BuildingId: 1,
  },
  {
    fName: 'Kasun',
    lName: 'Piyal',
    level: 2,
    FacultyId: 1,
    DepartmentId: 1,
    CenterId: 1,
    BuildingId: 1,
  },
];

const programmeSeed = [
  {
    code: 'SE',
    name: 'Software Engineering',
  },
  {
    code: 'IT',
    name: 'Information Technology',
  },
  {
    code: 'CS',
    name: 'Cyber Secuirity',
  },
  {
    code: 'IST',
    name: 'Information Systems Technology',
  },
];

const tagSeed = [
  {
    name: 'lecture',
  },
  {
    name: 'tutorial',
  },
  {
    name: 'lab',
  },
];

const studentBatchSeed = [
  {
    year: 1,
    semester: 1,
    ProgrammeId: 1,
    groups: [
      {
        id: uuidv4(),
        groupNumber: 1,
        subGroups: [
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 1,
          },
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 2,
          },
        ],
      },
      {
        id: uuidv4(),
        groupNumber: 2,
        subGroups: [
          {
            id: uuidv4(),
            groupNumber: 2,
            subGroupNumber: 1,
          },
          {
            id: uuidv4(),
            groupNumber: 2,
            subGroupNumber: 2,
          },
        ],
      },
    ],
  },
  {
    year: 1,
    semester: 2,
    ProgrammeId: 2,
    groups: [
      {
        id: uuidv4(),
        groupNumber: 1,
        subGroups: [
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 1,
          },
        ],
      },
      {
        id: uuidv4(),
        groupNumber: 2,
        subGroups: [
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 2,
          },
        ],
      },
    ],
  },
  {
    year: 2,
    semester: 2,
    ProgrammeId: 3,
    groups: [
      {
        id: uuidv4(),
        groupNumber: 1,
        subGroups: [
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 1,
          },
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 2,
          },
        ],
      },
    ],
  },
  {
    year: 3,
    semester: 1,
    ProgrammeId: 2,
    groups: [
      {
        id: uuidv4(),
        groupNumber: 1,
        subGroups: [
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 1,
          },
          {
            id: uuidv4(),
            groupNumber: 1,
            subGroupNumber: 2,
          },
        ],
      },
    ],
  },
];

const sessionSeed = [
  {
    studentCount: 100,
    durationHours: 2,
    durationMinutes: 30,
    groupId: studentBatchSeed[0].groups[0].id,
    SubjectId: 1,
    StudentBatchId: 1,
  },
  {
    studentCount: 150,
    durationHours: 3,
    durationMinutes: 0,
    groupId: studentBatchSeed[1].groups[0].id,
    SubjectId: 3,
    StudentBatchId: 2,
  },
];

const seedSubjects = () => {
  subjectSeed.forEach((s) => {
    Subject.create({ ...s });
  });
};

const seedBuildings = () => {
  buildingSeed.forEach((b) => {
    Building.create({ ...b });
  });
};

const seedRooms = () => {
  roomSeed.forEach((r) => {
    Room.create({ ...r });
  });
};

const seedFaculties = () => {
  facultySeed.forEach((f) => {
    Faculty.create({ ...f });
  });
};

const seedDepartments = () => {
  departmentSeed.forEach((d) => {
    Department.create({ ...d });
  });
};

const seedCenters = () => {
  centerSeed.forEach((c) => {
    Center.create({ ...c });
  });
};

const seedLectures = () => {
  lectureSeed.forEach((l) => {
    Lecture.create({ ...l });
  });
};

const seedProgrammes = () => {
  programmeSeed.forEach((p) => {
    Programme.create({ ...p });
  });
};

const seedTags = () => {
  tagSeed.forEach((t) => {
    Tag.create({ ...t });
  });
};

const seedStudentBatches = () => {
  studentBatchSeed.forEach((s) => {
    StudentBatch.create({ ...s });
  });
};

const seedSessions = () => {
  let i = 1;
  sessionSeed.forEach((s) => {
    Session.create({ ...s })
      .then((createdSession) => {
        Lecture.findByPk(i).then((l) => {
          (createdSession as any).addLecture(l);
        });
        Lecture.findByPk(i + 1).then((l) => {
          (createdSession as any).addLecture(l);
        });

        Tag.findByPk(i).then((t) => {
          (createdSession as any).addTag(t);
        });

        Tag.findByPk(i + 1).then((t) => {
          (createdSession as any).addTag(t);
        });
        return true;
      })
      .catch((e) => {});
  });
};

export const seedDB = () => {
  seedSubjects();
  seedBuildings();
  seedRooms();
  seedFaculties();
  seedDepartments();
  seedCenters();
  seedLectures();
  seedProgrammes();
  seedTags();
  seedStudentBatches();
  seedSessions();
};
