// Example usage of useTheme hook

'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ExampleComponent() {
  const { palette } = useTheme();

  if (!palette) return null;

  return (
    <div>
      <div style={{ backgroundColor: palette.bg.value, color: palette.fg.value }}>
        <h1>Background: {palette.bg.name}</h1>
        <p style={{ color: palette.accent.value }}>
          Accent color: {palette.accent.name}
        </p>
        
        <div>
          <h2>Additional Colors:</h2>
          {palette.additional.map((color, idx) => (
            <div key={idx} style={{ backgroundColor: color.value }}>
              {color.name}: {color.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
