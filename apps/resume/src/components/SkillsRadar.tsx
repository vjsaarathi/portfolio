import React, { useRef, useState } from 'react';

interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

interface SkillsRadarProps {
  skills: Skill[];
}

export function SkillsRadar({ skills }: SkillsRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const levels = 5;

  // Generate pentagon points for each skill
  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, value: number): [number, number] => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return [
      center + radius * Math.cos(angle),
      center + radius * Math.sin(angle),
    ];
  };

  // Generate grid polygons
  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const levelValue = ((level + 1) / levels) * 100;
    return skills.map((_, i) => getPoint(i, levelValue).join(',')).join(' ');
  });

  // Generate data polygon
  const dataPoints = skills.map((s, i) => getPoint(i, s.level).join(',')).join(' ');

  // Generate axis lines
  const axes = skills.map((_, i) => {
    const [x, y] = getPoint(i, 100);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  // Generate labels
  const labels = skills.map((skill, i) => {
    const [x, y] = getPoint(i, 115);
    return { x, y, text: skill.name, level: skill.level };
  });

  return (
    <div className="skills-radar">
      <h3 className="skills-radar__title">Skills Overview</h3>
      <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className="skills-radar__chart">
        {/* Grid */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
          />
        ))}

        {/* Axes */}
        {axes.map((axis, i) => (
          <line
            key={i}
            {...axis}
            stroke="var(--color-border-secondary)"
            strokeWidth="0.5"
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={dataPoints}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="var(--color-accent-primary)"
          strokeWidth="2"
          className="skills-radar__data"
        />

        {/* Data points */}
        {skills.map((skill, i) => {
          const [x, y] = getPoint(i, skill.level);
          return (
            <circle
              key={skill.name}
              cx={x}
              cy={y}
              r={hoveredSkill === skill.name ? 6 : 4}
              fill="var(--color-accent-primary)"
              stroke="var(--color-bg-primary)"
              strokeWidth="2"
              className="skills-radar__point"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            />
          );
        })}

        {/* Labels */}
        {labels.map((label) => (
          <text
            key={label.text}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={hoveredSkill === label.text ? 'var(--color-accent-hover)' : 'var(--color-text-secondary)'}
            fontSize="10"
            fontFamily="var(--font-sans)"
            fontWeight={hoveredSkill === label.text ? '600' : '400'}
          >
            {label.text}
          </text>
        ))}
      </svg>

      {hoveredSkill && (
        <div className="skills-radar__tooltip">
          {hoveredSkill}: {skills.find((s) => s.name === hoveredSkill)?.level}%
        </div>
      )}
    </div>
  );
}
