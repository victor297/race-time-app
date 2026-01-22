import { AppLayout } from "~/components";
import { EventScreen } from "~/src/screens";

function EventsPage() {
  return (
    <AppLayout withBackground={false}>
        <EventScreen />
    </AppLayout>
  );
}

export default EventsPage;
