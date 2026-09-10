import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../../types/course.types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/common/Button';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
      {course.thumbnail_url && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', marginBottom: '1.25rem', backgroundColor: '#F1F5F9' }}>
          <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <Badge variant="purple">{course.duration_weeks} Weeks</Badge>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#6366F1' }}>
          {formatCurrency(course.price)}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', lineHeight: 1.3 }}>
        {course.title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>
        {course.short_description}
      </p>

      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: '#94A3B8' }}>
          <Clock size={15} />
          <span>Self-Paced & Live</span>
        </div>
        <Link to={`/courses/${course.slug}`}>
          <Button variant="secondary" size="sm">
            <span>View Syllabus</span>
            <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
