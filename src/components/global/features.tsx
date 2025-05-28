import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wand2,
  BarChart3,
  Palette,
  Clock,
  FileText,
  Layers,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Wand2 className="h-6 w-6 text-purple-400" />,
      title: "AI-Powered Conversion",
      description:
        "Our advanced AI analyzes your content and structures it into a coherent presentation.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-400" />,
      title: "Data Visualization",
      description:
        "Automatically converts tables and data into beautiful charts and graphs.",
    },
    {
      icon: <Palette className="h-6 w-6 text-purple-400" />,
      title: "Customizable Templates",
      description:
        "Choose from various templates or customize to match your brand.",
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      title: "Save Time",
      description:
        "Create professional presentations in seconds instead of hours.",
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-400" />,
      title: "Multiple File Formats",
      description: "Support for PDF, PowerPoint, Word, Excel, and more.",
    },
    {
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      title: "Export Options",
      description:
        "Export your presentation in various formats including PPTX, PDF, and images.",
    },
  ];

  return (
    <section id="features" className="py-12 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Powerful Features
        </h2>
        <p className="mb-12 text-lg text-gray-400">
          Our AI-powered tool offers everything you need to create stunning
          presentations.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-gray-800 bg-gray-900/50 text-left backdrop-blur-sm"
            >
              <CardHeader className="pb-2">
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
