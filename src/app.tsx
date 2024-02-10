import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import NoteCard from "./components/note-card";

interface Note {
  id: string;
  content: string;
  date: Date;
}

export function App() {
  const [notes, setNotes] = useState<Note[]>(
    JSON.parse(localStorage.getItem("notes") || "[]")
  );
  const [search, setSearch] = useState("");

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes([newNote, ...notes]);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const newNotes = notes.filter((note) => note.id !== id);

    setNotes(newNotes);

    localStorage.setItem("notes", JSON.stringify(newNotes));
  }

  function handleSearch(note: ChangeEvent<HTMLInputElement>) {
    setSearch(note.target.value);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto bg-slate-900 w-full min-h-screen p-5 space-y-6 px-5 ">
      <img src={logo} alt="Logo do NLW Expert" width={200} />

      <form className="flex flex-col gap-4">
        <input
          type="text"
          className="bg-transparent outline-none text-3xl text-slate-200 w-full placeholder:text-slate-500"
          placeholder="Search in your notes..."
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-400"></div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6 ">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
