import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import Skeleton from '../ui/Skeleton';
import Empty from '../ui/Empty';
import Modal from '../ui/Modal';
import { tickets } from '../lib/api';
import { formatRelativeTime, getPriorityVariant, getStatusVariant, truncateText } from '../lib/formatters';
import { useToast } from '../ui/Toast';

const TicketsList = () => {
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    status: '',
    assignee: '',
  });
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await tickets.getAll(filters);
      const ticketArray = Array.isArray(data) ? data : data.tickets || [];
      setTicketList(ticketArray);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchTickets();
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setCreateLoading(true);
      await tickets.create(createForm);
      toast.success('Ticket created successfully');
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '' });
      fetchTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to create ticket');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === ticketList.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(ticketList.map(t => t._id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedTickets.length === 0) {
      toast.warning('Please select tickets first');
      return;
    }

    toast.info(`Bulk ${action} action would be performed on ${selectedTickets.length} tickets`);
    // TODO: Implement bulk actions when API supports it
  };

  if (loading) {
    return (
      <div className="tickets-page">
        <div className="tickets-header">
          <Skeleton width="200px" height="32px" />
          <Skeleton width="120px" height="40px" />
        </div>
        
        <Card>
          <Card.Content>
            <div className="filters-row">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} width="200px" height="40px" />
              ))}
            </div>
            
            <div className="space-y-4 mt-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} height="60px" />
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <h1>Tickets</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Ticket
        </Button>
      </div>

      <Card>
        <Card.Content>
          <div className="filters-section">
            <div className="filters-row">
              <Input
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              
              <Select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
              
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
              
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {selectedTickets.length > 0 && (
              <div className="bulk-actions">
                <span className="bulk-selected">
                  {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} selected
                </span>
                <div className="bulk-buttons">
                  <Button size="sm" variant="secondary" onClick={() => handleBulkAction('status')}>
                    Change Status
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleBulkAction('assign')}>
                    Reassign
                  </Button>
                </div>
              </div>
            )}
          </div>

          {ticketList.length === 0 ? (
            <Empty
              title="No tickets found"
              description="Create your first ticket to get started with AI-powered ticket management"
              action={
                <Button onClick={() => setShowCreateModal(true)}>
                  Create First Ticket
                </Button>
              }
            />
          ) : (
            <Table stickyHeader>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <input
                      type="checkbox"
                      checked={selectedTickets.length === ticketList.length}
                      onChange={handleSelectAll}
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Priority</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Assignee</Table.HeaderCell>
                  <Table.HeaderCell>Updated</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {ticketList.map((ticket) => (
                  <Table.Row key={ticket._id} clickable>
                    <Table.Cell>
                      <input
                        type="checkbox"
                        checked={selectedTickets.includes(ticket._id)}
                        onChange={() => handleSelectTicket(ticket._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/tickets/${ticket._id}`} className="ticket-link">
                        <div className="ticket-title">{ticket.title}</div>
                        <div className="ticket-description">
                          {truncateText(ticket.description, 80)}
                        </div>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {ticket.priority && (
                        <Badge variant={getPriorityVariant(ticket.priority)} size="sm">
                          {ticket.priority}
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStatusVariant(ticket.status)} size="sm">
                        {ticket.status || 'todo'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {ticket.assignedTo ? (
                        <div className="assignee">
                          <div className="assignee-avatar">
                            {ticket.assignedTo.email[0].toUpperCase()}
                          </div>
                          <span className="assignee-email">
                            {ticket.assignedTo.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted">Unassigned</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-muted">
                        {formatRelativeTime(ticket.createdAt)}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card.Content>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Ticket"
        size="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Title"
            value={createForm.title}
            onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Brief description of the issue"
            required
          />
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input"
              value={createForm.description}
              onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the issue"
              rows={4}
              required
            />
          </div>
          
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createLoading}
            >
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TicketsList;