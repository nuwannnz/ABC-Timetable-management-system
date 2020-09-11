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

export const LocationPageContext = React.createContext({
  onDeleteBuildingHandler: (p: number) => {},
});

export default function LocationPage() {
  const [buildingList, setbuildingList] = useState<Building[]>([]);
  const [buildingToUpdate, setbuildingToUpdate] = useState<Building | null>(
    null
  );

  const loadBuildings = () => {
    Building.findAll()
      .then((result) => setbuildingList([...result]))
      .catch((e) => console.log(e));
  };

  const onDeleteBuilding = (buildingId: number) => {
    if (confirm('Delete Permanatly?')) {
      Building.destroy({ where: { id: buildingId } })
        .then(() => loadBuildings())
        .catch(() => alert('Fail to delete'));
    }
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

  return (
    <LocationPageContext.Provider
      value={{
        onDeleteBuildingHandler: onDeleteBuilding,
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

            <AddRoomForm />
          </div>
          <div className="d-flex justify-content-between">
            <BuildingList
              buildingList={buildingList}
              onBuildingEdit={onEditClick}
            />
            <RoomList />
          </div>
        </div>
      </div>
    </LocationPageContext.Provider>
  );
}
