import mongoose from "mongoose";

let connection: {isConnected: number};

const connect = async () => {
  if (connection.isConnected) {
    console.log("Already connected!");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log("Already connected");
      return;
    }

    await mongoose.disconnect();
  }

  const db = await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Database connected");
  connection.isConnected = db.connections[0].readyState;
};

const db = {connect};

export default db;
