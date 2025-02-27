import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Employee, EmployeeStatus, Mode } from '../types';

interface EmployeeStore {
  employees: Employee[];
  mode: Mode;
  
  // Actions
  addEmployee: (name: string) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  updateEmployeeStatus: (id: string, status: EmployeeStatus) => void;
  toggleMode: () => void;
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set) => ({
      employees: [],
      mode: 'manage',

      addEmployee: (name) => set((state) => ({
        employees: [
          ...state.employees,
          {
            id: uuidv4(),
            name,
            shift: { start: '', end: '' },
            break1: { start: '', end: '' },
            lunch: { start: '', end: '' },
            break2: { start: '', end: '' },
            status: 'idle',
            statusHistory: [],
          },
        ],
      })),
      
      updateEmployee: (id, data) => set((state) => ({
        employees: state.employees.map((emp) =>
          emp.id === id ? { ...emp, ...data } : emp
        ),
      })),
      
      removeEmployee: (id) => set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
      })),
      
      updateEmployeeStatus: (id, status) => set((state) => ({
        employees: state.employees.map((emp) => {
          if (emp.id === id) {
            return {
              ...emp,
              status,
              statusHistory: [
                ...emp.statusHistory,
                { status, timestamp: Date.now() },
              ],
            };
          }
          return emp;
        }),
      })),
      
      toggleMode: () => set((state) => ({
        mode: state.mode === 'edit' ? 'manage' : 'edit',
      })),
    }),
    {
      name: 'employee-store',
    }
  )
);