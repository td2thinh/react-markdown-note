import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./components/NewNote"
import { NoteList } from "./components/NoteList"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { v4 as uuidv4 } from 'uuid'
import { NoteLayout } from "./components/NoteLayout"
import { Note } from "./components/Note"
import { EditNote } from "./components/EditNote"

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawnoteData

export type RawnoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  name: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', [])
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {
        ...note,
        tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags])

  const createNote = ({ tags, ...data }: NoteData) => {
    setNotes(notes => {
      return [...notes, { ...data, id: uuidv4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  const addTag = (tag: Tag) => {
    setTags(tags => [...tags, tag])
  }

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes(notes => {
      return notes.map(note => {
        if (note.id !== id) {
          return note
        }

        return {
          ...note,
          ...data,
          tagIds: tags.map(tag => tag.id)
        }
      })
    })
  }

  const onDeleteNote = (id: string) => {
    setNotes(notes => {
      return notes.filter(note => note.id !== id)
    })
  }

  const updateTag = (id: string, name: string) => {
    setTags(tags => {
      return tags.map(tag => {
        if (tag.id !== id) {
          return tag
        }
        else {
          return {
            ...tag,
            name: name
          }
        }
      })
    })
  }

  const deleteTag = (id: string) => {
    setTags(tags => {
      return tags.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags} updateTag={updateTag} deleteTag={deleteTag} />} />
        <Route path="/new" element={<NewNote onSubmit={createNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
