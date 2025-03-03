import { Post } from '../post.entity';
import { postFactory } from './post.factory';
import { userFactory } from '../../users/test/user.factory';
import { User } from '../../users/user.entity';
import {
  saveEntity,
  testEndpoint,
  createFilterQueryParams,
  createIncludeQueryParams,
} from '../../../../config/test/test-utils';

describe('PostsController (E2E) - Show', () => {
  const API_ENDPOINT = '/api/v1/posts';

  describe('GET /api/v1/posts/:id', () => {
    it('should return a single post by id', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 게시물 생성
      const post = await saveEntity<Post>(
        Post,
        postFactory.build({
          authorId: user.id,
          author: user,
        }),
      );

      // HTTP 요청 보내기 및 응답 검증
      const response = await testEndpoint(API_ENDPOINT, post.id);

      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(post.id);
    });

    it('should return 404 when post is not found', async () => {
      // 존재하지 않는 게시물 ID
      const nonExistentId = 9999;

      // HTTP 요청 보내기 및 응답 검증 (404 기대)
      await testEndpoint(API_ENDPOINT, nonExistentId, {}, 404);
    });

    it('should apply published filter when provided', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 게시물 생성
      const post = await saveEntity<Post>(
        Post,
        postFactory.build({
          published: true,
          authorId: user.id,
          author: user,
        }),
      );

      // HTTP 요청 보내기 및 응답 검증
      const response = await testEndpoint(
        API_ENDPOINT,
        post.id,
        createFilterQueryParams('published', true),
      );

      expect(response.body).toBeDefined();
      expect(response.body.published).toBe(true);
    });

    it('should include related author when requested', async () => {
      // 사용자 생성
      const user = await saveEntity<User>(User, userFactory.build());

      // 게시물 생성
      const post = await saveEntity<Post>(
        Post,
        postFactory.build({
          authorId: user.id,
          author: user,
        }),
      );

      // HTTP 요청 보내기 및 응답 검증
      const response = await testEndpoint(
        API_ENDPOINT,
        post.id,
        createIncludeQueryParams('author'),
      );

      expect(response.body).toBeDefined();
      expect(response.body.author).toBeDefined();
      expect(response.body.author.id).toEqual(user.id);
    });
  });
});
