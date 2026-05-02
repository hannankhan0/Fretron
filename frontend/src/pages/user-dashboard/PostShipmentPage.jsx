import { useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import ShipmentLocationMap from "../../components/maps/ShipmentLocationMap";

export default function PostShipmentPage() {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  return (
    <UserDashboardShell mapMode>
      <div className="h-full w-full">
        <ShipmentLocationMap
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          onPickupChange={setPickupLocation}
          onDestinationChange={setDestinationLocation}
        />
      </div>
    </UserDashboardShell>
  );
}