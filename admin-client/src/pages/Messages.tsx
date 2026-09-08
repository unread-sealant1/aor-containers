import React, { useState, useEffect } from 'react';
import { Mail, Send, User, Calendar, Search } from 'lucide-react';
import apiClient from '../api/client';
import './Messages.css';

interface Message {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      // Assuming /admin/messages endpoint exists or will be implemented
      const response = await apiClient.get('/admin/messages');
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch messages');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(m =>
    m.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);
    try {
      const response = await apiClient.post(`/admin/messages/reply`, {
        messageId: selectedMessage._id,
        text: replyText,
      });
      if (response.data.success) {
        setReplyText('');
        // Optionally refresh messages or update the last message of the selected one
        await fetchMessages();
      }
    } catch (err: any) {
      console.error('Error sending reply:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="empty-state">Loading messages...</div>;
  if (error) return <div className="empty-state" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="messages-page">
      <div className="page-header">
        <div>
          <h1>Customer Messages</h1>
          <p>Manage communications with your clients</p>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          <div className="messages-search">
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {messages.length > 0 ? (
            <div className="messages-scroll">
              {filteredMessages.map(msg => (
                <div
                  key={msg._id}
                  className={`message-item ${selectedMessage?._id === msg._id ? 'active' : ''} ${msg.unread ? 'unread' : ''}`}
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="message-avatar">
                    {msg.customerName[0].toUpperCase()}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="customer-name">{msg.customerName}</span>
                      <span className="message-date">{new Date(msg.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="message-subject">{msg.subject}</div>
                    <div className="message-preview">{msg.lastMessage}</div>
                  </div>
                  {msg.unread && <div className="unread-dot" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No messages found</div>
          )}
        </div>

        <div className="messages-detail">
          {selectedMessage ? (
            <div className="detail-container">
              <div className="detail-header">
                <div className="detail-user">
                  <div className="detail-avatar">{selectedMessage.customerName[0].toUpperCase()}</div>
                  <div>
                    <h3>{selectedMessage.customerName}</h3>
                    <p>{selectedMessage.customerEmail}</p>
                  </div>
                </div>
                <div className="detail-meta">
                  <Calendar size={16} />
                  <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="detail-body">
                <div className="message-bubble received">
                  <div className="bubble-meta">From {selectedMessage.customerName}</div>
                  <div className="bubble-text">{selectedMessage.lastMessage}</div>
                </div>
                {/* Additional message history would go here */}
              </div>

              <div className="detail-footer">
                <div className="reply-input">
                  <textarea
                    placeholder="Type your reply..."
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  ></textarea>
                  <button
                    className="btn-send"
                    onClick={handleSendReply}
                    disabled={sending || !replyText.trim()}
                  >
                    <Send size={18} />
                    <span>{sending ? 'Sending...' : 'Send Reply'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="detail-empty">
              <div className="empty-icon">
                <Mail size={48} />
              </div>
              <p>Select a conversation to read the messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
