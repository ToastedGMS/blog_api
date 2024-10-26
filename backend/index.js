//server related imports and variable declarations
const express = require('express');
const app = express();
const port = 3000;

//prisma related imports and variable declarations
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/', (req, res) => {
	res.json('Hello World');
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// exports
module.exports = { prisma };
