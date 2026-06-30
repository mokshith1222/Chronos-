import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project, Task, EntityState, PriorityLevel, UUID } from '@/types/domain'

interface OrganizationState {
  projects: Project[];
  tasks: Task[];
  addProject: (name: string, color?: string) => void;
  addTask: (title: string, projectId?: string | null) => void;
  updateTaskStatus: (taskId: UUID, state: EntityState) => void;
  deleteTask: (taskId: UUID) => void;
  restoreTask: (task: Task) => void;
}

const generateUUID = () => crypto.randomUUID();
const now = () => new Date().toISOString();

export const useOrganization = create<OrganizationState>()(
  persist(
    (set) => ({
      projects: [
        { 
          id: '1', 
          workspaceId: 'workspace-1',
          name: 'Acme Corp Redesign', 
          color: '#4F46E5', 
          createdAt: now(), 
          updatedAt: now(), 
          state: EntityState.ACTIVE, 
          isFavorite: true 
        },
        { 
          id: '2', 
          workspaceId: 'workspace-1',
          name: 'Internal Tools', 
          color: '#10B981', 
          createdAt: now(), 
          updatedAt: now(), 
          state: EntityState.ACTIVE, 
          isFavorite: false 
        }
      ],
      tasks: [
        { 
          id: '1', 
          projectId: '1', 
          parentId: null,
          title: 'Design landing page', 
          state: EntityState.DRAFT, 
          priority: PriorityLevel.HIGH,
          createdAt: now(),
          updatedAt: now(),
          order: 0,
          tags: []
        },
        { 
          id: '2', 
          projectId: '1', 
          parentId: null,
          title: 'Setup Next.js', 
          state: EntityState.COMPLETED, 
          priority: PriorityLevel.MEDIUM,
          createdAt: now(),
          updatedAt: now(),
          order: 1,
          tags: []
        },
        { 
          id: '3', 
          projectId: '2', 
          parentId: null,
          title: 'Fix build pipeline', 
          state: EntityState.IN_PROGRESS, 
          priority: PriorityLevel.URGENT,
          createdAt: now(),
          updatedAt: now(),
          order: 2,
          tags: []
        }
      ],
      addProject: (name, color = '#4F46E5') => 
        set((state) => ({
          projects: [...state.projects, { 
            id: generateUUID(), 
            workspaceId: 'workspace-1',
            name, 
            color, 
            state: EntityState.ACTIVE,
            createdAt: now(),
            updatedAt: now(),
            isFavorite: false
          }]
        })),
      addTask: (title, projectId = null) =>
        set((state) => ({
          tasks: [...state.tasks, { 
            id: generateUUID(), 
            projectId, 
            parentId: null,
            title, 
            state: EntityState.DRAFT,
            priority: PriorityLevel.NONE,
            createdAt: now(),
            updatedAt: now(),
            order: state.tasks.length,
            tags: []
          }]
        })),
      updateTaskStatus: (taskId, newState) =>
        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, state: newState, updatedAt: now(), completedAt: newState === EntityState.COMPLETED ? now() : null } : t)
        })),
      deleteTask: (taskId) => 
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== taskId)
        })),
      restoreTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task]
        }))
    }),
    {
      name: 'chronos-organization',
    }
  )
)
