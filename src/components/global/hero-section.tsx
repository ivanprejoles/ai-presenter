"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wand2 } from "lucide-react";
import SparkleDecorations from "./sparkles";
import { Compare } from "../ui/compare";
import { Spotlight } from "../ui/spotlight";
import { Link } from "react-scroll";
import { default as HrefLink } from "next/link";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden bg-black py-20 md:py-28"
      style={{
        background: "linear-gradient(to bottom, #000000, #111111)",
      }}
    >
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60 w-[300%] lg:w-[150%]"
        fill="white"
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-60 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 80, 255, 0.15), transparent 40%)`,
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container relative z-20 mx-auto px-4">
        {/* Promo banner */}
        <div className="mx-auto mb-12 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-800 bg-gray-900/60 px-7 py-2 backdrop-blur-md">
          <p className="text-sm font-medium text-gray-300">
            <span className="inline-block animate-pulse rounded-full bg-purple-500 px-2 py-1 text-xs font-semibold text-white">
              New
            </span>{" "}
            <span className="ml-2">
              Free to use for all your presentation needs
            </span>
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 text-gray-400"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-8 text-center text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            <SparkleDecorations />
            <span className="block">Transform Documents</span>{" "}
            <span
              className="mt-2 block bg-gradient-to-r from-orange-300 to-rose-300 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 80px rgba(255, 170, 120, 0.2)",
              }}
            >
              into Presentations
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
            Transform any document into a stunning, data-rich presentation in
            seconds with our AI-powered tool. No design skills required.
          </p>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <HrefLink className="h-auto w-full sm:w-auto" href="/dashboard">
              <Button
                size="lg"
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-6 text-lg font-medium text-white transition-all duration-300 hover:shadow-[0_0_40px_8px_rgba(124,58,237,0.5)] sm:w-auto"
              >
                <span className="relative z-10">Use Pro</span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <ArrowRight className="relative z-10 ml-2 h-5 w-5" />
              </Button>
            </HrefLink>
            <Link
              className="h-auto w-full sm:w-auto"
              to="upload"
              smooth={true}
              duration={100}
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gray-700 bg-gray-900/50 px-8 py-6 text-lg font-medium text-gray-300 backdrop-blur-sm hover:bg-gray-800/70 hover:text-white sm:w-auto"
              >
                Use Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview image with glow effect */}
        <div className="relative mx-auto mt-20 max-w-2xl">
          <div
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-75 blur-lg"
            style={{
              filter: "blur(30px)",
            }}
          />
          <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/80 p-2 backdrop-blur-sm">
            <div className="absolute z-50 bottom-3 right-3 rounded-xl border border-gray-800 bg-gray-900/90 p-4 backdrop-blur-md">
              <Wand2 className="h-8 w-8 text-purple-400" />
            </div>
            <div className="p-2 rounded-3xl dark:bg-neutral-900 dark:border-neutral-800 px-2">
              <Compare
                firstImage="/pdf.jpg"
                secondImage="/presentation.webp"
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="h-[250px] w-full md:h-[500px] md:w-full"
                slideMode="hover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
