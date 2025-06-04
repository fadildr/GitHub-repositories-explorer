"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  onBack: () => void;
  backText?: string;
}

export function PageHeader({
  onBack,
  backText = "Back to Search",
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {backText}
      </Button>
    </div>
  );
}
