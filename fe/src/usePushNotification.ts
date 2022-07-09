import { useEffect, useState } from "react";
import axios from "axios";
import * as serviceWorker from "./service-worker";

const isSupported = serviceWorker.isPushNotificationSupported();

export const usePushNotification = () => {
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
          const subscription = await serviceWorker.getUserSubscription();
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
      const permission = await serviceWorker.askUserPermission();
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
      const subscription = await serviceWorker.createNotificationSubscription();
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
