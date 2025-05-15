'use client';
import { createSignal, effect } from 'state-signal';

export const cartSignal = createSignal([]);

export const userSignal = createSignal<any | null>(null);

effect(() => {
  console.log('user updated:', userSignal.value);
});
