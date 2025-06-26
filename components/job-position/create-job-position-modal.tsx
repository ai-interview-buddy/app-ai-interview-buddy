"use client"

import { Box } from "@/components/ui/box"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import {
    Modal,
    ModalContent,
    ModalHeader
} from "@/components/ui/modal"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, FileText, Link, Loader2 } from "lucide-react-native"
import { useState } from "react"
interface CreateJobPositionModalProps {
  isOpen: boolean
  onClose: () => void
  onJobCreated: (job: any) => void
}

export default function CreateJobPositionModal({ isOpen, onClose, onJobCreated }: CreateJobPositionModalProps) {
  const [method, setMethod] = useState<"url" | "description" | null>(null)
  const [jobUrl, setJobUrl] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUrlSubmit = async () => {
    if (!jobUrl.trim()) return

    setIsLoading(true)
    // Simulate API call to extract job details from URL
    setTimeout(() => {
      const newJob = {
        id: Date.now().toString(),
        companyName: "Extracted Company",
        companyLogo: "/placeholder.svg?height=40&width=40",
        jobTitle: "Extracted Position",
        jobDescription: "Job details extracted from URL...",
        salaryRange: "$100k - $150k",
        expectedSalary: "",
        offerReceived: false,
        createdDate: new Date().toISOString().split("T")[0],
        interviewCount: 0,
      }
      onJobCreated(newJob)
      setIsLoading(false)
      resetForm()
    }, 2000)
  }

  const handleDescriptionSubmit = async () => {
    if (!jobDescription.trim()) return

    setIsLoading(true)
    // Simulate API call to extract job details from description
    setTimeout(() => {
      const newJob = {
        id: Date.now().toString(),
        companyName: "Extracted Company",
        companyLogo: "/placeholder.svg?height=40&width=40",
        jobTitle: "Extracted Position",
        jobDescription: jobDescription,
        salaryRange: "",
        expectedSalary: "",
        offerReceived: false,
        createdDate: new Date().toISOString().split("T")[0],
        interviewCount: 0,
      }
      onJobCreated(newJob)
      setIsLoading(false)
      resetForm()
    }, 2000)
  }

  const resetForm = () => {
    setMethod(null)
    setJobUrl("")
    setJobDescription("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent className="max-w-2xl bg-[#FEFBED] border-2 border-[#FFC629]/30 rounded-2xl">
        <ModalHeader>
          <Heading className="text-2xl font-bold text-[#1D252C] text-center mb-2">Add New Job Position</Heading>
          <Text className="text-[#1D252C]/70 text-center">Choose how you'd like to add your job position</Text>
        </ModalHeader>

        <Box className="space-y-6 mt-6">
          {!method ? (
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* URL Method */}
              <Card
                className="cursor-pointer border-2 border-[#FFC629]/20 hover:border-[#FFC629]/60 transition-all hover:shadow-lg hover:shadow-[#FFC629]/10 rounded-xl"
                // onClick={() => setMethod("url")}
              >
                <Box className="p-6 text-center">
                  <Box className="w-16 h-16 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Link className="w-8 h-8 text-[#1D252C]" />
                  </Box>
                  <Heading className="font-bold text-[#1D252C] mb-2">From Job URL</Heading>
                  <Text className="text-[#1D252C]/70 text-sm">
                    Paste a job posting URL and we'll extract all the details automatically
                  </Text>
                </Box>
              </Card>

              {/* Description Method */}
              <Card
                className="cursor-pointer border-2 border-[#FFC629]/20 hover:border-[#FFC629]/60 transition-all hover:shadow-lg hover:shadow-[#FFC629]/10 rounded-xl"
                // onClick={() => setMethod("description")}
              >
                <Box className="p-6 text-center">
                  <Box className="w-16 h-16 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[#1D252C]" />
                  </Box>
                  <Heading className="font-bold text-[#1D252C] mb-2">From Description</Heading>
                  <Text className="text-[#1D252C]/70 text-sm">
                    Paste the job description and we'll extract the key information
                  </Text>
                </Box>
              </Card>
            </Box>
          ) : method === "url" ? (
            <Box className="space-y-4">
              <Box>
                <Text className="block text-sm font-semibold text-[#1D252C] mb-2">Job Posting URL</Text>
                <Input
                //   placeholder="https://company.com/careers/job-posting"
                //   value={jobUrl}
                //   onChange={(e) => setJobUrl(e.target.value)}
                  className="h-12 bg-[#FFF7DE] border-2 border-[#FFC629]/20 focus:border-[#FFC629] text-[#1D252C] rounded-xl"
                />
                <Text className="text-xs text-[#1D252C]/60 mt-2">
                  Supported: LinkedIn, Indeed, Google Careers, and most job boards
                </Text>
              </Box>

              <Box className="flex gap-3">
                <Button
                //   onClick={() => setMethod(null)}
                  variant="outline"
                  className="flex-1 h-12 border-[#FFC629]/30 text-[#1D252C] hover:bg-[#FFC629]/10 rounded-xl"
                >
                  Back
                </Button>
                <Button
                //   onClick={handleUrlSubmit}
                  disabled={!jobUrl.trim() || isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] text-[#1D252C] hover:from-[#E3AA1F] hover:to-[#FFC629] font-semibold rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Extract Details
                    </>
                  )}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box className="space-y-4">
              <Box>
                <Text className="block text-sm font-semibold text-[#1D252C] mb-2">Job Description</Text>
                <Textarea
                //   placeholder="Paste the complete job description here..."
                //   value={jobDescription}
                //   onChange={(e) => setJobDescription(e.target.value)}
                //   rows={8}
                  className="bg-[#FFF7DE] border-2 border-[#FFC629]/20 focus:border-[#FFC629] text-[#1D252C] rounded-xl resize-none"
                />
                <Text className="text-xs text-[#1D252C]/60 mt-2">
                  Include company name, role title, requirements, and any other relevant details
                </Text>
              </Box>

              <Box className="flex gap-3">
                <Button
                //   onClick={() => setMethod(null)}
                  variant="outline"
                  className="flex-1 h-12 border-[#FFC629]/30 text-[#1D252C] hover:bg-[#FFC629]/10 rounded-xl"
                >
                  Back
                </Button>
                <Button
                //   onClick={handleDescriptionSubmit}
                  disabled={!jobDescription.trim() || isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] text-[#1D252C] hover:from-[#E3AA1F] hover:to-[#FFC629] font-semibold rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Position
                    </>
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </ModalContent>
    </Modal>
  )
}
