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
// no comment route file was created due to overlapping route parameters in nested routers.
// instead comment routes were placed in post route file, separating only the controller file.
const tokenRouter = require('./routes/tokenRoutes');
app.use('/tokens', tokenRouter);
const userRouter = require('./routes/userRoutes');
app.use('/users', userRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
