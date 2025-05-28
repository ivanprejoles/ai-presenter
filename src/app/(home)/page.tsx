import { Features } from "@/components/global/features";
import { FileUploader } from "@/components/global/file-uploader";
import { Footer } from "@/components/global/footer";
import { HeroSection } from "@/components/global/hero-section";
import { TemplateSelector } from "@/components/global/template-selector";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <FileUploader />
        <Features />
        <TemplateSelector />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
