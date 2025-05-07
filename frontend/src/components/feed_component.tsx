import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';

interface Host { userId: number; name: string | null; avatar?: string | null; }
interface Activity { messageID: number; title: string; body: string; senderID: number; createdAt: string; }

const Sidebar: React.FC = () => {
  const { userId: currentUserId } = useAuth();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [loadingFollow, setLoadingFollow] = useState<number | null>(null);
  const { search } = useLocation();

  useEffect(() => {
    if (currentUserId) {
      apiFetch(`/api/v1/following`)
        
        .then(data => setFollowingIds(data))
        .catch(console.error);
    }
  }, [currentUserId]);

  useEffect(() => {
    apiFetch('/api/v1/users')
      .then(data => setHosts(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const topicId = params.get('topicId');
    const url = topicId ? `/api/v1/messages?topicId=${topicId}` : '/api/v1/messages';
    apiFetch(url)
      .then(data => setActivities(data))
      .catch(console.error);
  }, [search]);

  useEffect(() => {
    fetch('/api/v1/following')
      .then(res => res.json())
      .then(data => setFollowingIds(data.map((user: any) => user.userId)))
      .catch(console.error);
  }, []);

  const handleFollow = async (userId: number) => {
    if (loadingFollow) return;
    setLoadingFollow(userId);
    
    const isFollowing = followingIds.includes(userId);
    const method = isFollowing ? 'DELETE' : 'POST';
    
    try {
      const response = await apiFetch(`/api/v1/follow/${userId}`, { method });
      if (response.ok) {
        setFollowingIds(prev => 
          isFollowing 
            ? prev.filter(id => id !== userId)
            : [...prev, userId]
        );
      }
    } catch (error) {
      console.error('Failed to update follow status:', error);
    } finally {
      setLoadingFollow(null);
    }
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      setActivities(prev => prev.filter(act => act.messageID !== detail));
    };
    window.addEventListener('messageDeleted', handler);
    return () => window.removeEventListener('messageDeleted', handler);
  }, []);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Top Hosts</Typography>
      {hosts.slice(0, 5).map(host => (
        <Card key={host.userId} sx={{ mb: 1, bgcolor: 'grey.800', color: 'grey.100' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={host.avatar || undefined}>
                {!host.avatar && host.name?.charAt(0)}
              </Avatar>
              <Typography>{host.name}</Typography>
            </Stack>
            <Button 
              size="small" 
              variant={followingIds.includes(host.userId) ? "contained" : "outlined"}
              onClick={() => handleFollow(host.userId)}
              disabled={loadingFollow === host.userId}
            >
              {followingIds.includes(host.userId) ? 'Following' : 'Follow'}
            </Button>
          </CardContent>
        </Card>
      ))}

      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Recent Activities</Typography>
      {activities.slice(0, 5).map(act => (
        <Card key={act.messageID} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="subtitle2">{act.title}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>{act.body}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {new Date(act.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Sidebar;