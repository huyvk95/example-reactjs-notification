import { useEffect, useState } from "react";
import axios from "axios";

export const usePushNotification = () => {
  const isSupported = "serviceWorker" in navigator && "PushManager" in window;
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [subscriptionId, setSubscriptionId] = useState<string>();
  const [consent, setConsent] = useState<NotificationPermission>(
    Notification.permission
  );
  const [error, setError] = useState<Error | unknown>();
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionId = async (
    subscription?: PushSubscription | null
  ) => {
    if (!subscription) throw new Error("Subscription must exist");
    const { data } = await axios.post(
      `http://localhost:${process.env.REACT_APP_BE_PORT}/subscription`,
      { data: subscription }
    );
    setSubscriptionId(data.id);
    localStorage.setItem("subscriptionId", data.id);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const subscriptionId = localStorage.getItem("subscriptionId");
        if (subscriptionId) {
          setSubscriptionId(subscriptionId);
        } else {
          const serviceWorker = await navigator.serviceWorker.ready;
          const subscription =
            await serviceWorker.pushManager.getSubscription();
          await fetchSubscriptionId(subscription);
        }
      } catch (error) {
        // setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onClickAskPermission = async () => {
    try {
      setLoading(true);
      setError(null);
      const permission = await Notification.requestPermission();
      setConsent(permission);
      if (permission !== "granted")
        throw new Error("You denied the consent to receive notifications");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickSubscriber = async () => {
    try {
      setLoading(true);
      setError(null);
      const serviceWorker = await navigator.serviceWorker.ready;
      const subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_PUBLIC_KEY,
      });
      setSubscription(subscription);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickSendSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchSubscriptionId(subscription);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    consent,
    isSupported,
    subscription,
    subscriptionId,
    onClickAskPermission,
    onClickSendSubscription,
    onClickSubscriber,
  };
};
