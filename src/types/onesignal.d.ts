export {};

declare global {
  type RoadeyosOneSignalSdk = {
    init: (options: Record<string, unknown>) => Promise<void>;
    Notifications: {
      permission: boolean;
      requestPermission: () => Promise<void>;
    };
    User: {
      PushSubscription: {
        id?: string | null;
        optedIn?: boolean;
        optIn: () => Promise<void>;
        optOut: () => Promise<void>;
        addEventListener: (event: "change", callback: () => void) => void;
      };
    };
  };

  interface Window {
    OneSignalDeferred?: Array<(oneSignal: RoadeyosOneSignalSdk) => void | Promise<void>>;
    roadeyosOneSignal?: RoadeyosOneSignalSdk;
    roadeyosOneSignalQueued?: boolean;
  }
}
