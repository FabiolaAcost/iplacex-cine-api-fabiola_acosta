import { ObjectId } from "mongodb";
import client from "../common/db.js";
import { Pelicula } from "../pelicula/pelicula.js";
import { Actor } from "./actor.js";

const actorCollection = client.db('cine-db').collection('actores')
const peliculaCollection = client.db('cine-db').collection('peliculas')


async function handleInsertActorRequest(req, res) {
    let data = req.body 
    let actor = Actor

    try {
        const pelicula = await peliculaCollection.findOne({ nombre: data.nombrePelicula });
        if (!pelicula) {
            return res.status(404).send('La película no existe');
        }

        
        actor.idPelicula = pelicula._id.toString(); 
        actor.nombre = data.nombre;
        actor.edad = data.edad;
        actor.estaRetirado = data.estaRetirado;
        actor.premios = data.premios; 

        
        await actorCollection.insertOne(actor)
        .then((data) => {
            if (data == null) return res.status(400).send('Error al guardar registro')

            return res.status(201).send(data)
            })
        .catch((e) => {
            return res.status(500).send({ error: e })
            });
    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then((data) => {return res.status(200).send(data) })
    .catch((e) => {return res.status(500).send({error: e}) })
}

async function handleGetActorByIdRequest(req, res) {
     let id = req.params.id
    
        try{
            let oid = ObjectId.createFromHexString(id)
    
            await actorCollection.findOne({ _id : oid})
            .then((data) => {
                if(data == null) return res.status(404).send(data)
                
                return res.status(200).send(data)
            })
            .catch((e) => {
                return res.status(500).send({error: e.code})
            })
        }catch(e){
            return res.status(400).send('ID mal formado')
        }
}
async function handleGetActoresByPeliculaIdRequest(req, res) {
    const peliculaId = req.params.pelicula;

    try {
        const oid = ObjectId.createFromHexString(peliculaId);

        const pelicula = await peliculaCollection.findOne({ _id: oid });
        if (!pelicula) {
            return res.status(404).send('Película no encontrada');
        }

        const actores = await actorCollection.find({ idPelicula: peliculaId }).toArray();

        if (actores.length === 0) {
            return res.status(404).send('No se encontraron actores para esta película');
        }

        return res.status(200).json(actores);
    } catch (e) {
        return res.status(400).send('ID mal formado');
    }
}


export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
};