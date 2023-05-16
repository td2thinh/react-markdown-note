import { FormEvent, useRef, useState } from 'react'
import { Form, Row, Col, Stack, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CreatableReactSelect from 'react-select/creatable'
import { NoteData, Tag } from '../App'
import { v4 as uuidv4 } from 'uuid'

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

export const NoteForm = ({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [] }: NoteFormProps) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selecetedTags, setSelectedTags] = useState<Tag[]>(tags)
    const [validated, setValidated] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent) => {
        const form = e.currentTarget as HTMLFormElement
        if (form.checkValidity() === false) {
            e.stopPropagation()
            e.preventDefault()

        }
        else {
            onSubmit({
                title: titleRef.current!.value,
                markdown: markdownRef.current!.value,
                tags: selecetedTags
            })
            navigate('..')
        }
        setValidated(true)
    }

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required type='text' placeholder='Title' defaultValue={title} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a title.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect
                                onCreateOption={label => {
                                    const newTag = {
                                        id: uuidv4(),
                                        name: label
                                    }
                                    onAddTag(newTag)
                                    setSelectedTags(tags => [...tags, newTag])
                                }}
                                value={selecetedTags.map(tag => {
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
                <Form.Group controlId='markdown'>
                    <Form.Label>Content</Form.Label>
                    <Form.Control ref={markdownRef} required as="textarea" type='text' rows={15} placeholder='Content' defaultValue={markdown} />
                    <Form.Control.Feedback type="invalid">
                        Please provide a content.
                    </Form.Control.Feedback>
                </Form.Group>
            </Stack>
            <Stack direction='horizontal' gap={2} className='mt-4 justify-content-end'>
                <Button type="submit" variant='primary'>Save</Button>
                <Link to='..'>
                    <Button type="button" variant='outline-secondary'>Cancel
                    </Button>
                </Link>
            </Stack >
        </Form >
    )
}