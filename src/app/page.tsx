"use client"
import React from 'react';
import { useEffect, useState } from 'react';

interface Note { id: string, content: string }

declare global {
  interface Window {
    db: {
      insertNote: (text: string) => Promise<void>,
      getNotes: () => Promise<Note[]>
    }
  }
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');

  const loadNotes = async () => {
    const data = await window.db.getNotes();
    setNotes(data);
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    await window.db.insertNote(input);
    setInput('');
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>SQLite Notes</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a note"
        style={{ padding: 8, marginRight: 8 }}
      />
      <button className='thick' onClick={handleAdd}>Add</button>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </main>
  );
}