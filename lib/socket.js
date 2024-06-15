import { io } from "socket.io-client";

const socket = io({
  path: "/api/socket",
  transports: ["websocket", "polling"], // Ensure fallback to polling if necessary
});

export default socket;
