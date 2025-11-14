import { Server } from "socket.io";

let ioRef: Server | null = null;

export function attachSocketHandlers(io: Server) {
  ioRef = io;
  io.on("connection", (socket) => {
    socket.on("join-order", (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on("leave-order", (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on("disconnect", () => {});
  });
}

export function emitOrderUpdate(orderId: string, data: any) {
  ioRef?.to(`order:${orderId}`).emit("order:update", data);
}
