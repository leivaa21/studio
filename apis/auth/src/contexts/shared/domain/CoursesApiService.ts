import { DomainEvent } from './DomainEvent';

export interface CoursesApiService {
  sendEvent(event: DomainEvent): void;
}
