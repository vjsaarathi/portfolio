import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { eventBus } from '@impossible-resume/event-bus';
import { NodeInspector } from './NodeInspector';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'shell' | 'remote' | 'infrastructure';
  framework?: 'react' | 'vue' | 'svelte';
  version?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  label?: string;
}

export function ArchitectureGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeEdge, setActiveEdge] = useState<{ source: string; target: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 450;

    const nodes: GraphNode[] = [
      { id: 'shell', name: 'Shell App', type: 'shell', framework: 'react', version: '1.0.0' },
      { id: 'landing', name: 'Landing Remote', type: 'remote', framework: 'react', version: '1.0.0' },
      { id: 'projects', name: 'Projects Remote', type: 'remote', framework: 'react', version: '1.2.0' },
      { id: 'resume', name: 'Resume Remote', type: 'remote', framework: 'react', version: '2.1.0' },
      { id: 'blog', name: 'Blog Remote', type: 'remote', framework: 'vue', version: '1.5.0' },
      { id: 'contact', name: 'Contact Remote', type: 'remote', framework: 'react', version: '1.0.0' },
      { id: 'playground', name: 'Playground Remote', type: 'remote', framework: 'svelte', version: '0.8.0' },
      { id: 'devtools', name: 'DevTools Remote', type: 'remote', framework: 'react', version: '3.0.0' },
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
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(45));

    // Render links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d) => (d.target as any).id === 'event-bus' ? '4,4' : 'none');

    // Render node groups
    const node = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        eventBus.emit('interaction:graph_node_click', 'devtools', { node: d.id });
      });

    // Node Circles
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

    // Node Labels
    node.append('text')
      .text((d) => d.name)
      .attr('dy', (d) => (d.type === 'shell' ? 38 : 30))
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--color-text-primary)')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)');

    // Node Sub-Labels (Framework)
    node.append('text')
      .text((d) => d.framework ? `(${d.framework})` : '')
      .attr('dy', (d) => (d.type === 'shell' ? 50 : 42))
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--color-text-tertiary)')
      .attr('font-size', '9px')
      .attr('font-family', 'var(--font-mono)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Listen to event bus and pulse edges live
    const unsub = eventBus.subscribe('*', 'devtools_graph', (payload) => {
      setActiveEdge({ source: payload.source, target: 'event-bus' });
      setTimeout(() => setActiveEdge(null), 800);
    });

    return () => {
      simulation.stop();
      unsub();
    };
  }, []);

  return (
    <div className="architecture-graph-wrapper glass" style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', padding: '1rem', background: 'var(--color-bg-secondary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Interactive Architecture & Federation Graph</h3>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
          Click nodes to inspect federation metadata · Drag to position
        </span>
      </div>

      <svg ref={svgRef} width="100%" height="400" viewBox="0 0 800 450" style={{ background: '#09090c', borderRadius: 'var(--radius-lg)' }} />

      {selectedNode && (
        <NodeInspector
          module={selectedNode as any}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
