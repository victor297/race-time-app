import { AppLayout } from "~/components";
import { FeedScreen } from "~/src/screens";

function FeedsPage() {
  return (
    <AppLayout withBackground={false}>
      <FeedScreen />
    </AppLayout>
  );
}

export default FeedsPage;
