import mongoose from 'mongoose';


function connectDatabase() {
    console.log(process.env.DB_URL); 
    mongoose.connect(process.env.DB_URL || '').then(
        () => { console.log("connected succesfully") }
    ).catch(err => {
        console.log(err);
    });   
}
async function disconnectDatabase() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
}
export {connectDatabase, disconnectDatabase};