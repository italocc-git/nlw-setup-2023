import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'

const app = Fastify()


app.register(cors) /* any front-application can use this server */


app.register(appRoutes)


app.listen({
    port: 3333,

}).then((url) => {
    console.log(`HTTP Server running on : ${url}`)
})