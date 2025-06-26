"use client";

import CreateJobPositionModal from "@/components/job-position/create-job-position-modal";

export default function JobPositionList() {
  return <CreateJobPositionModal isOpen={true} onClose={() => console.log("close")} onJobCreated={() => console.log("created")} />;
}
