import mongoose from "mongoose";

const connection: {isConnected: number} = {
  isConnected: 0,
};

const connect = async () => {
  if (connection.isConnected === 1) {
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    // If already connected, do not try to connect one more time
    if (connection.isConnected === 1) {
      return;
    }

    await mongoose.disconnect();
  }

  mongoose.set("strictQuery", false);
  const db = await mongoose.connect(process.env.MONGODB_URI as string, {
    autoIndex: true,

  });
  console.log("Database connected");
  connection.isConnected = db.connections[0].readyState;
};

const disconnect = async () => {
  if (connection.isConnected === 1) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = 0;
    }
  }
};

const db = {connect, disconnect};

export default db;
