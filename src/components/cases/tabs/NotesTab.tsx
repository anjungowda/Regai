import React, { useState } from 'react';
import { useCaseNotes, useCreateNote } from '../../../hooks/useNotes';
import { Lock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export const NotesTab = ({ caseData }: any) => {
  const { data: notes, isLoading } = useCaseNotes(caseData.id);
  const createNote = useCreateNote(caseData.id);

  const [noteContent, setNoteContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    createNote.mutate(
      { content: noteContent, isInternal },
      { onSuccess: () => { setNoteContent(''); setIsInternal(false); } }
    );
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      
      {/* Composer */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-lg w-fit">
          <button type="button" onClick={() => setIsInternal(false)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!isInternal ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>
            Standard Note
          </button>
          <button type="button" onClick={() => setIsInternal(true)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${isInternal ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm' : 'text-slate-500'}`}>
            <Lock className="w-4 h-4" /> Internal Only
          </button>
        </div>

        {isInternal && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-lg text-xs font-semibold">
            ⚠ Internal notes are excluded from regulatory exports.
          </div>
        )}

        <textarea
          value={noteContent}
          onChange={e => setNoteContent(e.target.value)}
          placeholder="Add an investigation note... Include relevant findings, decisions considered, or actions taken."
          className={`w-full min-h-[120px] rounded-xl p-4 text-sm text-slate-700 outline-none border focus:ring-2 focus:border-transparent transition-all resize-none ${isInternal ? 'bg-amber-50/30 border-amber-200 focus:ring-amber-500/20' : 'bg-slate-50 border-slate-200 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8]'}`}
        />

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs font-medium text-slate-400">{noteContent.length} characters</span>
          <button 
            type="submit" 
            disabled={!noteContent.trim() || createNote.isPending}
            className="px-5 py-2 bg-[#1B4FD8] text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {createNote.isPending ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white border border-slate-200 p-5 rounded-2xl animate-pulse h-32"></div>
        ) : (notes || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-slate-600 font-medium">No notes yet</p>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">Notes added here form part of the investigation record. Add your first note to begin documenting this case.</p>
          </div>
        ) : (
          (notes || []).map((note: any) => (
            <div key={note.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transform transition duration-300 hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                    {note.author?.firstName?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{note.author?.firstName} {note.author?.lastName}</p>
                    <p className="text-xs text-slate-500">{note.author?.role?.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                {note.isInternal && (
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider">
                    <Lock className="w-3 h-3" /> Internal
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
              <p className="text-xs text-slate-400 font-medium mt-4 pt-3 border-t border-slate-50">Added {format(new Date(note.createdAt), 'dd MMM yyyy, HH:mm')}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
