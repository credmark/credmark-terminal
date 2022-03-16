import React, { useState, useEffect } from 'react';

import { codeTerminal, CURSOR_LEN, PAUSE_LEN } from './constants';
import styles from './styles.module.css';

// eslint-disable-next-line react/prop-types
const CodeTerminal = ({ speed = 100 }) => {
  const [displayedContent, setDisplayedContent] = useState(codeTerminal.label);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setIndex((index) => {
        return index + 1;
      });
    }, speed);
  }, [speed]);

  useEffect(() => {
    const contentList = codeTerminal.content
      .toString()
      .replace(/\r\n/g, '\n')
      .split('\n');

    const commandCount = codeTerminal.command.length;
    const contentCount = contentList.length;
    const totalCount = commandCount + contentCount + CURSOR_LEN + PAUSE_LEN;
    let displayedContent = '';

    if (index < CURSOR_LEN / 2) {
      const cursor = index % 2 == 0 ? '|' : '';
      displayedContent = codeTerminal.label + cursor;
    } else if (
      index >= CURSOR_LEN / 2 &&
      index < CURSOR_LEN / 2 + commandCount
    ) {
      displayedContent =
        codeTerminal.label +
        codeTerminal.command.substring(0, index - CURSOR_LEN / 2);
    } else if (
      index >= CURSOR_LEN / 2 + commandCount &&
      index < CURSOR_LEN + commandCount
    ) {
      const cursor = (index - CURSOR_LEN / 2) % 2 == 0 ? '|' : '';
      displayedContent =
        codeTerminal.label +
        codeTerminal.command.substring(0, index - CURSOR_LEN / 2) +
        '\n\n' +
        cursor;
    } else if (
      index >= totalCount - contentCount - PAUSE_LEN &&
      index < totalCount - PAUSE_LEN
    ) {
      displayedContent =
        codeTerminal.label +
        codeTerminal.command.substring(0, index - CURSOR_LEN / 2) +
        '\n\n';
      for (let i = 0; i < index - commandCount - CURSOR_LEN; i++) {
        displayedContent = displayedContent + contentList[i] + '\n';
      }
    } else {
      displayedContent =
        codeTerminal.label +
        codeTerminal.command.substring(0, commandCount) +
        '\n\n';
      for (let i = 0; i < contentCount; i++) {
        displayedContent = displayedContent + contentList[i] + '\n';
      }
    }

    setDisplayedContent(displayedContent);
    setIndex(index % totalCount);
  }, [index]);

  return (
    <div className={styles.container}>
      <pre>{displayedContent}</pre>
    </div>
  );
};

export default CodeTerminal;
