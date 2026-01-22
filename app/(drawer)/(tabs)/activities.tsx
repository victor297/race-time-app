import { AppLayout } from "~/components";
import { ActivityScreen } from "~/src/screens";

function ActivitiesPage() {
  return (
    <AppLayout withBackground={false}>
      <ActivityScreen />
    </AppLayout>
  );
}

export default ActivitiesPage;
