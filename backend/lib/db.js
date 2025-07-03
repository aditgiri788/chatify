import mongoose from "mongoose";
//function to connect to db
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    await mongoose.connect(`${process.env.MONGO_URI}/quick-chat`);
  } catch (error) {
    console.log(error);
  }
};

//simgjple conncecton methode

// export const db = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//   } catch (error) {
//     console.log(error);
//   }
// };
