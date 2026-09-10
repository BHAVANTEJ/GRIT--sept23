import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { User, Mail, Shield } from 'lucide-react';
import './Profile.css';

export const Profile: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <MainLayout>
      <div className="profile-page">
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <Badge variant="purple">USER PROFILE</Badge>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem' }}>
              Account Settings
            </h1>
          </div>

          <Card hoverable={false} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <User size={18} color="#6366F1" />
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{profile?.full_name || 'Not provided'}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <Mail size={18} color="#6366F1" />
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{user?.email}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '0.35rem' }}>
                  Role
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <Shield size={18} color="#6366F1" />
                  <span style={{ fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' }}>{profile?.role || 'student'}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
