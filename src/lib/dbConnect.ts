import mongoose from "mongoose"


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to Database")
        return
    }
    try {
        const db = await mongoose.connect(process.env.DBURI || ' ', {})

        connection.isConnected = db.connections[0].readyState
        console.log("╔══════════════════════════════╗")
        console.log("║   🟢 DATABASE CONNECTED      ║")
        console.log("║   🍃 MongoDB is ready!       ║")
        console.log("╚══════════════════════════════╝")
    } catch (error) {
        console.error("Error connecting to Database:", error)
        process.exit(1)
    }
} 

export default dbConnect