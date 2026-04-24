import { ref, push, onValue, runTransaction } from 'firebase/database';
import { db } from './firebase';
import type { Message } from '@/types';

export function subscribeToMessages(
  callback: (messages: Message[]) => void
): () => void {
  const messagesRef = ref(db, 'messages');
  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() as Record<string, Omit<Message, 'id'>> | null;
    if (!data) {
      callback([]);
      return;
    }
    const messages = Object.entries(data)
      .map(([id, val]) => ({ id, ...val }))
      .sort((a, b) => b.timestamp - a.timestamp);
    callback(messages);
  });
}

export async function postMessage(
  data: Omit<Message, 'id' | 'likes'>
): Promise<void> {
  const payload: Record<string, unknown> = {
    username: data.username,
    message: data.message,
    date: data.date,
    time: data.time,
    timestamp: data.timestamp,
    likes: 0,
  };
  if (data.location) payload.location = data.location;
  await push(ref(db, 'messages'), payload);
}

export async function likeMessage(messageId: string): Promise<void> {
  await runTransaction(
    ref(db, `messages/${messageId}/likes`),
    (current) => (current ?? 0) + 1
  );
}
