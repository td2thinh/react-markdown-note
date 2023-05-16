import { Row, Col, Button, Stack, Form, Card, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Tag, Note } from "../App";
import { useMemo, useState } from "react";
import ReactSelect from "react-select";
import styles from "../NoteList.modules.css?inline";

type NoteListProp = {
    availableTags: Tag[]
    notes: Note[]
    updateTag: (id: string, name: string) => void
    deleteTag: (id: string) => void
}

type EditTagsModalProps = {
    availableTags: Tag[],
    show: boolean,
    onHide: () => void
    updateTag: (id: string, name: string) => void
    deleteTag: (id: string) => void
}



export const NoteList = ({ availableTags, notes, deleteTag, updateTag }: NoteListProp) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [search, setSearch] = useState('')
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (search === "" || note.title.toLowerCase().includes(search) || note.markdown.toLowerCase().includes(search)) && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [search, selectedTags, notes])
    const [modalShow, setModalShow] = useState(false)

    return (<>
        <Row>
            <Col>
                <h1 className="mb-4">Notes</h1>
            </Col>
            <Col xs="auto">
                <Stack direction="horizontal" gap={2}>
                    <Link to="/new">
                        <Button variant="primary">New Note</Button>
                    </Link>
                    <Button variant="outline-secondary" onClick={() => setModalShow(true)}>
                        Edit Tags
                    </Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className="mb-4">
                <Col>
                    <Form.Group controlId="search">
                        <Form.Label>Search</Form.Label>
                        <Form.Control type="text" placeholder="Search"
                            value={search} onChange={
                                e => setSearch(e.target.value)
                            } />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect
                            value={selectedTags.map(tag => {
                                return {
                                    value: tag.id,
                                    label: tag.name
                                }
                            })}
                            options={availableTags.map(tag => {
                                return {
                                    value: tag.id,
                                    label: tag.name
                                }
                            })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return {
                                        id: tag.value,
                                        name: tag.label
                                    }
                                }))
                            }} isMulti />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {
                filteredNotes.map(note => {
                    return (
                        <Col key={note.id}>
                            <NoteCard id={note.id} title={note.title} tags={note.tags} markdown={note.markdown} />
                        </Col>
                    )
                })
            }
        </Row>
        <EditTagsModal show={modalShow} availableTags={availableTags} onHide={() => setModalShow(false)} deleteTag={deleteTag} updateTag={updateTag} />
    </>
    )
}

const NoteCard = ({ id, title, tags, markdown }: Note) => {
    if (markdown.length > 30) {
        markdown = markdown.substring(0, 30) + "..."
    }

    return (
        <Card as={Link} to={`${id}`} className={`h-100 text-reset text-decoration-none ${styles}`}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5">
                        {title}
                    </span>
                    <Card.Text className="text-truncate">
                        {markdown}
                    </Card.Text>
                    <Stack direction="horizontal" gap={2} className="justify-content-center flex-wrap">
                        {
                            tags.map(tag => {
                                return (
                                    <Badge className="text-truncate" key={tag.id}>
                                        {tag.name}
                                    </Badge>
                                )
                            })
                        }
                    </Stack>
                </Stack>
            </Card.Body>
        </Card >
    )
}

const EditTagsModal = ({ availableTags, show, onHide, deleteTag, updateTag }: EditTagsModalProps) => {
    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Tags</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Stack gap={2}>
                            {
                                availableTags.map(tag => {
                                    return (
                                        <Row key={tag.id}>
                                            <Col>
                                                <Form.Control type="text" defaultValue={tag.name} onChange={(e) => updateTag(tag.id, e.target.value)} />
                                            </Col>
                                            <Col xs="auto">
                                                <Button variant="outline-danger"
                                                    onClick={() => deleteTag(tag.id)}>
                                                    &times;
                                                </Button>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </Stack>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}