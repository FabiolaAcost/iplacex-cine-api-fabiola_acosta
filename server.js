import express, { urlencoded } from 'express'
import cors from 'cors'

import client from './src/common/db.js'
import routes from './src/pelicula/routes.js'
import actorRoutes from './src/actor/actorRoutes.js'

const PORTS = 3000 || 4000
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: true}))
app.use(cors())

app.get('/', (req, res) => {return res.status(200).send('Bienvenido al cine Iplacex')})

app.use('/api', routes)
app.use('/api', actorRoutes);

await client.connect()
.then(() => {
    console.log('conectado al cluster')
    app.listen(PORTS, () => { console.log(`Servidor corriendo en http://localhost:${PORTS}`)})
})
.catch(()=> {
    console.log('Ha ocurrido un error al conectar al cluster de Atlas')
}) 

