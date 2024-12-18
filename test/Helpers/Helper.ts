import { v4 as uuidv4 } from 'uuid';

export default function generateRandomName(): string {
  return `${uuidv4().split('-')[0]}`;
}
