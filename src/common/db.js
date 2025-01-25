import { MongoClient, ServerApiVersion } from "mongodb";

const uri = 'mongodb+srv://eva3_express:oxRoZA4vaxChXaK2@cluster-express.cphqr.mongodb.net/?retryWrites=true&w=majority&appName=cluster-express'

const client = new MongoClient (uri, {
    ServerApi:{
        version: ServerApiVersion.v1, 
        Strict: true,
        deprecationErrors: true
    }
})

export default client