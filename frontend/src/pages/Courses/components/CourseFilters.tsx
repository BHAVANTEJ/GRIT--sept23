import React from 'react';

interface CourseFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({ selectedCategory, onSelectCategory }) => {
  const categories = ['All Programs', 'Web Engineering', 'AI & Agents', 'System Design'];

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: isActive ? '1px solid #6366F1' : '1px solid #E2E8F0',
              backgroundColor: isActive ? '#EEF2FF' : '#FFFFFF',
              color: isActive ? '#4F46E5' : '#475569',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
