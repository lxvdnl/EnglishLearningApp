import { Router } from 'express'
import { getSets, createSet } from './sets.controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getSets)
router.post('/', requireAuth, createSet)

export default router