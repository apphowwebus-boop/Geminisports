import React from 'react';

interface StudioErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface StudioErrorBoundaryState {
  hasError: boolean;
}

export class StudioErrorBoundary extends React.Component<
  StudioErrorBoundaryProps,
  StudioErrorBoundaryState
> {
  constructor(props: StudioErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): StudioErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
