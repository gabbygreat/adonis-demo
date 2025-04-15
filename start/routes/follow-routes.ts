import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import FollowsController from '#controllers/follows_controller'

router
  .group(() => {
    router
      .post('follow', [FollowsController, 'followUser'])
      .use(middleware.auth({ guards: ['api'] }))
    router
      .post('unfollow', [FollowsController, 'unfollowUser'])
      .use(middleware.auth({ guards: ['api'] }))
    router
      .get('followings', [FollowsController, 'getFollowings'])
      .use(middleware.auth({ guards: ['api'] }))
    router
      .get('followers', [FollowsController, 'getFollowers'])
      .use(middleware.auth({ guards: ['api'] }))
    router.get('bible', [FollowsController, 'getBible'])
  })
  .prefix('/api/user')
