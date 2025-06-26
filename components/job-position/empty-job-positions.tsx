"use client";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Plus, Sparkles } from "lucide-react-native";

interface EmptyJobPositionsProps {
  onCreateClick: () => void;
}

export default function EmptyJobPositions({ onCreateClick }: EmptyJobPositionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D252C] via-[#2A3440] to-[#1D252C] flex items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFC629] rounded-full opacity-5 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#E3AA1F] rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#FFF7DE] rounded-full opacity-5 blur-3xl" />
      </div>

      <Card className="relative z-10 max-w-lg w-full bg-[#FEFBED]/95 backdrop-blur-sm border-2 border-[#FFC629]/30 rounded-3xl shadow-2xl">
        <Box className="p-12 text-center">
          {/* Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#FFC629]/30">
              <Briefcase className="w-12 h-12 text-[#1D252C]" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFF7DE] rounded-full flex items-center justify-center border-2 border-[#FFC629]">
              <Sparkles className="w-4 h-4 text-[#E3AA1F]" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-[#1D252C] mb-4">Start Your Interview Journey</h2>
          <p className="text-[#1D252C]/70 mb-8 leading-relaxed">
            No job positions yet! Add your first position to begin practicing interviews and tracking your progress with AI-powered
            feedback.
          </p>

          {/* CTA Button */}
          <Button
            onPress={onCreateClick}
            className="w-full h-14 bg-gradient-to-r from-[#FFC629] to-[#E3AA1F] text-[#1D252C] hover:from-[#E3AA1F] hover:to-[#FFC629] font-bold text-lg rounded-2xl shadow-lg shadow-[#FFC629]/20 transition-all hover:shadow-xl hover:shadow-[#FFC629]/30 hover:scale-105"
          >
            <Plus className="w-6 h-6 mr-3" />
            Add Your First Position
          </Button>

          {/* Features Preview */}
          <div className="mt-8 pt-8 border-t border-[#FFC629]/20">
            <p className="text-sm text-[#1D252C]/60 mb-4 font-medium">What you can do:</p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FFC629] rounded-full" />
                <span className="text-[#1D252C]/70">Import positions from job URLs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FFC629] rounded-full" />
                <span className="text-[#1D252C]/70">Practice with AI mock interviews</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FFC629] rounded-full" />
                <span className="text-[#1D252C]/70">Get detailed feedback and scores</span>
              </div>
            </div>
          </div>
        </Box>
      </Card>
    </div>
  );
}
