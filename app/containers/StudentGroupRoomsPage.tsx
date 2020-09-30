/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Table } from 'react-bootstrap';
import {
  GroupType,
  SubGroupType,
} from '../components/student-batch/StudentBatchDialog';
import StudentBatchRoomsDialog, {
  GroupEditPara,
} from '../components/student-batch/StudentBatchRoomsDialog';
import Programme from '../entity/Programme';
import Room from '../entity/Room';
import StudentBatch from '../entity/StudentBatch';
import Tag from '../entity/Tag';
import {
  defaultPreferedRoomsState,
  getPreferedRoomsState,
  PreferedRoomsType,
  savePreferedRoomsState,
} from '../utils/preferedRoomsDB';

type GroupRoomCardType = {
  label: string;
  groupId: string;
  rooms: string[];
  roomIds: number[];
};

export default function StudentGroupRoomsPage() {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [groupToUpdate, setGroupToUpdate] = useState<GroupEditPara | null>(
    null
  );
  const [currentGroups, setcurrentGroups] = useState<PreferedRoomsType>(
    defaultPreferedRoomsState
  );
  const [groupCardList, setGroupCardList] = useState<GroupRoomCardType[]>([]);

  const getBatchAndGroupOfGroup = (
    groups: StudentBatch[],
    gId: string
  ): { b: StudentBatch; g: GroupType | SubGroupType; isSubGroup: boolean } => {
    let batch = null;
    let group = null;
    let isSubGroup = false;
    for (let i = 0; i < groups.length; i++) {
      const b = groups[i];
      const matchingGroup = b.get().groups.find((g: any) => g.id === gId);
      if (matchingGroup) {
        batch = b;
        group = matchingGroup;
        break;
      } else {
        let allSubgroups: any[] = [];
        b.get().groups.forEach((g: any) => {
          allSubgroups = [...allSubgroups, ...g.subGroups];
        });
        const matchingSubGroup = allSubgroups.find((g) => g.id === gId);
        if (matchingSubGroup) {
          batch = b;
          group = matchingSubGroup;
          isSubGroup = true;
          break;
        }
      }
    }
    return { b: batch as StudentBatch, g: group, isSubGroup };
  };
  const loadCards = async () => {
    const groups = await StudentBatch.findAll({ include: Programme });
    const rooms = await Room.findAll();

    const card: GroupRoomCardType[] = [];
    currentGroups.groupRooms.forEach((gr) => {
      const batchInfo = getBatchAndGroupOfGroup(groups, gr.groupId);

      card.push({
        groupId: gr.groupId,
        label: `Y${batchInfo.b.get().year}.S${batchInfo.b.get().semester}.${
          batchInfo.b.get().Programme.code
        }.${batchInfo.g.groupNumber}${
          batchInfo.isSubGroup
            ? `.${(batchInfo.g as SubGroupType).subGroupNumber}`
            : ''
        }`,
        rooms: rooms
          .filter((room) => gr.roomId.includes(room.get().id))
          .map((r) => `${r.get().name}(${r.get().capacity})`),
        roomIds: rooms
          .filter((room) => gr.roomId.includes(room.get().id))
          .map((r) => r.get().id),
      });
    });
    setGroupCardList([...card]);
  };

  const loadGroups = () => {
    setcurrentGroups({ ...getPreferedRoomsState() });
  };

  useEffect(() => {
    console.log('loading groups');

    if (currentGroups.groupRooms.length > 0) {
      loadCards();
    }
  }, [currentGroups]);

  useEffect(() => {
    loadGroups();
  }, []);

  const handleGroupRoomDeleteClick = (groupId: string) => {
    if (confirm('Remove prefered rooms related to this group permanently?')) {
      currentGroups.groupRooms = currentGroups.groupRooms.filter(
        (gr) => gr.groupId !== groupId
      );
      savePreferedRoomsState(currentGroups);
      loadGroups();
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);
  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Prefered Group Rooms</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
          Add Prefered Rooms
        </Button>
      </div>

      {groupCardList.map((c) => (
        <Card key={c.groupId} className="mb-3">
          <Card.Header>{c.label}</Card.Header>
          <Card.Body>
            <div className="d-flex mt-2">
              {c.rooms.map((r: any, i) => (
                <h6 key={i}>
                  <Badge className="mr-2" variant="info">
                    {r}
                  </Badge>
                </h6>
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="d-flex float-right">
              <Button
                className="mr-1"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setGroupToUpdate({ groupId: c.groupId, roomIds: c.roomIds });
                  setDisplayDialog(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleGroupRoomDeleteClick(c.groupId)}
              >
                Delete
              </Button>
            </div>
          </Card.Footer>
        </Card>
      ))}

      {displayDialog && (
        <StudentBatchRoomsDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setGroupToUpdate(null);
          }}
          onSubmit={() => {
            setDisplayDialog(false);
            loadGroups();
          }}
          group={groupToUpdate}
        />
      )}
    </div>
  );
}
