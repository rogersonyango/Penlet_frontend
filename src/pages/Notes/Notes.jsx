import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { mockNotes, mockSubjects } from '../../services/mockData';

const Notes = () => {
  const [notes, setNotes] = useState(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <Link to="/notes/new" className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Note</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="input max-w-xs"
        >
          <option value="all">All Subjects</option>
          {mockSubjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => {
          const subject = mockSubjects.find(s => s.id === note.subjectId);
          return (
            <Link key={note.id} to={`/notes/${note.id}`} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: subject?.color }}
                >
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
                  <p className="text-sm text-gray-500">{subject?.name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  {note.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Notes;