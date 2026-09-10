import React, { useEffect, useRef } from 'react';
import { moduleTracker } from '@impossible-resume/runtime-tracker';

interface FrameworkBridgeProps {
  name: string;
  mountFn: (container: HTMLElement) => void;
  unmountFn: () => void;
  framework: 'vue' | 'svelte';
}

export function FrameworkBridge({ name, mountFn, unmountFn, framework }: FrameworkBridgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !mountFn) return;

    moduleTracker.addEvent(
      'module_mount',
      name,
      `Mounting ${framework} component: ${name}`
    );

    mountFn(containerRef.current);
    moduleTracker.updateStatus(name, 'mounted');

    return () => {
      moduleTracker.addEvent(
        'module_unmount',
        name,
        `Unmounting ${framework} component: ${name}`
      );
      unmountFn();
      moduleTracker.updateStatus(name, 'unloaded');
    };
  }, [mountFn, unmountFn, name, framework]);

  return (
    <div
      ref={containerRef}
      id={`${name}-root`}
      className="framework-bridge-container"
      data-framework={framework}
      data-module={name}
    />
  );
}
