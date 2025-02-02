// File: src/ui/web/Cell.tsx
import React from 'react';
import { CellOptions } from './types';

interface Props {
  type: CellOptions;
}

const Cell: React.FC<Props> = ({ type }) => {
  return <div className={`cell ${type || 'empty'}`} />;
};

export default Cell;
