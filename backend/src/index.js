import app from './app.js';
import { connectDB } from './db.js';


const port = 3000;

connectDB();
app.listen(port);
console.log(`Listening on port ${port}`);
