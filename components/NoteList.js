import { useEffect } from "react";
import socket from "../lib/socket";

const NoteList = ({ notes, setNotes, setCurrentNote }) => {
  useEffect(() => {
    socket.on("server:loadnotes", (loadedNotes) => {
      setNotes(loadedNotes);
    });

    return () => {
      socket.off("server:loadnotes");
    };
  }, [setNotes]);

  const handleDelete = (id) => {
    socket.emit("client:deletenote", id);
  };

  return (
    <div>
      {notes.map((note) => (
        <div
          key={note._id}
          className="card animate__animated animate__fadeInRight"
        >
          <h2>{note.title}</h2>
          <p>{note.description}</p>
          <div className="card-buttons">
            <button className="update" onClick={() => setCurrentNote(note)}>
              Edit
            </button>
            <button className="delete" onClick={() => handleDelete(note._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
