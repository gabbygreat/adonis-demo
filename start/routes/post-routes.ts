import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import PostsController from '#controllers/posts_controller'

router
  .group(() => {
    router.post('', [PostsController, 'createPost']).use(middleware.auth({ guards: ['api'] }))
    router.get('', [PostsController, 'fetchPosts']).use(middleware.auth({ guards: ['api'] }))
    router.get('/:id', [PostsController, 'fetchPost']).use(middleware.auth({ guards: ['api'] }))
    router.put('/:id', [PostsController, 'updatePost']).use(middleware.auth({ guards: ['api'] }))
    router.delete('/:id', [PostsController, 'deletePost']).use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/post')
