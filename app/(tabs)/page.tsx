"use client";

import CreateJobPositionModal from "@/components/job-position/create-job-position-modal";
import EmptyJobPositions from "@/components/job-position/empty-job-positions";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { Briefcase, Building2, Calendar, DollarSign, Plus, Search } from "lucide-react-native";
import { useState } from "react";

// Mock data - replace with actual data fetching
const mockJobPositions = [
  {
    id: "1",
    companyName: "Google",
    companyLogo: "/placeholder.svg?height=40&width=40",
    companyWebsite: "https://google.com",
    jobTitle: "Senior UX Designer",
    jobDescription: "We're looking for a Senior UX Designer to join our Android team...",
    salaryRange: "$120k - $180k",
    expectedSalary: "$150k",
    offerReceived: false,
    createdDate: "2024-01-15",
    interviewCount: 3,
  },
  {
    id: "2",
    companyName: "Meta",
    companyLogo: "/placeholder.svg?height=40&width=40",
    companyWebsite: "https://meta.com",
    jobTitle: "Frontend Engineer",
    jobDescription: "Join our team building the future of social technology...",
    salaryRange: "$140k - $200k",
    expectedSalary: "$170k",
    offerReceived: true,
    createdDate: "2024-01-10",
    interviewCount: 5,
  },
];

export default function JobPositionList() {
  const [jobPositions, setJobPositions] = useState(mockJobPositions);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, offers

  const filteredPositions = jobPositions.filter((position) => {
    const matchesSearch =
      position.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "offers" && position.offerReceived) ||
      (filterStatus === "active" && !position.offerReceived);

    return matchesSearch && matchesFilter;
  });

  if (jobPositions.length === 0) {
    return <EmptyJobPositions onCreateClick={() => setShowCreateModal(true)} />;
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-[#1D252C] via-[#2A3440] to-[#1D252C]">
      {/* Background Orbs */}
      <Box className="fixed inset-0 overflow-hidden pointer-events-none">
        <Box className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFC629] rounded-full opacity-5 blur-3xl" />
        <Box className="absolute top-1/3 -left-32 w-80 h-80 bg-[#E3AA1F] rounded-full opacity-5 blur-3xl" />
        <Box className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#FFF7DE] rounded-full opacity-5 blur-3xl" />
      </Box>

      <Box className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <Box className="mb-8">
          <Box className="flex items-center gap-4 mb-6">
            <Box className="w-12 h-12 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFC629]/20">
              <Briefcase className="w-6 h-6 text-[#1D252C]" />
            </Box>
            <Box>
              <Heading className="text-3xl font-bold text-[#FEFBED] tracking-tight">Job Positions</Heading>
              <Text className="text-[#FFF7DE] opacity-80">Track and manage your interview journey</Text>
            </Box>
          </Box>

          {/* Search and Filters */}
          <Box className="flex flex-col sm:flex-row gap-4 mb-6">
            <Box className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1D252C] w-5 h-5" />
              <Input
                // placeholder="Search positions or companies..."
                // value={searchTerm}
                // onChangeText={setSearchTerm}
                className="pl-12 h-12 bg-[#FEFBED] border-2 border-[#FFC629]/20 focus:border-[#FFC629] text-[#1D252C] placeholder:text-[#1D252C]/50 rounded-xl"
              />
            </Box>

            <Box className="flex gap-2">
              <Button
                // // variant={filterStatus === "all" ? "default" : "outline"}
                // // onClick={() => setFilterStatus("all")}
                className={`h-12 px-6 rounded-xl font-semibold transition-all ${
                  filterStatus === "all"
                    ? "bg-[#FFC629] text-[#1D252C] hover:bg-[#E3AA1F] shadow-lg shadow-[#FFC629]/20"
                    : "bg-[#FEFBED]/10 text-[#FEFBED] border-[#FFC629]/30 hover:bg-[#FFC629]/10"
                }`}
              >
                All
              </Button>
              <Button
                // variant={filterStatus === "active" ? "default" : "outline"}
                // onClick={() => setFilterStatus("active")}
                className={`h-12 px-6 rounded-xl font-semibold transition-all ${
                  filterStatus === "active"
                    ? "bg-[#FFC629] text-[#1D252C] hover:bg-[#E3AA1F] shadow-lg shadow-[#FFC629]/20"
                    : "bg-[#FEFBED]/10 text-[#FEFBED] border-[#FFC629]/30 hover:bg-[#FFC629]/10"
                }`}
              >
                Active
              </Button>
              <Button
                // variant={filterStatus === "offers" ? "default" : "outline"}
                // onClick={() => setFilterStatus("offers")}
                className={`h-12 px-6 rounded-xl font-semibold transition-all ${
                  filterStatus === "offers"
                    ? "bg-[#FFC629] text-[#1D252C] hover:bg-[#E3AA1F] shadow-lg shadow-[#FFC629]/20"
                    : "bg-[#FEFBED]/10 text-[#FEFBED] border-[#FFC629]/30 hover:bg-[#FFC629]/10"
                }`}
              >
                Offers
              </Button>
            </Box>

            <Button
              //   onClick={() => setShowCreateModal(true)}
              className="h-12 px-6 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] text-[#1D252C] hover:from-[#E3AA1F] hover:to-[#FFC629] font-bold rounded-xl shadow-lg shadow-[#FFC629]/20 transition-all hover:shadow-xl hover:shadow-[#FFC629]/30"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Position
            </Button>
          </Box>
        </Box>

        {/* Job Positions Grid */}
        {filteredPositions.length === 0 ? (
          <Box className="text-center py-16">
            <Box className="w-20 h-20 bg-[#FFC629]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#FFC629]" />
            </Box>
            <h3 className="text-xl font-semibold text-[#FEFBED] mb-2">No positions found</h3>
            <Text className="text-[#FFF7DE] opacity-70">Try adjusting your search or filters</Text>
          </Box>
        ) : (
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPositions.map((position) => (
              <Card
                key={position.id}
                className="bg-[#FEFBED]/95 backdrop-blur-sm border-2 border-[#FFC629]/20 hover:border-[#FFC629]/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <Heading className="pb-4">
                  <Box className="flex items-start justify-between">
                    <Box className="flex items-center gap-3">
                      <Image
                        source={position.companyLogo || "/placeholder.svg"}
                        alt={`${position.companyName} logo`}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#FFC629]/20"
                      />
                      <Box>
                        <Heading className="text-[#1D252C] text-lg font-bold group-hover:text-[#E3AA1F] transition-colors">
                          {position.jobTitle}
                        </Heading>
                        <Box className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-[#1D252C]/60" />
                          <Text className="text-[#1D252C]/80 font-medium">{position.companyName}</Text>
                        </Box>
                      </Box>
                    </Box>
                    {position.offerReceived && (
                      <Badge className="bg-[#FFC629] text-[#1D252C] font-semibold px-3 py-1 rounded-full">Offer</Badge>
                    )}
                  </Box>
                </Heading>

                <Box className="pt-0">
                  <Text className="text-[#1D252C]/70 text-sm mb-4 line-clamp-2">{position.jobDescription}</Text>

                  <Box className="space-y-3">
                    {position.salaryRange && (
                      <Box className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#E3AA1F]" />
                        <Text className="text-[#1D252C] font-medium text-sm">{position.salaryRange}</Text>
                      </Box>
                    )}

                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1D252C]/60" />
                        <Text className="text-[#1D252C]/60 text-sm">{new Date(position.createdDate).toLocaleDateString()}</Text>
                      </Box>
                      <Badge variant="outline" className="border-[#FFC629]/30 text-[#1D252C] font-medium">
                        {position.interviewCount} interviews
                      </Badge>
                    </Box>
                  </Box>

                  <Box className="mt-4 pt-4 border-t border-[#FFC629]/20">
                    <Button
                      className="w-full bg-[#FFF7DE] text-[#1D252C] hover:bg-[#FFC629] font-semibold rounded-xl transition-all"
                      //   onClick={() => (window.location.href = `/positions/${position.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Create Job Position Modal */}
      <CreateJobPositionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onJobCreated={() => console.log("here")}
        // onJobCreated={(newJob) => {
        //   setJobPositions([...jobPositions, newJob])
        //   setShowCreateModal(false)
        // }}
      />
    </Box>
  );
}
