import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { usePushNotification } from "./usePushNotification";

function App() {
  const {
    consent,
    error,
    isSupported,
    loading,
    subscription,
    subscriptionId,
    onClickAskPermission,
    onClickSendSubscription,
    onClickSubscriber,
  } = usePushNotification();

  const onClickCopy = () => {
    const text = (document.getElementById("subscriptionId") as any).value;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <button
            disabled={!isSupported || consent === "granted"}
            onClick={onClickAskPermission}
          >
            Ask permission
          </button>
          <button
            disabled={Boolean(subscriptionId) || Boolean(subscription)}
            onClick={onClickSubscriber}
          >
            Create subscriber
          </button>
          <button
            disabled={Boolean(subscriptionId)}
            onClick={onClickSendSubscription}
          >
            Push subscriber
          </button>
        </div>
        <div>
          <input
            value={subscriptionId}
            placeholder={"Subscription ID"}
            id="subscriptionId"
            style={{ marginTop: 10 }}
            disabled
          />
          <button onClick={onClickCopy}>Copy</button>
        </div>
        {Boolean(loading) && <p>Loading</p>}
        {Boolean(error) && <p>{String(error)}</p>}
      </header>
    </div>
  );
}

export default App;
