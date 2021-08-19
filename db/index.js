import mongoose from "mongoose";
import chalk from "chalk";

export const db = async () => {
  const dbUrl = process.env.DB_URL ;
  try {
    const connectMongoose = await mongoose.connect( dbUrl,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    if (!connectMongoose) {
      console.log(chalk.red("Database failed to connect"));
    }
    console.log(chalk.yellow("Database Connected correctly"));
  } catch (err) {
    console.log("error occur");
    console.log(err);
  }
};
