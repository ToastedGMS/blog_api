//server related imports
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const postRouter = require('./routes/postRoutes');
app.use('/posts', postRouter);
const commentRouter = require('./routes/commentRoutes');
app.use('/posts', commentRouter);
const likeRouter = require('./routes/likeRoutes');
app.use('/posts', likeRouter);
const tokenRouter = require('./routes/tokenRoutes');
app.use('/tokens', tokenRouter);
const userRouter = require('./routes/userRoutes');
app.use('/users', userRouter);

//server listener
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
