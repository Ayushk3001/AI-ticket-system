import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Skeleton from '../ui/Skeleton';
import Tabs from '../ui/Tabs';
import { tickets, users } from '../lib/api';
import { formatDate, getPriorityVariant, getStatusVariant, getConfidenceColor, formatConfidence } from '../lib/formatters';
import { useToast } from '../ui/Toast';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rerunningAI, setRerunningAI] = useState(false);
  const { toast } = useToast();

  const fetchTicket = async () => {
    try {
      const data = await tickets.getById(id);
      setTicket(data.ticket || data);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      toast.error('Failed to load ticket');
      navigate('/tickets');
    }
  };

  const fetchModerators = async () => {
    try {
      const data = await users.getAll();
      const moderatorList = data.filter(user => 
        user.role === 'moderator' || user.role === 'admin'
      );
      setModerators(moderatorList);
    } catch (error) {
      console.error('Failed to fetch moderators:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTicket(), fetchModerators()]);
      setLoading(false);
    };
    
    if (id) {
      loadData();
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await tickets.update(id, { status: newStatus });
      setTicket(prev => ({ ...prev, status: newStatus }));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssigneeChange = async (assigneeId) => {
    try {
      setUpdating(true);
      await tickets.update(id, { assignedTo: assigneeId });
      const assignee = moderators.find(m => m._id === assigneeId);
      setTicket(prev => ({ ...prev, assignedTo: assignee }));
      toast.success('Assignee updated successfully');
    } catch (error) {
      console.error('Failed to update assignee:', error);
      toast.error('Failed to update assignee');
    } finally {
      setUpdating(false);
    }
  };

  const handleRerunAI = async () => {
    try {
      setRerunningAI(true);
      // Mock AI rerun - in real app this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('AI analysis completed');
      fetchTicket(); // Refresh ticket data
    } catch (error) {
      console.error('Failed to rerun AI:', error);
      toast.error('Failed to rerun AI analysis');
    } finally {
      setRerunningAI(false);
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail">
        <div className="ticket-header">
          <Skeleton width="300px" height="32px" />
          <Skeleton width="100px" height="40px" />
        </div>
        
        <div className="ticket-content">
          <div className="ticket-main">
            <Card>
              <Card.Content>
                <Skeleton height="200px" />
              </Card.Content>
            </Card>
          </div>
          
          <div className="ticket-sidebar">
            <Card>
              <Card.Content>
                <Skeleton height="300px" />
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail">
        <div className="ticket-not-found">
          <h1>Ticket not found</h1>
          <Button onClick={() => navigate('/tickets')}>
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  const mockAIInsights = {
    category: ticket.category || 'Technical Issue',
    confidence: 0.87,
    requiredSkills: ticket.relatedSkills || ['React', 'Node.js', 'Database'],
    type: 'Bug Report',
    rationale: ticket.helpfulNotes || 'This ticket appears to be a technical issue based on the description mentioning database connectivity problems. The required skills suggest backend and database expertise.',
  };

  return (
    <div className="ticket-detail">
      <div className="ticket-header">
        <div className="ticket-header-left">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tickets')}
          >
            ← Back to Tickets
          </Button>
          <div className="ticket-header-info">
            <h1>{ticket.title}</h1>
            <div className="ticket-meta">
              <span>#{ticket._id?.slice(-8)}</span>
              <span>•</span>
              <span>Created {formatDate(ticket.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="ticket-header-actions">
          <Select
            value={ticket.status || 'todo'}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
          
          {ticket.priority && (
            <Badge variant={getPriorityVariant(ticket.priority)}>
              {ticket.priority} Priority
            </Badge>
          )}
        </div>
      </div>

      <div className="ticket-content">
        <div className="ticket-main">
          <Tabs defaultValue="details">
            <Tabs.List>
              <Tabs.Trigger tabValue="details">Details</Tabs.Trigger>
              <Tabs.Trigger tabValue="activity">Activity</Tabs.Trigger>
              <Tabs.Trigger tabValue="comments">Comments</Tabs.Trigger>
            </Tabs.List>
            
            <Tabs.Content tabValue="details">
              <Card>
                <Card.Header>
                  <h2>Description</h2>
                </Card.Header>
                <Card.Content>
                  <div className="ticket-description">
                    {ticket.description}
                  </div>
                  
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="ticket-attachments">
                      <h3>Attachments</h3>
                      <div className="attachments-list">
                        {ticket.attachments.map((attachment, index) => (
                          <div key={index} className="attachment-item">
                            📎 {attachment.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Content>
              </Card>
            </Tabs.Content>
            
            <Tabs.Content tabValue="activity">
              <Card>
                <Card.Header>
                  <h2>Activity Timeline</h2>
                </Card.Header>
                <Card.Content>
                  <div className="activity-timeline">
                    <div className="timeline-item">
                      <div className="timeline-marker timeline-marker--created" />
                      <div className="timeline-content">
                        <div className="timeline-title">Ticket Created</div>
                        <div className="timeline-time">{formatDate(ticket.createdAt)}</div>
                      </div>
                    </div>
                    
                    {ticket.helpfulNotes && (
                      <div className="timeline-item">
                        <div className="timeline-marker timeline-marker--ai" />
                        <div className="timeline-content">
                          <div className="timeline-title">AI Analysis Completed</div>
                          <div className="timeline-time">
                            {formatDate(new Date(Date.now() - 5 * 60 * 1000))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {ticket.assignedTo && (
                      <div className="timeline-item">
                        <div className="timeline-marker timeline-marker--assigned" />
                        <div className="timeline-content">
                          <div className="timeline-title">
                            Assigned to {ticket.assignedTo.email}
                          </div>
                          <div className="timeline-time">
                            {formatDate(new Date(Date.now() - 3 * 60 * 1000))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Tabs.Content>
            
            <Tabs.Content tabValue="comments">
              <Card>
                <Card.Header>
                  <h2>Comments</h2>
                </Card.Header>
                <Card.Content>
                  <div className="comments-placeholder">
                    <p>No comments yet. Comments feature coming soon!</p>
                  </div>
                </Card.Content>
              </Card>
            </Tabs.Content>
          </Tabs>
        </div>

        <div className="ticket-sidebar">
          <Card>
            <Card.Header>
              <div className="ai-insights-header">
                <h2>🤖 AI Insights</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRerunAI}
                  loading={rerunningAI}
                >
                  Re-analyze
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="ai-insights">
                <div className="insight-item">
                  <label>Category</label>
                  <Badge variant="info">{mockAIInsights.category}</Badge>
                </div>
                
                <div className="insight-item">
                  <label>Confidence</label>
                  <Badge variant={getConfidenceColor(mockAIInsights.confidence)}>
                    {formatConfidence(mockAIInsights.confidence)}
                  </Badge>
                </div>
                
                <div className="insight-item">
                  <label>Type</label>
                  <span>{mockAIInsights.type}</span>
                </div>
                
                <div className="insight-item">
                  <label>Required Skills</label>
                  <div className="skills-list">
                    {mockAIInsights.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="insight-item">
                  <label>Why this assignment?</label>
                  <div className="rationale">
                    <div className="rationale-icon">💡</div>
                    <p>{mockAIInsights.rationale}</p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h2>Assignment</h2>
            </Card.Header>
            <Card.Content>
              <div className="assignment-section">
                <Select
                  label="Assignee"
                  value={ticket.assignedTo?._id || ''}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  disabled={updating}
                >
                  <option value="">Unassigned</option>
                  {moderators.map((moderator) => (
                    <option key={moderator._id} value={moderator._id}>
                      {moderator.email} ({moderator.role})
                    </option>
                  ))}
                </Select>
                
                {!ticket.assignedTo && (
                  <div className="assignment-note">
                    <p>💡 AI will automatically assign to the best matching moderator based on skills</p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;