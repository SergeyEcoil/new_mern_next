import { useState, useEffect } from "react";
import socket from "../lib/socket";

const NoteForm = ({ currentNote, setCurrentNote }) => {
  const [title, setTitle] = useState(currentNote ? currentNote.title : "");
  const [description, setDescription] = useState(
    currentNote ? currentNote.description : ""
  );

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setDescription(currentNote.description);
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentNote) {
      socket.emit("client:updatenote", {
        _id: currentNote._id,
        title,
        description,
      });
    } else {
      socket.emit("client:newnote", { title, description });
    }
    setTitle("");
    setDescription("");
    setCurrentNote(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      ></textarea>
      <button type="submit">{currentNote ? "Update" : "Create"}</button>
    </form>
  );
};

export default NoteForm;
