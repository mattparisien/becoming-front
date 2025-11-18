'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface UseSplitTextOptions {
  elementId: string;
  type?: 'chars' | 'words' | 'lines' | 'words,chars' | 'lines,words' | 'lines,chars' | 'lines,words,chars';
  duration?: number;
  stagger?: number;
  ease?: string;
  onComplete?: () => void;
  delay?: number;
  isDisabled?: boolean;
}

export function useSplitText(options: UseSplitTextOptions) {
  const {
    elementId,
    type = 'words,chars',
    isDisabled = false
  } = options;

  const [isSplit, setIsSplit] = useState(false);
  const [chars, setChars] = useState<Element[]>([]);
  const [words, setWords] = useState<Element[]>([]);
  const [lines, setLines] = useState<Element[]>([]);

  useEffect(() => {
    const element = document.getElementById(elementId);

    if (!element || isDisabled) return;

    // Split the text into characters/words/lines
    const split = new SplitText(element, { type, charsClass: "char", wordsClass: "word", linesClass: "line" });

    // Add stagger index to each character for CSS animation
    if (split.chars) {
      split.chars.forEach((char, index) => {
        (char as HTMLElement).style.setProperty('--char-index', index.toString());
      });
    }

    // Store the split elements
    setChars(split.chars || []);
    setWords(split.words || []);
    setLines(split.lines || []);
    setIsSplit(true);

    // Cleanup
    return () => {
      split.revert();
      setIsSplit(false);
      setChars([]);
      setWords([]);
      setLines([]);
    };
  }, [elementId, type, isDisabled]);

  return { chars, words, lines, isSplit };
}
