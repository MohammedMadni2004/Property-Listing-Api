import mongoose from 'mongoose';


function connectDatabse() {
    console.log(process.env.DB_URL); 
    mongoose.connect(process.env.DB_URL || '').then(
        () => { console.log("connected succesfully") }
    ).catch(err => {
        console.log(err);
    });   
}

export default connectDatabse;