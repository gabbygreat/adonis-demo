import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/user_controller'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('register', [UsersController, 'register']).use(middleware.checkUserDoesNotExist())
    router.post('login', [UsersController, 'login']).use(middleware.checkUserExist())
    router.post('login-other-source', [UsersController, 'loginOtherSource'])
  })
  .prefix('api/user')
