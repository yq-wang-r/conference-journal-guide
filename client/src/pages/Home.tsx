import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, Award } from "lucide-react";

const conferences = [
  {
    id: "icc2026",
    name: "IEEE ICC 2026",
    date: "May 24-28, 2026",
    location: "Glasgow, UK",
    website: "https://icc2026.ieee-icc.org/",
  },
];

const journals = [
  {
    id: "ieee_comm",
    name: "IEEE Communications Letters",
    impact: "High",
    review: "3-4 months",
    website: "https://ieeexplore.ieee.org/",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full py-20 md:py-32 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Conferences</h1>
          <p className="text-lg text-blue-50">Academic Publishing Guide</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="conferences">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="conferences">Conferences</TabsTrigger>
              <TabsTrigger value="journals">Journals</TabsTrigger>
            </TabsList>
            <TabsContent value="conferences">
              {conferences.map((conf) => (
                <Card key={conf.id}>
                  <CardHeader>
                    <CardTitle>{conf.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Date: {conf.date}</p>
                    <a href={conf.website} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-4">Visit</Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="journals">
              {journals.map((journal) => (
                <Card key={journal.id}>
                  <CardHeader>
                    <CardTitle>{journal.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Impact: {journal.impact}</p>
                    <a href={journal.website} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-4">Visit</Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Conference and Journal Guide</p>
        </div>
      </footer>
    </div>
  );
}