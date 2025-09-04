"use client"
// https://nextjs.org/docs/app/getting-started/fetching-data
import React from 'react';
import { useEffect, useState } from 'react';

interface Note { id: string, content: string }


const remoteNotes: Note[] = [
  { content: "this is note content", id: '0' },
  { content: "another one", id: '1' }
];

const getNotes = async (): Promise<Note[]> => new Promise((resolve) => {
  setTimeout(() => {
    resolve(remoteNotes.slice())
  }, 100);
})

const insertNote = async (content: string): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    remoteNotes.push({ content, id: remoteNotes.length.toString(10) })
    resolve();
  }, 100);
});

const requestData = async (): Promise<void> => {
  const data = await fetch('/api/settings');
  console.log({ data });
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');

  const loadNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    await insertNote(input);
    setInput('');
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
    requestData();
  }, []);

  return <main style={{ padding: 20 }}>
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
}