import React, { useState } from 'react';
import { useCaseTasks, useCreateTask, useCompleteTask, useDeleteTask } from '../../../hooks/useTasks';
import { format } from 'date-fns';
import { Plus, CheckSquare, MoreVertical, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export const TasksTab = ({ caseData }: any) => {
  const { data: tasks, isLoading } = useCaseTasks(caseData.id);
  const completeTask = useCompleteTask(caseData.id, '');
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const incomplete = (tasks || []).filter((t: any) => t.status !== 'DONE');
  const completed = (tasks || []).filter((t: any) => t.status === 'DONE');

  const handleToggle = (taskId: string, currentStatus: string) => {
    completeTask.mutate(currentStatus === 'DONE' ? 'TODO' : 'DONE');
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          Tasks <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">{(tasks || []).length}</span>
        </h3>
        <button onClick={() => setShowAddForm(true)} className="px-3 py-1.5 bg-[#1B4FD8] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
          <h4 className="text-sm font-bold text-blue-900 mb-3">Create New Task</h4>
          <input 
            type="text" 
            placeholder="Task title..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4FD8]"
          />
          <div className="flex justify-end gap-2 mt-3">
             <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
             <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#1B4FD8] hover:bg-blue-700 rounded-lg">Save Task</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
      ) : (tasks || []).length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No tasks yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first task to define the workflow.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Outstanding ({incomplete.length})</h4>
            <div className="space-y-2">
              {incomplete.map((task: any) => {
                const overdue = new Date(task.dueDate) < new Date();
                return (
                  <div key={task.id} className="group bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition rounded-xl p-4 flex items-start gap-4">
                    <button 
                      onClick={() => handleToggle(task.id, task.status)}
                      className="w-5 h-5 rounded border-2 border-slate-300 hover:border-[#1B4FD8] shrink-0 mt-0.5 transition-colors"
                    ></button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800">{task.title}</p>
                      {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">Unassigned</span>
                        {task.dueDate && (
                          <span className={`${overdue ? 'text-red-600 font-bold flex items-center gap-1' : 'text-slate-400'}`}>
                            {overdue && <ShieldAlert className="w-3 h-3" />}
                            Due {format(new Date(task.dueDate), 'dd MMM yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4"/></button>
                  </div>
                );
              })}
            </div>
          </section>

          {completed.length > 0 && (
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Completed ({completed.length})</h4>
              <div className="space-y-2 opacity-70">
                {completed.map((task: any) => (
                  <div key={task.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-4">
                    <button 
                      onClick={() => handleToggle(task.id, task.status)}
                      className="w-5 h-5 rounded bg-[#1B4FD8] border-[#1B4FD8] flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-400 line-through">{task.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
