/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Table } from 'react-bootstrap';
import TagRoomDialog from '../components/tag/TagRoomDialog';
import Room from '../entity/Room';
import Tag from '../entity/Tag';

export default function TagRoomsPage() {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [tagToUpdate, setTagToUpdate] = useState<Tag | null>(null);

  const loadTags = async () => {
    const tags = await Tag.findAll({ include: Room });
    setTagList([...tags]);
  };

  const handleTagDeleteClick = (tag: Tag) => {
    if (confirm('Remove all rooms related  to this tag?')) {
      (async () => {
        await (tag as any).removeRooms(tag.get().Rooms);
        loadTags();
      })();
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const createTagLabel = (tagName: string): string => {
    if (!tagName) {
      return '';
    }
    const tagLabel = `${tagName.charAt(0).toUpperCase()}${tagName.slice(1)}`;
    return tagLabel;
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Prefered Tags Rooms</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
          Add Prefered Tag Rooms
        </Button>
      </div>

      <div className="d-flex flex-column">
        {tagList
          .filter((t) => t.get().Rooms.length > 0)
          .map((t) => (
            <Card key={t.get().id} className="mr-3 mb-3">
              <Card.Header>
                <h3>
                  <Badge variant="warning">
                    {createTagLabel(t.get().name)}
                  </Badge>
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="d-flex mt-2">
                  {t.get().Rooms.map((r: any) => (
                    <h6 key={r.get().id}>
                      <Badge className="mr-2" variant="info">
                        {r.get().name}
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
              </Card.Footer>
            </Card>
          ))}
      </div>
      {displayDialog && (
        <TagRoomDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setTagToUpdate(null);
          }}
          onSubmit={() => {
            setDisplayDialog(false);
            loadTags();
          }}
          tag={tagToUpdate}
        />
      )}
    </div>
  );
}
