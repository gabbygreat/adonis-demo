// import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import PostMedia from '#models/post_media'
import { sendError, sendSuccess } from '#utils/utils'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class PostsController {
  async createPost({ auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return sendError(response, { message: 'Unauthorised user' })
      }
      const post = await db.transaction(async (client) => {
        const post = await Post.create(
          {
            title: 'This is a new post',
            description: 'This is a very long description of what I posted',
            ownerId: user.id,
          },
          { client }
        )
        const mediaUrls = [
          'https://example.com/media1.jpg',
          'https://example.com/media2.jpg',
          'https://example.com/media3.jpg',
        ]
        const mediaData = mediaUrls.map((url) => ({
          postId: post.id,
          url,
        }))
        await PostMedia.createMany(mediaData, { client })
        await post.load('media')
        return post
      })
      return sendSuccess(response, { code: 201, message: 'Post created successfully', data: post })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async fetchPosts({ request, auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return sendError(response, { message: 'Unauthorised user' })
      }
      const page = Number(request.input('page')) || 1
      const perPage = Number(request.input('per_page')) || 10
      const mine = request.input('mine') === 'true'
      const searchTerm = request.input('search', '').trim()

      const posts = await Post.query()
        .if(mine, (query) => {
          query.where('owner_id', user.id)
        })
        .if(searchTerm, (query) => {
          query.where((subQuery) => {
            subQuery
              .whereILike('title', `%${searchTerm}%`)
              .orWhereILike('description', `%${searchTerm}%`)
          })
        })
        .preload('media')
        .preload('owner')
        .paginate(page, perPage)

      return sendSuccess(response, { message: 'Post retrieved successfully', data: posts })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async fetchPost({ request, response }: HttpContext) {
    try {
      const postId = request.param('id')

      const posts = await Post.query()
        .where('id', postId)
        .preload('media')
        .preload('owner')
        .firstOrFail()

      return sendSuccess(response, { message: 'Post retrieved successfully', data: posts })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async updatePost({ request, auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return sendError(response, { message: 'Unauthorised user' })
      }

      const postId = request.param('id')
      const post = await Post.findByOrFail(postId)

      if (post.ownerId !== user.id) {
        return sendError(response, { message: "You cannot edit another user's post" })
      }

      const updateData = request.only(['title', 'description'])
      post.merge(updateData)

      await post.save()
      await post.load('media')
      await post.load('owner')

      return sendSuccess(response, { message: 'Post updated successfully', data: post })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async deletePost({ request, auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return sendError(response, { message: 'Unauthorised user' })
      }

      const postId = request.param('id')
      const post = await Post.query().where('id', postId).where('owner_id', user.id).firstOrFail()

      if (post.ownerId !== user.id) {
        return sendError(response, { message: "You cannot delete another user's post" })
      }

      await post.delete()

      return sendSuccess(response, { message: 'Post deleted successfully', data: post })
    } catch (error) {
      return sendError(response, { error })
    }
  }
}
