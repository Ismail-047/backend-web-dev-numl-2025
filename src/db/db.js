import mongoose from "mongoose"

const connectDatabase = async () => {
   try {
      await mongoose.connect(process.env.DATABASE_URI);
      console.log("Database Connected Successfully!");
   } catch (error) {
      console.error("Error Connecting Database " + error);
   }
}
export default connectDatabase;