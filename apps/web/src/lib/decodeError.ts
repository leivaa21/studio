import { ErrorCodes } from '@studio/commons';

const errorCodeToErrorMessage: Record<ErrorCodes, string> = {
  [ErrorCodes.BadRequest]: '',
  [ErrorCodes.InvalidCredential]:
    'Credentials do not match with any account :(',
  [ErrorCodes.Unauthorized]: 'Unauthorized!',
  [ErrorCodes.RouteNotFound]: '',
  [ErrorCodes.InvalidPassword]: 'The password is invalid :(',
  [ErrorCodes.InvalidNickname]: 'The nickname is invalid :(',
  [ErrorCodes.InvalidEmail]: 'The email is invalid :(',
  [ErrorCodes.NicknameAlreadyInUse]: 'The nickname is already in use',
  [ErrorCodes.EmailAlreadyInUse]: 'The email is already in use',
  [ErrorCodes.UserNotFound]: 'Unable to find that user :(',
  [ErrorCodes.InternalServerError]: 'Something happened',
  [ErrorCodes.PasswordTooShort]: 'Password should be longer than 8 characters',
  [ErrorCodes.PasswordShouldContainLowercase]:
    'Password should contain atleast one lowercase',
  [ErrorCodes.PasswordShouldContainUppercase]:
    'Password should contain atleast one uppercase',
  [ErrorCodes.PasswordShouldContainNumber]:
    'Password should contain atleast one number',
  [ErrorCodes.PasswordShouldContainSymbol]:
    'Password should contain atleast one symbol',
  [ErrorCodes.UnableToRenameUser]: 'Couldnt perform the rename :(',
  [ErrorCodes.UnableToChangeEmail]: 'Couldnt perform the email change :(',
  [ErrorCodes.UnableToChangePassword]: 'Couldnt perform the password change :(',
  [ErrorCodes.CourseNotFound]: 'Course not found!',
  [ErrorCodes.LessonNotFound]: 'Lesson not found!',
  [ErrorCodes.UnableToReorderLesson]: 'Couldnt reorder lesson :(',
  [ErrorCodes.UnableToPublishCourse]: 'Couldnt publish course :(',
  [ErrorCodes.UnableToUnpublishCourse]: 'Couldnt unpublish course :(',
  [ErrorCodes.InvalidCourseTitle]: 'The course title is invalid!',
  [ErrorCodes.InvalidCourseTags]: 'The course tags are invalid!',
  [ErrorCodes.InvalidLessonTitle]: 'The lesson title is invalid!',
  [ErrorCodes.InvalidCourseSubscription]: 'The course subscription is invalid!',
  [ErrorCodes.CourseSubscriptionNotFound]:
    'Unable to find Course Subscription! :(',
  [ErrorCodes.UnableToCompleteLesson]: '',
  [ErrorCodes.UnableToUncompleteLesson]: '',
  [ErrorCodes.UnableToCompleteCourseSubscription]: '',
  [ErrorCodes.UnableToUncompleteCourseSubscription]: '',
  [ErrorCodes.AuthorStatsNotFound]: 'Author stats could not be found!',
  [ErrorCodes.ConsumerStatsNotFound]: 'Consumer stats could not be found!',
  [ErrorCodes.CourseStatsNotFound]: 'Course stats could not be found!',
};

export function decodeError(errorCode: string): string {
  return (
    errorCodeToErrorMessage[errorCode as ErrorCodes] ||
    'Unknown Error | Try later!'
  );
}
