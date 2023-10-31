import mongoose from 'mongoose'
const connectDb = async (DATABASE_URL)=>{
    try {
        const DB_OPTION = {
            dbName:"chatfeature"
        }

        await mongoose.connect(DATABASE_URL,DB_OPTION)
        console.log("successfully connected")
    }catch(error) {
        console.log("error")
    }
}

export default connectDb

