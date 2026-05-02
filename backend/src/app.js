import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRouter from './modules/auth/auth.router.js'
import setsRouter from './modules/sets/sets.router.js'
import cardsRouter from './modules/cards/cards.router.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRouter)
app.use('/api/sets', setsRouter)
app.use('/api/cards', cardsRouter)

export default app