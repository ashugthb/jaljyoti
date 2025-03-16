import mongoose from 'mongoose';

// Opens a connection to the provided URL
export const openConnection = async (url) => {
    try {
        const conn = await mongoose.connect(url);
        return conn;
    } catch (error) {
        console.error('Error in openConnection:', error);
        throw error;
    }
};

// Connects to the MongoDB using the NEXT_PUBLIC_BASE_MONGO_URL environment variable
export const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return conn;
    } catch (error) {
        console.error('Error in connect:', error);
        throw error;
    }
};

/************************************** */

// Closes the given connection. If closing fails, it throws an error.
export const closeConnection = async (conn) => {
    try {
        await conn.close();
        if (conn.readyState !== 0) { // 0 means disconnected
            throw new Error('Failed to close mongoose connection');
        }
        // console.log('Mongoose connection closed');
    } catch (err) {
        console.error(`Error closing mongoose connection: ${err}`);
        // Instead of recursive calls (which may lead to an infinite loop), rethrow the error.
        throw err;
    }
};

// Waits until the connection's readyState is 1 (connected), with retries
export const waitForConnection = async (conn, retries = 10, delay = 500) => {
    while (retries > 0) {
        if (conn.readyState === 1) { // 1 means connected
            return conn;
        }
        // console.log(`Connection not ready, retries left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries--;
    }
    throw new Error('Failed to establish a Mongoose connection');
};

// Attempts to create and wait for a connection to be ready. Retries if necessary.
export const getConnection = async () => {
    let conn = mongoose.createConnection(process.env.NEXT_PUBLIC_BASE_MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const obtainConnection = async (connection) => {
        try {
            let establishedConn = await waitForConnection(connection);
            return establishedConn;
        } catch (error) {
            console.error('Error waiting for connection, retrying...', error);
            let newConn = mongoose.createConnection(process.env.NEXT_PUBLIC_BASE_MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            return await obtainConnection(newConn);
        }
    };

    conn = await obtainConnection(conn);
    return conn;
};
