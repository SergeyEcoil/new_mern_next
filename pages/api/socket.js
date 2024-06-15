import { Server } from "socket.io";
import connectToDatabase from "../../lib/mongodb";
import Note from "../../models/Note";

const SocketHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    await connectToDatabase(); // Подключаемся к базе данных при инициализации сокета

    io.on("connection", (socket) => {
      console.log("New client connected");

      const emitNotes = async () => {
        const notes = await Note.find();
        io.emit("server:loadnotes", notes);
      };

      emitNotes();

      socket.on("client:newnote", async (data) => {
        const newNote = new Note(data);
        const savedNote = await newNote.save();
        io.emit("server:newnote", savedNote);
      });

      socket.on("client:deletenote", async (id) => {
        await Note.findByIdAndDelete(id);
        emitNotes();
      });

      socket.on("client:getnote", async (id) => {
        const note = await Note.findById(id);
        io.emit("server:selectednote", note);
      });

      socket.on("client:updatenote", async (updatedNote) => {
        await Note.findByIdAndUpdate(updatedNote._id, {
          title: updatedNote.title,
          description: updatedNote.description,
        });
        emitNotes();
      });
    });
  }
  res.end();
};

export default SocketHandler;
