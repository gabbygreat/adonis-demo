/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import './routes/user-routes.ts'
import './routes/post-routes.ts'
import './routes/follow-routes.ts'

router.get('/', async () => {
  return new Date()
})
router.get('/beat', async () => {
  return 'Heart is beating 😁'
})
