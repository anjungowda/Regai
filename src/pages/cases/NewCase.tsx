import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { Briefcase } from 'lucide-react';

export default function NewCase() {
  return (
    <PlaceholderPage
      title="Create New Case"
      description="Initialize a new compliance case and assign it to an analyst."
      icon={<Briefcase />}
    />
  );
}
