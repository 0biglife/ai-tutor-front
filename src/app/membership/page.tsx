import { MembershipContainer } from "@/components";
import { getMembershipPlans } from "@/lib/apis/membership";
import { Container } from "@chakra-ui/react";

export default async function MembershipPage() {
  const membershipPlans = await getMembershipPlans();

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={8}>
      <MembershipContainer membershipPlan={membershipPlans} />
    </Container>
  );
}
