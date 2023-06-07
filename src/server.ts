import express, { ErrorRequestHandler, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'
import db from './database/mysql'
dotenv.config()
const app = express()

app.use(cors())

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', routes)
app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/index.html');
  });
app.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true })

})
 const test=async ()=>{
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
 }
 test()
app.use((req: Request, res: Response) => {
    res.status(404)
    res.json({ error: 'endpoint näo encontrado' })
})
const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
    res.status(404)

    res.json({ error: 'Ocorreu algum erro.' });
}
app.use(errorHandler)
app.listen(process.env.PORT_SERVER)


export default app