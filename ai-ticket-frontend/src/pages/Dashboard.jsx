import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import Empty from '../ui/Empty';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { tickets } from '../lib/api';
import { formatRelativeTime, getPriorityVariant, getStatusVariant } from '../lib/formatters';
import { useToast } from '../ui/Toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    openTickets: 0,
    highPriority: 0,
    avgResponseTime: '2.4h',
    breachRisk: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveFeedEnabled, setLiveFeedEnabled] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      const data = await tickets.getAll();
      const ticketList = Array.isArray(data) ? data : data.tickets || [];
      
      // Calculate stats
      const openCount = ticketList.filter(t => t.status !== 'done').length;
      const highPriorityCount = ticketList.filter(t => t.priority === 'high').length;
      const breachRiskCount = ticketList.filter(t => {
        const created = new Date(t.createdAt);
        const hoursSinceCreated = (Date.now() - created.getTime()) / (1000 * 60 * 60);
        return hoursSinceCreated > 24 && t.status !== 'done';
      }).length;

      setStats({
        openTickets: openCount,
        highPriority: highPriorityCount,
        avgResponseTime: '2.4h', // Mock data
        breachRisk: breachRiskCount,
      });

      // Get recent tickets (last 10)
      const sortedTickets = ticketList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      
      setRecentTickets(sortedTickets);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling for live feed
    let interval;
    if (liveFeedEnabled) {
      interval = setInterval(fetchDashboardData, 15000); // Poll every 15 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveFeedEnabled]);

  const StatCard = ({ title, value, icon, variant = 'default', trend }) => (
    <Card className="stat-card">
      <div className="stat-content">
        <div className="stat-header">
          <div className="stat-icon">
            {icon}
          </div>
          <div className="stat-info">
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
          </div>
        </div>
        {trend && (
          <div className={`stat-trend stat-trend--${trend.type}`}>
            {trend.type === 'up' ? '↗' : '↘'} {trend.value}
          </div>
        )}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        
        <div className="dashboard-stats">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="stat-card">
              <Skeleton height="80px" />
            </Card>
          ))}
        </div>
        
        <div className="dashboard-content">
          <Card>
            <Card.Header>
              <Skeleton width="200px" height="24px" />
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} height="60px" />
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          <Button
            variant={liveFeedEnabled ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setLiveFeedEnabled(!liveFeedEnabled)}
          >
            {liveFeedEnabled ? 'Live Feed On' : 'Live Feed Off'}
          </Button>
          <Link to="/tickets">
            <Button variant="primary">Create Ticket</Button>
          </Link>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 2a1 1 0 000 2h6a1 1 0 100-2H9z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h8v1a1 1 0 102 0V3a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h10a1 1 0 100-2H7z" fill="currentColor"/>
            </svg>
          }
        />
        
        <StatCard
          title="High Priority"
          value={stats.highPriority}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        
        <StatCard
          title="Avg Response"
          value={stats.avgResponseTime}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
            </svg>
          }
        />
        
        <StatCard
          title="Breach Risk"
          value={stats.breachRisk}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
      </div>

      <div className="dashboard-content">
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2>Recent Activity</h2>
              {liveFeedEnabled && (
                <div className="live-indicator">
                  <div className="live-dot" />
                  Live
                </div>
              )}
            </div>
          </Card.Header>
          <Card.Content>
            {recentTickets.length === 0 ? (
              <Empty
                title="No recent activity"
                description="Tickets will appear here as they are created or updated"
                action={
                  <Link to="/tickets">
                    <Button variant="primary">Create First Ticket</Button>
                  </Link>
                }
              />
            ) : (
              <div className="activity-list">
                {recentTickets.map((ticket) => (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    className="activity-item"
                  >
                    <div className="activity-content">
                      <div className="activity-header">
                        <h3 className="activity-title">{ticket.title}</h3>
                        <div className="activity-badges">
                          {ticket.priority && (
                            <Badge variant={getPriorityVariant(ticket.priority)} size="sm">
                              {ticket.priority}
                            </Badge>
                          )}
                          <Badge variant={getStatusVariant(ticket.status)} size="sm">
                            {ticket.status || 'todo'}
                          </Badge>
                        </div>
                      </div>
                      <p className="activity-description">
                        {ticket.description?.substring(0, 100)}
                        {ticket.description?.length > 100 ? '...' : ''}
                      </p>
                      <div className="activity-meta">
                        <span className="activity-time">
                          {formatRelativeTime(ticket.createdAt)}
                        </span>
                        {ticket.assignedTo && (
                          <span className="activity-assignee">
                            Assigned to {ticket.assignedTo.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;