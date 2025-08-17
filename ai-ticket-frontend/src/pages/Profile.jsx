import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { useToast } from '../ui/Toast';

const Profile = () => {
  const [user, setUser] = useState({});
  const [theme, setTheme] = useState('light');
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
  });
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setProfileForm({
      displayName: userData.displayName || userData.email || '',
      email: userData.email || '',
    });

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      // Mock profile update - in real app this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, displayName: profileForm.displayName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
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

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile Settings</h1>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <Card>
            <Card.Header>
              <h2>Account Information</h2>
            </Card.Header>
            <Card.Content>
              <div className="profile-info">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="profile-details">
                    <h3>{profileForm.displayName || user.email}</h3>
                    <div className="profile-meta">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role || 'user'}
                      </Badge>
                      {user.skills && user.skills.length > 0 && (
                        <div className="profile-skills">
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
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <Input
                    label="Display Name"
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Enter your display name"
                  />

                  <Input
                    label="Email"
                    value={profileForm.email}
                    disabled
                    helperText="Email cannot be changed"
                  />

                  <div className="form-actions">
                    <Button
                      type="submit"
                      loading={updating}
                    >
                      Update Profile
                    </Button>
                  </div>
                </form>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="profile-sidebar">
          <Card>
            <Card.Header>
              <h2>Preferences</h2>
            </Card.Header>
            <Card.Content>
              <div className="preferences-section">
                <Select
                  label="Theme"
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>

                <div className="preference-item">
                  <label>Notifications</label>
                  <div className="notification-settings">
                    <div className="notification-option">
                      <input type="checkbox" id="email-notifications" defaultChecked />
                      <label htmlFor="email-notifications">Email notifications</label>
                    </div>
                    <div className="notification-option">
                      <input type="checkbox" id="ticket-updates" defaultChecked />
                      <label htmlFor="ticket-updates">Ticket updates</label>
                    </div>
                    <div className="notification-option">
                      <input type="checkbox" id="assignment-notifications" defaultChecked />
                      <label htmlFor="assignment-notifications">Assignment notifications</label>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h2>Account Stats</h2>
            </Card.Header>
            <Card.Content>
              <div className="account-stats">
                <div className="stat-item">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Tickets Created</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">8</div>
                  <div className="stat-label">Tickets Resolved</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">2.4h</div>
                  <div className="stat-label">Avg Response Time</div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;