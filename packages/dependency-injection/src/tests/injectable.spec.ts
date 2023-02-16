import { DependencyContainer } from '../container';
import { Injectable } from '../injectable';

class Course {
	constructor(readonly id: string, public title: string) {}
}
@Injectable()
class CourseFactory {
	fromDocument(doc: { id: string; title: string }): Course {
		return new Course(doc.id, doc.title);
	}
	toDocument(course: Course) {
		return { id: course.id, title: course.title };
	}
}
@Injectable({
	dependencies: [CourseFactory],
})
class CourseCreator {
	constructor(private readonly factory: CourseFactory) {}

	create(title: string) {
		const id = '1';
		return this.factory.fromDocument({ id, title });
	}
}

it('should work using decorators to register classes', () => {
	const creator = DependencyContainer.get(CourseCreator);
	expect(creator).toBeInstanceOf(CourseCreator);
	expect(creator.create('title').id).toBe('1');
});
