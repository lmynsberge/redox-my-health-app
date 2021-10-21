import { DateTime } from 'luxon';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  role: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  lastLogin: DateTime;
  inactive: boolean;
}

export class UserService {
  public static async login(username: string, password: string): Promise<User> {
    return {
      id: '12345',
      firstName: 'Mantis',
      lastName: 'Tobaggan',
      email: 'lucas@redoxengine.com',
      title: 'Dr.',
      role: 'doctor',
      createdAt: DateTime.utc(),
      updatedAt: DateTime.utc(),
      lastLogin: DateTime.utc(),
      inactive: false,
    };
  }

  public static async check(): Promise<User> {
    return {
      id: '12345',
      firstName: 'Mantis',
      lastName: 'Tobaggan',
      email: 'lucas@redoxengine.com',
      title: 'Dr.',
      role: 'doctor',
      createdAt: DateTime.utc(),
      updatedAt: DateTime.utc(),
      lastLogin: DateTime.utc(),
      inactive: false,
    };
  }

  public static async logout(): Promise<void> {}
}
