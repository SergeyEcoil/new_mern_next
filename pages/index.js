import { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import socket from "../lib/socket";

const Home = ({ initialNotes }) => {
  const [currentNote, setCurrentNote] = useState(null);
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("server:loadnotes", (loadedNotes) => {
      setNotes(loadedNotes);
    });

    socket.on("server:newnote", (newNote) => {
      setNotes((prevNotes) => [...prevNotes, newNote]);
    });

    socket.on("server:selectednote", (note) => {
      setCurrentNote(note);
    });

    socket.on("server:updatenote", (updatedNote) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        )
      );
    });

    socket.on("server:deletenote", (id) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    });

    return () => {
      socket.off("connect");
      socket.off("server:loadnotes");
      socket.off("server:newnote");
      socket.off("server:selectednote");
      socket.off("server:updatenote");
      socket.off("server:deletenote");
    };
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <NoteForm currentNote={currentNote} setCurrentNote={setCurrentNote} />
      <NoteList
        notes={notes}
        setNotes={setNotes}
        setCurrentNote={setCurrentNote}
      />
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes`);
  const { data: initialNotes } = await res.json();

  return { props: { initialNotes } };
}

export default Home;
