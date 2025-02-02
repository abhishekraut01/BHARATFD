import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Database connection is successful on host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Error while connecting to the database: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnection;
