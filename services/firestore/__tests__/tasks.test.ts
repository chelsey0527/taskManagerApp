import {getUserTasks} from '../tasks';
import {db} from '../../../config/firebase-config';
import {
  collection,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';

// Mock the Firestore database configuration
jest.mock('../../../config/firebase-config', () => ({
  db: {},
}));

// Mock the Firestore functions
jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(), // Mock the getDocs function
  collection: jest.fn(), // Mock the collection function
  query: jest.fn(), // Mock the query function
  where: jest.fn(), // Mock the where function
}));

describe('getUserTasks', () => {
  it('should fetch tasks for a user and sort by completed and deadline', async () => {
    const mockUserId = 'user123';
    const mockTasks = [
      {id: '1', name: 'Task 1', completed: false, deadline: 1627843200000},
      {id: '2', name: 'Task 2', completed: true, deadline: 1627929600000},
    ];

    // Mock the getDocs function to resolve with a mock QuerySnapshot
    (getDocs as jest.Mock).mockResolvedValueOnce({
      forEach: (callback: (doc: any) => void) => {
        mockTasks.forEach(task => callback({id: task.id, data: () => task}));
      },
    } as QuerySnapshot<DocumentData>);

    // Call the function to be tested
    const tasks = await getUserTasks(mockUserId);

    // Assertions to verify the function's behavior
    expect(tasks).toEqual([
      {id: '1', name: 'Task 1', completed: false, deadline: 1627843200000},
      {id: '2', name: 'Task 2', completed: true, deadline: 1627929600000},
    ]);
    expect(query).toHaveBeenCalledWith(
      collection(db, 'tasks'),
      where('userId', '==', mockUserId),
    );
  });
});
