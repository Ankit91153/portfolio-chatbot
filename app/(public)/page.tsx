"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Code, Zap, MessageSquare, Sparkles } from "lucide-react";
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
      <section className="relative flex-1 flex flex-col items-center justify-center py-32 px-4 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px]" />
          
          {/* Floating Icons */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] opacity-20 dark:opacity-40 hidden md:block"
          >
            <Bot className="w-32 h-32 text-primary" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] opacity-20 dark:opacity-40 hidden md:block"
          >
            <MessageSquare className="w-24 h-24 text-purple-500" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[25%] right-[25%] opacity-30 dark:opacity-50 hidden lg:block"
          >
            <Sparkles className="w-12 h-12 text-yellow-500" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl relative z-10"
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
            <Link href="#services">Learn More</Link>
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
                <CardTitle>1-Click Resume Parsing</CardTitle>
                <CardDescription>Instantly build your profile from your existing CV.</CardDescription>
              </CardHeader>
              <CardContent>
                Upload your PDF or Word resume and let our Groq-powered AI automatically extract your skills, experience, and education directly into your profile.
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur">
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Personalized AI Assistant</CardTitle>
                <CardDescription>A smart agent that represents you.</CardDescription>
              </CardHeader>
              <CardContent>
                Visitors can chat 24/7 with an intelligent LLaMA-3 model trained exclusively on your background to learn about your achievements and capabilities.
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Total Data Control</CardTitle>
                <CardDescription>You own your professional data.</CardDescription>
              </CardHeader>
              <CardContent>
                Review, edit, and fine-tune what the chatbot knows about you. Set custom Q&A rules to handle specific questions exactly how you want them answered.
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
