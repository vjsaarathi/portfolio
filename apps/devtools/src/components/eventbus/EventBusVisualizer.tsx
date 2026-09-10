import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { eventBus, EventPayload } from '@impossible-resume/event-bus';
import { EventTimeline } from './EventTimeline';
import { EventInspector } from './EventInspector';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'shell' | 'remote' | 'infrastructure';
  framework?: 'react' | 'vue' | 'svelte';
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export function EventBusVisualizer() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [history, setHistory] = useState<EventPayload[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventPayload | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 450;

    const nodes: GraphNode[] = [
      { id: 'shell', name: 'Shell App', type: 'shell', framework: 'react' },
      { id: 'landing', name: 'Landing Remote', type: 'remote', framework: 'react' },
      { id: 'projects', name: 'Projects Remote', type: 'remote', framework: 'react' },
      { id: 'resume', name: 'Resume Remote', type: 'remote', framework: 'react' },
      { id: 'blog', name: 'Blog Remote', type: 'remote', framework: 'vue' },
      { id: 'contact', name: 'Contact Remote', type: 'remote', framework: 'react' },
      { id: 'playground', name: 'Playground Remote', type: 'remote', framework: 'svelte' },
      { id: 'devtools', name: 'DevTools Remote', type: 'remote', framework: 'react' },
      { id: 'event-bus', name: 'Event Bus', type: 'infrastructure' },
      { id: 'runtime-tracker', name: 'Runtime Tracker', type: 'infrastructure' },
    ];

    const links: GraphLink[] = [
      { source: 'shell', target: 'landing' },
      { source: 'shell', target: 'projects' },
      { source: 'shell', target: 'resume' },
      { source: 'shell', target: 'blog' },
      { source: 'shell', target: 'contact' },
      { source: 'shell', target: 'playground' },
      { source: 'shell', target: 'devtools' },
      { source: 'landing', target: 'event-bus' },
      { source: 'projects', target: 'event-bus' },
      { source: 'resume', target: 'event-bus' },
      { source: 'blog', target: 'event-bus' },
      { source: 'contact', target: 'event-bus' },
      { source: 'playground', target: 'event-bus' },
      { source: 'devtools', target: 'event-bus' },
      { source: 'devtools', target: 'runtime-tracker' },
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Filters for glow
    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id', 'particle-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(45));

    // Render links
    const link = g.append('g').attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d) => (d.target as any).id === 'event-bus' ? '4,4' : 'none');

    // Render nodes
    const node = g.append('g').attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .enter().append('g');

    node.append('circle')
      .attr('r', (d) => d.type === 'shell' ? 26 : d.type === 'infrastructure' ? 22 : 18)
      .attr('fill', (d) => {
        if (d.type === 'shell') return '#6366f1';
        if (d.type === 'infrastructure') return '#818cf8';
        if (d.framework === 'react') return '#61dafb';
        if (d.framework === 'vue') return '#42b883';
        if (d.framework === 'svelte') return '#ff3e00';
        return '#a1a1aa';
      })
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 2);

    node.append('text')
      .text((d) => d.name)
      .attr('dy', (d) => (d.type === 'shell' ? 38 : 30))
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--color-text-primary)')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Particle system
    const particlesGroup = g.append('g').attr('class', 'particles');

    const triggerParticle = (sourceId: string, targetId: string, color: string, onEnd?: () => void) => {
      const source = nodes.find(n => n.id === sourceId);
      const target = nodes.find(n => n.id === targetId);

      if (!source || !target || source.x === undefined || target.x === undefined) {
        if (onEnd) onEnd();
        return;
      }

      const particle = particlesGroup.append('circle')
        .attr('cx', source.x)
        .attr('cy', source.y)
        .attr('r', 5)
        .attr('fill', color)
        .attr('filter', 'url(#particle-glow)');

      particle.transition()
        .duration(600)
        .ease(d3.easeCubicInOut)
        .attr('cx', target.x)
        .attr('cy', target.y)
        .on('end', () => {
          particle.remove();
          if (onEnd) onEnd();
        });
    };

    const unsub = eventBus.subscribe('*', 'eventbus_visualizer', (payload) => {
      // Throttle React state updates to prevent massive re-rendering on scroll/mousemove
      if (payload.type !== 'interaction:scroll' && payload.type !== 'interaction:mousemove') {
        setHistory(prev => [...prev.slice(-14), payload]);
      } else {
        // Only update history occasionally for high-frequency events to save React performance
        if (Math.random() < 0.05) {
          setHistory(prev => [...prev.slice(-14), payload]);
        }
      }
      
      const isError = payload.type.includes('error') || payload.type.includes('fail');
      const color = isError ? '#ef4444' : '#10b981';
      
      const sourceNode = nodes.some(n => n.id === payload.source) ? payload.source : 'shell';
      
      // Animate inbound (source to event-bus)
      triggerParticle(sourceNode, 'event-bus', color, () => {
        // Find outbound subscribers
        const subsMap = eventBus.getSubscriptionMap();
        const specificSubs = subsMap[payload.type] || [];
        const wildcardSubs = subsMap['*'] || [];
        const allSubs = Array.from(new Set([...specificSubs, ...wildcardSubs]));
        
        const targets: string[] = [];
        
        allSubs.forEach(sub => {
          if (sub === sourceNode) return;
          if (sub === 'devtools_graph' || sub === 'eventbus_visualizer') {
            if (!targets.includes('devtools')) targets.push('devtools');
            return;
          }
          if (nodes.some(n => n.id === sub)) {
            targets.push(sub);
          }
        });

        if (targets.length === 0) targets.push('devtools');

        targets.forEach(target => {
          triggerParticle('event-bus', target, color);
        });
      });
    });

    return () => {
      simulation.stop();
      unsub();
    };
  }, []);

  return (
    <div className="eventbus-visualizer glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-secondary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Event Bus Topology & Particle Flow</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Powered by D3.js Force-Directed Graph
        </span>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '400px', background: '#09090c', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 450" style={{ display: 'block' }} />
      </div>

      <EventTimeline
        events={history as any}
        onSelectEvent={(event) => setSelectedEvent(event as any)}
      />
      {selectedEvent && <EventInspector event={selectedEvent} />}
    </div>
  );
}
