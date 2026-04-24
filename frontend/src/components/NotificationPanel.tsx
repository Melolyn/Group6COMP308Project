import { useQuery } from "@apollo/client/react";import { GET_MY_NOTIFICATIONS } from "../graphql/notificationQueries";

export default function NotificationPanel() {
  const { data, loading, error } = useQuery(GET_MY_NOTIFICATIONS);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Failed to load notifications.</div>;

  const notifications = data?.myNotifications ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-sm text-slate-500">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <p className="text-sm text-slate-800">{notification.message}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}