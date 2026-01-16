"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Code, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center space-y-8 bg-gradient-to-b from-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Build Your Intelligent Portfolio
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto">
            Create a stunning portfolio website powered by AI chatbots. Engage visitors and showcase your work like never before.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" asChild className="gap-2">
            <Link href="/register">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">Learn More</Link>
          </Button>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 container mx-auto" id="services">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
          <p className="text-muted-foreground text-lg">Everything you need to build your presence</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur">
              <CardHeader>
                <Bot className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI Integration</CardTitle>
                <CardDescription>Advanced chatbot integration for your portfolio.</CardDescription>
              </CardHeader>
              <CardContent>
                Engage with your visitors 24/7 using our smart AI agents trained on your profile.
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur">
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Modern Technology</CardTitle>
                <CardDescription>Built with Next.js 15 and Tailwind CSS.</CardDescription>
              </CardHeader>
              <CardContent>
                Experience blazing fast performance and SEO-optimized pages out of the box.
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Fast Deployment</CardTitle>
                <CardDescription>Deploy your site in seconds.</CardDescription>
              </CardHeader>
              <CardContent>
                Get your portfolio up and running instantly with our streamlined process.
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
