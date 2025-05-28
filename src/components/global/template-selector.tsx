"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Template = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal");

  const templates: Template[] = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean and simple design with focus on content",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional design for business presentations",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and colorful design for creative presentations",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "data",
      name: "Data-Focused",
      description: "Optimized for data visualization and charts",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  return (
    <section id="templates" className="py-12 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Choose Your Template
        </h2>
        <p className="mb-12 text-lg text-gray-600">
          Select from our professionally designed templates or let our AI choose
          the best one for your content.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedTemplate === template.id
                  ? "ring-2 ring-purple-500"
                  : "hover:border-gray-300"
              )}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={template.name}
                    className="h-full w-full object-cover"
                  />
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="rounded-full bg-white p-1">
                        <Check className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-left">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="outline" className="w-full">
            Let AI Choose the Best Template
          </Button>
        </div>
      </div>
    </section>
  );
}
