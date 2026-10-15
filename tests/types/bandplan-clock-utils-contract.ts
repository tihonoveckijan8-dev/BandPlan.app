import { timeToMinutes } from '../../core/format-utils.js';

const validClock: number = timeToMinutes('09:45');
const invalidClock: number = timeToMinutes('9:5');

void validClock;
void invalidClock;
