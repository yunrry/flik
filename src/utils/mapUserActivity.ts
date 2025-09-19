// src/utils/mapUserActivity.ts
import { UserActivityPostResponse } from '../types/post.types';
import { UserActivity } from '../types/user.types';


export const mapToUserActivity = (
    posts: UserActivityPostResponse[]
  ): UserActivity[] => {
    return posts.map((post) => ({
      id: String(post.id),
      userId: String(post.userId),
      type: (post.type || 'review') as UserActivity['type'],
      title: post.title || '',
      description: post.description ?? undefined, // null → undefined
      imageUrl: post.imageUrl ?? undefined,       // null → undefined
      relatedId: undefined,                       // null 대신 undefined
      createdAt: post.createdAt,
      metadata: undefined                         // null 대신 undefined
    }));
  };