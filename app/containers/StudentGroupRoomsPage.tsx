/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import TagDialog from '../components/tag/TagDialog';
import Tag from '../entity/Tag';

export default function StudentGroupRoomsPage() {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [tagToUpdate, setTagToUpdate] = useState<Tag | null>(null);

  const loadTags = async () => {
    const tags = await Tag.findAll();
    setTagList([...tags]);
  };

  const handleTagDialogSubmit = (tag: Tag) => {
    if ((tag as any).id) {
      // update
      Tag.update({ ...tag }, { where: { id: (tag as any).id } })
        .then(() => {
          setDisplayDialog(false);
          setTagToUpdate(null);
          loadTags();
          return true;
        })
        .catch((e) => console.log(e));
    } else {
      // create
      Tag.create({ ...tag })
        .then(() => {
          loadTags();
          setDisplayDialog(false);
          return true;
        })
        .catch((e) => console.log(e));
    }
  };

  const handleTagDeleteClick = (tag: Tag) => {
    if (confirm('Delete this tag permanently?')) {
      Tag.destroy({ where: { id: (tag as any).id } })
        .then(() => loadTags())
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    loadTags();
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
          Add new tag
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Tag name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tagList.map((t: any) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    className="mr-1"
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setTagToUpdate(t);
                      setDisplayDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleTagDeleteClick(t)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {displayDialog && (
        <TagDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setTagToUpdate(null);
          }}
          onSubmit={handleTagDialogSubmit}
          tag={tagToUpdate}
        />
      )}
    </div>
  );
}
