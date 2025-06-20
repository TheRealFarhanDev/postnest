import express from 'express'
import userRoute from "./routes/user.routes.js"
import connectDB from './lib/connectDB.js';
import postRoute from "./routes/post.routes.js"
import commentRoute from "./routes/comment.routes.js"
import webhookRoute from "./routes/webhook.routes.js"
import { clerkMiddleware } from '@clerk/express'
import cors from "cors"
import bodyParser from 'body-parser';

const app = express();

app.use("/webhooks", bodyParser.raw({ type: "application/json" }));

app.use(cors({
  origin: 'https://postnest.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());
app.use("/webhooks", webhookRoute);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    message: err.message || "Something Went Wrong",
    status: err.status,
    stack: err.stack,
  }
  );
});


app.head("/ping", (req, res) => {
  res.status(200).end(); // No body for HEAD, just status
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome!');
});

app.listen(3000, () => {
  connectDB();
  console.log(`Server is running at https://postnest-zsmf.onrender.com/`);
})