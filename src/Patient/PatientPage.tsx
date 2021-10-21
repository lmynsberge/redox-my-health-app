import React from 'react';

import { PatientSearch } from '../shared/PatientSearch';

interface PatientPageProps {}

export const PatientPage: React.FC<PatientPageProps> = () => {
  return <PatientSearch />;
};
