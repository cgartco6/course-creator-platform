import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profile: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      bio: user?.profile?.bio || '',
      socialLinks: {
        website: user?.profile?.socialLinks?.website || '',
        twitter: user?.profile?.socialLinks?.twitter || '',
        linkedin: user?.profile?.socialLinks?.linkedin || '',
        github: user?.profile?.socialLinks?.github || '',
      }
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    language: user?.preferences?.language || 'en',
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      courseUpdates: user?.preferences?.notifications?.courseUpdates ?? true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.updateProfile(profileForm);
      updateUser(response.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setIsLoading(true);

    try {
      const response = await authAPI.updateProfile({ preferences });
      updateUser(response.data.data);
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Profile Information
                  </h2>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm(prev => ({
                            ...prev,
                            username: e.target.value
                          }))}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          value={profileForm.profile.firstName}
                          onChange={(e) => setProfileForm(prev => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              firstName: e.target.value
                            }
                          }))}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          value={profileForm.profile.lastName}
                          onChange={(e) => setProfileForm(prev => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              lastName: e.target.value
                            }
                          }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group mb-6">
                      <label className="form-label">Bio</label>
                      <textarea
                        value={profileForm.profile.bio}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          profile: {
                            ...prev.profile,
                            bio: e.target.value
                          }
                        }))}
                        rows={4}
                        className="form-textarea"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Social Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {Object.entries(profileForm.profile.socialLinks).map(([platform, url]) => (
                        <div key={platform} className="form-group">
                          <label className="form-label capitalize">
                            {platform}
                          </label>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => setProfileForm(prev => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                socialLinks: {
                                  ...prev.profile.socialLinks,
                                  [platform]: e.target.value
                                }
                              }
                            }))}
                            className="form-input"
                            placeholder={`https://${platform}.com/username`}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Security Settings
                  </h2>
                  <form onSubmit={handlePasswordChange}>
                    <div className="space-y-6 max-w-md">
                      <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({
                              ...prev,
                              currentPassword: e.target.value
                            }))}
                            className="form-input pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({
                              ...prev,
                              newPassword: e.target.value
                            }))}
                            className="form-input pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    <div className="form-group">
                      <label className="form-label">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          language: e.target.value
                        }))}
                        className="form-select"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Email Notifications
                      </h3>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            Marketing Emails
                          </div>
                          <div className="text-sm text-gray-600">
                            Receive updates about new features and promotions
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications.email}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            Course Updates
                          </div>
                          <div className="text-sm text-gray-600">
                            Get notified about course updates and student activity
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications.courseUpdates}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                courseUpdates: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handlePreferencesUpdate}
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Billing & Subscription
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-2xl font-bold mb-2">
                            {user?.subscription?.plan === 'pro' ? 'Pro Plan' : 
                             user?.subscription?.plan === 'enterprise' ? 'Enterprise Plan' : 'Free Plan'}
                          </div>
                          <div className="text-blue-100">
                            {user?.subscription?.plan === 'free' 
                              ? 'Basic features for getting started'
                              : 'Full access to all features'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {user?.subscription?.plan === 'free' ? '$0' :
                             user?.subscription?.plan === 'pro' ? '$29' : '$99'}
                            <span className="text-lg">/month</span>
                          </div>
                        </div>
                      </div>
                      
                      {user?.subscription?.plan === 'free' && (
                        <button className="btn bg-white text-blue-600 hover:bg-blue-50 w-full">
                          Upgrade to Pro
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          name: 'Free',
                          price: '$0',
                          features: ['3 courses', 'Basic AI features', 'Community support']
                        },
                        {
                          name: 'Pro',
                          price: '$29',
                          features: ['Unlimited courses', 'Advanced AI', 'Priority support', 'Analytics']
                        },
                        {
                          name: 'Enterprise',
                          price: '$99',
                          features: ['Everything in Pro', 'Custom AI models', 'Dedicated support', 'White-label']
                        }
                      ].map((plan) => (
                        <div
                          key={plan.name}
                          className={`border rounded-lg p-6 ${
                            user?.subscription?.plan === plan.name.toLowerCase()
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="text-center mb-4">
                            <div className="font-semibold text-gray-900 mb-1">
                              {plan.name}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {plan.price}
                              <span className="text-sm font-normal text-gray-600">/month</span>
                            </div>
                          </div>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button
                            className={`w-full btn ${
                              user?.subscription?.plan === plan.name.toLowerCase()
                                ? 'btn-outline'
                                : plan.name === 'Free'
                                ? 'btn-outline'
                                : 'btn-primary'
                            }`}
                          >
                            {user?.subscription?.plan === plan.name.toLowerCase()
                              ? 'Current Plan'
                              : plan.name === 'Free'
                              ? 'Downgrade'
                              : 'Upgrade'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
