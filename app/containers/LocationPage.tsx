/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import AddBuildingForm from '../components/LocationPage/AddBuildingForm';
import AddRoomForm from '../components/LocationPage/AddRoomForm';
import BuildingList from '../components/LocationPage/BuildingList';
import RoomList from '../components/LocationPage/RoomList';
import Building from '../entity/Building';
import EditBuildingForm from '../components/LocationPage/EditBuildingForm';
import Room from '../entity/Room';
import EditRoomForm from '../components/LocationPage/EditRoomForm';
import ToastMsg from '../components/LocationPage/ToastMsg';

export const LocationPageContext = React.createContext({
  onDeleteBuildingHandler: (p: number) => {},
  onSelectBuildingHandler: (p: number) => {},
  selectedBuildingId: -1,
  onEditFormCancelHandler: () => {},
  onAddRoomHandler: () => {},
  onEditRoomClickHandler: (r: Room) => {},
  onDeleteRoomHandler: (r: number) => {},
});

export default function LocationPage() {
  const [buildingList, setbuildingList] = useState<Building[]>([]);
  const [buildingToUpdate, setbuildingToUpdate] = useState<Building | null>(
    null
  );
  const [roomList, setroomList] = useState<Room[]>([]);

  const [selectedBuilding, setselectedBuilding] = useState<number | null>(null);

  const [roomToUpdate, setroomToUpdate] = useState<Room | null>(null);

  const loadBuildings = () => {
    Building.findAll()
      .then((result) => setbuildingList([...result]))
      .catch((e) => console.log(e));
  };

  const onDeleteBuilding = (buildingId: number) => {
    if (confirm('Delete Permanatly?')) {
      Building.destroy({ where: { id: buildingId } })
        .then(() => loadBuildings())
        .catch(() => console.log('Fail to delete!'));
    }
  };

  const onSelectBuilding = (buildingId: number) => {
    if (selectedBuilding === buildingId) {
      setselectedBuilding(null);
      return;
    }
    setselectedBuilding(buildingId);
    setroomToUpdate(null);
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  const onAddBuilding = () => {
    loadBuildings();
  };

  const onEditBuilding = () => {
    loadBuildings();
    setbuildingToUpdate(null);
  };

  const onEditClick = (building: Building) => {
    setbuildingToUpdate(building);
  };

  const onEditFormCancel = () => {
    setbuildingToUpdate(null);
    setroomToUpdate(null);
  };

  const loadRooms = () => {
    Room.findAll({ where: { buildingId: selectedBuilding } })
      .then((result) => setroomList([...result]))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    loadRooms();
  }, [selectedBuilding]);

  const onAddRoom = () => {
    loadRooms();
  };

  const onEditRoomClick = (room: Room) => {
    setroomToUpdate(room);
  };

  const onEditRoom = () => {
    loadRooms();
    setroomToUpdate(null);
  };

  const onDeleteRoom = (rooomId: number) => {
    if (confirm('Delete Permanatly?')) {
      Room.destroy({ where: { id: rooomId } })
        .then(() => loadRooms())
        .catch(() => console.log('Fail to delete!'));
    }
  };

  return (
    <LocationPageContext.Provider
      value={{
        onDeleteBuildingHandler: onDeleteBuilding,
        onSelectBuildingHandler: onSelectBuilding,
        selectedBuildingId: selectedBuilding as any,
        onEditFormCancelHandler: onEditFormCancel,
        onAddRoomHandler: onAddRoom,
        onEditRoomClickHandler: onEditRoomClick,
        onDeleteRoomHandler: onDeleteRoom,
      }}
    >
      <div>
        <h2>Location</h2>

        <div className="d-flex justify-content-between flex-column">
          <div className="d-flex justify-content-between">
            {buildingToUpdate ? (
              <EditBuildingForm
                building={buildingToUpdate}
                onBuildingUpdate={onEditBuilding}
              />
            ) : (
              <AddBuildingForm onAddBuilding={onAddBuilding} />
            )}

            {/* {selectedBuilding && <AddRoomForm />} */}
            {roomToUpdate ? (
              <EditRoomForm room={roomToUpdate} onRoomUpdate={onEditRoom} />
            ) : selectedBuilding ? (
              <AddRoomForm />
            ) : null}
          </div>
          <div className="d-flex justify-content-between">
            <BuildingList
              buildingList={buildingList}
              onBuildingEdit={onEditClick}
            />
            {selectedBuilding && <RoomList roomList={roomList} />}
          </div>
        </div>
      </div>
    </LocationPageContext.Provider>
  );
}
