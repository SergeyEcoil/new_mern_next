import { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import socket from "../lib/socket";

const Home = () => {
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    // Инициализация соединения при монтировании компонента
    socket.on("connect", () => {
      console.log("Connected to server");

      // Запрос на загрузку заметок при подключении
      socket.emit("client:loadnotes");
    });

    // Очистка при размонтировании компонента
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <NoteForm currentNote={currentNote} setCurrentNote={setCurrentNote} />
      <NoteList setCurrentNote={setCurrentNote} />
    </div>
  );
};

export default Home;
