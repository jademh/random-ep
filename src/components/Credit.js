import React from 'react';

export default function Credit(props) {
  const { visible } = props;
  return (
    <div className="credit">
      built by{' '}
      <a
        href="https://www.jmh.codes"
        target="_blank"
        tabIndex={visible ? '' : '-1'}
      >
        <abbr title="Jade Masterson Hally">JMH</abbr>
      </a>
    </div>
  );
}
