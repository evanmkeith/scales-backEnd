require('dotenv').config()

/* ====== External Modules  ====== */
// Required External Modules
// all required code that is not our own
const express = require('express');


/* ====== Internal Modules  ====== */
// Required Internal Modules
// all code that is our code


/* ====== Instanced Module  ====== */
// Create the Express app
const app = express();
const cors = require('cors');
const routes = require('./routes');
	
/* ====== Middleware  ====== */ 
//(app.use)
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

/* ====== System Variables  ====== */
const PORT = 4000; // full caps signify a config variable

/* ====== App Configuration  ====== */
// app.set


/* ====== Routes  ====== */
app.use("/api", routes);

app.all("/api/*", (req, res, next) => {
    res.send(
        "Api url endpoint not defined."
    );
})
	
/* ====== Server bind  ====== */
// bind the application to the port via app.listen(number, optional function to do after bind)
app.listen(PORT, function () {
	console.log(`Scales live on stage http://localhost:${PORT}`);
});