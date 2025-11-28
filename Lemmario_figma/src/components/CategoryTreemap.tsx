import { Lemma } from '../data/mockData';

interface CategoryTreemapProps {
  lemmas: Lemma[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

export function CategoryTreemap({
  lemmas,
  onCategorySelect,
  selectedCategory,
}: CategoryTreemapProps) {
  // Calculate frequency by category
  const categoryData = lemmas.reduce((acc, lemma) => {
    const category = lemma.Categoria;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += lemma.Frequenza;
    return acc;
  }, {} as Record<string, number>);

  // Sort by frequency
  const sortedCategories = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const total = sortedCategories.reduce((sum, [, freq]) => sum + freq, 0);

  // Color palette
  const colors = [
    '#5B7FB7', // Blue
    '#F59E42', // Orange
    '#E16B6B', // Red
    '#6BB68C', // Green
    '#7DC5BF', // Teal
    '#E8C547', // Yellow
    '#9B7FB7', // Purple
    '#E89B7F', // Coral
  ];

  // Calculate layout (simplified treemap algorithm)
  let currentY = 0;
  let currentRow: Array<{ category: string; freq: number; color: string; width: number; height: number; x: number; y: number }> = [];
  const blocks: Array<{ category: string; freq: number; color: string; width: number; height: number; x: number; y: number }> = [];
  
  const containerWidth = 100;
  const containerHeight = 100;
  
  sortedCategories.forEach(([category, freq], index) => {
    const percentage = (freq / total) * 100;
    const color = colors[index % colors.length];
    
    // Simplified layout: stack blocks based on size
    let width, height;
    
    if (percentage > 30) {
      width = containerWidth;
      height = percentage;
    } else if (percentage > 15) {
      width = containerWidth / 2;
      height = percentage * 2;
    } else {
      width = containerWidth / 2;
      height = percentage * 2;
    }
    
    // Find position
    let x = 0;
    let y = currentY;
    
    if (currentRow.length > 0) {
      const lastInRow = currentRow[currentRow.length - 1];
      if (lastInRow.x + lastInRow.width + width <= containerWidth) {
        x = lastInRow.x + lastInRow.width;
        y = lastInRow.y;
      } else {
        currentY += Math.max(...currentRow.map(b => b.height));
        currentRow = [];
        y = currentY;
      }
    }
    
    const block = { category, freq, color, width, height, x, y };
    blocks.push(block);
    currentRow.push(block);
  });

  return (
    <div className="space-y-4">
      <h2 className="text-gray-900">Lemma Categories by Frequency</h2>

      {/* Treemap */}
      <div className="relative h-[400px] bg-gray-50 rounded-lg overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {blocks.map(({ category, freq, color, width, height, x, y }, index) => {
            const isSelected = selectedCategory === category;
            const displayLabel = category.split(' ')[0]; // Shortened label
            
            return (
              <g
                key={category}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onCategorySelect(category)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.querySelector('rect');
                  if (rect) rect.setAttribute('opacity', '0.8');
                }}
                onMouseLeave={(e) => {
                  const rect = e.currentTarget.querySelector('rect');
                  if (rect) rect.setAttribute('opacity', '1');
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={color}
                  stroke={isSelected ? '#1f2937' : 'white'}
                  strokeWidth={isSelected ? '0.3' : '0.2'}
                  rx="1"
                />
                {/* Label */}
                {width > 15 && height > 8 && (
                  <>
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="3.5"
                      fontWeight="500"
                    >
                      {displayLabel}
                    </text>
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="2.5"
                      opacity="0.9"
                    >
                      {freq}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {sortedCategories.slice(0, 4).map(([category, freq], index) => (
          <div
            key={category}
            className="flex items-center justify-between text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => onCategorySelect(category)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-sm">{category}</span>
            </div>
            <span className="text-sm">{freq}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
