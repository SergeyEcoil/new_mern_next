import { useEffect, useState } from "react";
import socket from "../lib/socket";

const NoteList = ({ setCurrentNote }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    socket.on("server:loadnotes", (notes) => {
      setNotes(notes);
    });

    socket.on("server:newnote", (note) => {
      setNotes((prevNotes) => [...prevNotes, note]);
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
      socket.off("server:loadnotes");
      socket.off("server:newnote");
      socket.off("server:selectednote");
      socket.off("server:updatenote");
      socket.off("server:deletenote");
    };
  }, [setCurrentNote]);

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
