import { Router } from 'express'
import { getCards, updateCardStatus } from './cards.controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

router.get('/:setId', requireAuth, getCards)
router.patch('/:cardId', requireAuth, updateCardStatus)

export default router