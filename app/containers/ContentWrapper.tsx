import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ContentWrapper(props: Props) {
  const { children } = props;
  return <div className="contentWrapper">{children}</div>;
}
