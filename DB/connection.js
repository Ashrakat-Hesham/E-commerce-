import mongoose from 'mongoose'
const connectDB  = async ()=>{
    return await mongoose.connect(`mongodb://127.0.0.1:27017/EcommeceOnline`)
    .then(res=>console.log(`DB Connected successfully on .........`))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}


export default connectDB;