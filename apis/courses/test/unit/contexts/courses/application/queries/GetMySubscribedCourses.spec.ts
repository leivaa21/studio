import { mock, mockReset } from 'jest-mock-extended';
import {
  GetMySubscribedCourses,
  GetMySubscribedCoursesQuery,
} from '../../../../../../src/contexts/courses/application/queries/GetMySubscribedCourses';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { QueryBus } from '../../../../../../src/contexts/shared/domain/QueryBus';
import { UserId } from '../../../../../../src/contexts/course-subscriptions/domain/UserId';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';

describe('Get user subscribed courses', () => {
  const queryBus = mock<QueryBus>();
  const courseRepository = mock<CourseRepository>();

  beforeEach(() => {
    mockReset(queryBus);
    mockReset(courseRepository);
  });

  it('Should find a existants subscribed courses', async () => {
    const userId = UserId.random();
    const course = new CourseBuilder().build();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withUserId(userId)
      .withCourseId(course.id)
      .build();

    const query = new GetMySubscribedCoursesQuery({
      userId: userId.value,
      with: {
        title: '',
        tags: [],
      },
    });

    queryBus.dispatch.mockResolvedValue([courseSubscription]);
    courseRepository.matching.mockResolvedValue([course]);

    const useCase = new GetMySubscribedCourses(queryBus, courseRepository);

    expect(useCase.execute(query)).resolves.toEqual([course]);
  });
});
