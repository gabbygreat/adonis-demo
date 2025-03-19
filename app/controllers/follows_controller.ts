import User from '#models/user'
import { sendError, sendSuccess } from '#utils/utils'
import { HttpContext } from '@adonisjs/core/http'

export default class FollowsController {
  async followUser({ request, auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return sendError(response, { message: 'Unauthorized user', code: 401 })
      }

      const userIdToFollow = request.input('id')

      if (user.id === userIdToFollow) {
        return sendError(response, { message: 'You cannot follow yourself', code: 400 })
      }

      // Check if the user exists before proceeding
      const userToFollow = await User.findOrFail(userIdToFollow)

      // Check if already following
      const isFollowing = await user
        .related('following')
        .query()
        .where('follows.following_id', userIdToFollow)
        .first()

      if (isFollowing) {
        return sendError(response, {
          code: 409,
          message: `You're already following ${userToFollow.email}`,
        })
      }

      // Follow the user
      await user.related('following').attach([userToFollow.id])

      return sendSuccess(response, { message: 'Followed successfully', data: userToFollow })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async unfollowUser({ request, auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user

      if (!user) {
        return sendError(response, { message: 'Unauthorized user', code: 401 })
      }

      const userIdToUnfollow = request.input('id')

      if (user.id === userIdToUnfollow) {
        return sendError(response, { message: 'You cannot unfollow yourself', code: 400 })
      }

      // Check if the user exists before proceeding
      const userToUnfollow = await User.findOrFail(userIdToUnfollow)

      // Check if the user is actually following
      const isFollowing = await user
        .related('following')
        .query()
        .where('follows.following_id', userIdToUnfollow)
        .first()

      if (!isFollowing) {
        return sendError(response, {
          code: 409,
          message: `You're not following ${userToUnfollow.email}`,
        })
      }

      // Unfollow the user
      await user.related('following').detach([userToUnfollow.id])

      return sendSuccess(response, { message: 'Unfollowed successfully', data: userToUnfollow })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async getFollowers({ request, auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return sendError(response, { message: 'Unauthorized user' })
      }

      const page = Number(request.input('page')) || 1
      const perPage = Number(request.input('per_page')) || 10
      const searchTerm = request.input('search', '').trim()

      const followers = await user
        .related('followers')
        .query()
        .if(searchTerm, (query) => {
          query.where((subQuery) => {
            subQuery.whereILike('email', `%${searchTerm}%`)
          })
        })
        .paginate(page, perPage)

      return sendSuccess(response, { message: 'Followers retrieved successfully', data: followers })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async getFollowings({ request, auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return sendError(response, { message: 'Unauthorized user' })
      }

      const page = Number(request.input('page')) || 1
      const perPage = Number(request.input('per_page')) || 10
      const searchTerm = request.input('search', '').trim()

      const following = await user
        .related('following')
        .query()
        .if(searchTerm, (query) => {
          query.where((subQuery) => {
            subQuery.whereILike('email', `%${searchTerm}%`)
          })
        })
        .paginate(page, perPage)

      return sendSuccess(response, { message: 'Following retrieved successfully', data: following })
    } catch (error) {
      return sendError(response, { error })
    }
  }
}
