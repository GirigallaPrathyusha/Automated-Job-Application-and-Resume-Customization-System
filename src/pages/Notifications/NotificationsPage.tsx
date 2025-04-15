
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { CheckCircle, Info, AlertCircle, AlertTriangle } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'info':
        return <Info className="h-5 w-5 text-info" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-2">
            Stay updated on your job applications
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <div className="divide-y">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-6 ${!notification.read ? 'bg-appPurple-light' : ''} hover:bg-gray-50`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.date).toLocaleString()}
                      </span>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs text-appPurple"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Info className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any notifications yet.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {notifications.length > 0 && (
        <div className="flex justify-center mt-4">
          <nav className="inline-flex space-x-1">
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              1
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
              2
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
              3
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
              4
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
