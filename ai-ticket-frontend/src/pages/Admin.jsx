import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import Skeleton from '../ui/Skeleton';
import Empty from '../ui/Empty';
import { users } from '../lib/api';
import { formatDate } from '../lib/formatters';
import { useToast } from '../ui/Toast';

const Admin = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    role: '',
    skills: '',
  });
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await users.getAll();
      setUserList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = userList.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      role: user.role,
      skills: user.skills?.join(', ') || '',
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setUpdating(true);
      const skillsArray = editForm.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);

      await users.update({
        email: editingUser.email,
        role: editForm.role,
        skills: skillsArray,
      });

      toast.success('User updated successfully');
      setEditingUser(null);
      setEditForm({ role: '', skills: '' });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'moderator':
        return 'warning';
      case 'user':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <Skeleton width="200px" height="32px" />
          <Skeleton width="120px" height="40px" />
        </div>
        
        <Card>
          <Card.Content>
            <Skeleton width="300px" height="40px" className="mb-6" />
            
            <div className="space-y-4">
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
    <div className="admin-page">
      <div className="admin-header">
        <h1>User Management</h1>
        <Button disabled>
          Add User
          <span className="tooltip">Feature coming soon</span>
        </Button>
      </div>

      <Card>
        <Card.Content>
          <div className="admin-controls">
            <Input
              placeholder="Search users by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <Empty
              title="No users found"
              description={searchQuery ? "No users match your search criteria" : "No users in the system"}
            />
          ) : (
            <Table stickyHeader>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>User</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Skills</Table.HeaderCell>
                  <Table.HeaderCell>Joined</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredUsers.map((user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="user-email">{user.email}</div>
                          <div className="user-id">ID: {user._id.slice(-8)}</div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="skills-cell">
                        {user.skills && user.skills.length > 0 ? (
                          <div className="skills-list">
                            {user.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" size="sm">
                                {skill}
                              </Badge>
                            ))}
                            {user.skills.length > 3 && (
                              <Badge variant="default" size="sm">
                                +{user.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">No skills</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-muted">
                        {formatDate(user.createdAt)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card.Content>
      </Card>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        size="md"
      >
        {editingUser && (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="user-info-display">
              <div className="user-avatar-large">
                {editingUser.email[0].toUpperCase()}
              </div>
              <div>
                <div className="user-email-large">{editingUser.email}</div>
                <div className="user-id-small">ID: {editingUser._id}</div>
              </div>
            </div>

            <Select
              label="Role"
              value={editForm.role}
              onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
              required
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </Select>

            <Input
              label="Skills"
              value={editForm.skills}
              onChange={(e) => setEditForm(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="React, Node.js, Python (comma-separated)"
              helperText="Enter skills separated by commas"
            />

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updating}
              >
                Update User
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Admin;