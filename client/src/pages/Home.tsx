import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Award } from "lucide-react";

const conferences = [
  {
    id: "icc2026",
    name: "IEEE ICC 2026",
    date: "May 24-28, 2026",
    location: "Glasgow, UK",
    website: "https://icc2026.ieee-icc.org/",
    difficulty: "High",
    audience: "PhD students, Researchers",
  },
  {
    id: "icct2026",
    name: "IEEE ICCT 2026",
    date: "October 16-18, 2026",
    location: "Zhuhai, China",
    website: "https://www.ieee-icct.org/",
    difficulty: "Medium-High",
    audience: "Master & PhD students",
  },
  {
    id: "eice2026",
    name: "EICE 2026",
    date: "January 30 - February 1, 2026",
    location: "Sanya, China",
    website: "http://www.ei-ce.com/",
    difficulty: "Low",
    audience: "Master students",
  },
];

const journals = [
  {
    id: "ieee_comm",
    name: "IEEE Communications Letters",
    impact: "High",
    review: "3-4 months",
    website: "https://ieeexplore.ieee.org/",
    difficulty: "Medium",
    audience: "Master & PhD students",
  },
  {
    id: "ieee_wireless",
    name: "IEEE Wireless Communications Letters",
    impact: "Medium-High",
    review: "3-4 months",
    website: "https://ieeexplore.ieee.org/",
    difficulty: "Medium",
    audience: "Master & PhD students",
  },
  {
    id: "ieee_access",
    name: "IEEE Access",
    impact: "Medium",
    review: "2-3 months",
    website: "https://ieeexplore.ieee.org/",
    difficulty: "Low",
    audience: "Master students",
  },
];

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Low":
      return "bg-green-100 text-green-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Medium-High":
      return "bg-orange-100 text-orange-800";
    case "High":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full py-20 md:py-32 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Conferences & Journals</h1>
          <p className="text-lg text-blue-50">Academic Publishing Guide for Graduate Students</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="conferences">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="conferences">Conferences</TabsTrigger>
              <TabsTrigger value="journals">Journals</TabsTrigger>
            </TabsList>

            <TabsContent value="conferences" className="space-y-6">
              {conferences.map((conf) => (
                <Card key={conf.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl mb-3">{conf.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getDifficultyColor(conf.difficulty)}>
                            Difficulty: {conf.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50">
                            {conf.audience}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Date</p>
                        <p className="text-sm">{conf.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Location</p>
                        <p className="text-sm">{conf.location}</p>
                      </div>
                    </div>
                    <a href={conf.website} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="gap-2">
                        <Award size={16} />
                        Visit Website
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="journals" className="space-y-6">
              {journals.map((journal) => (
                <Card key={journal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl mb-3">{journal.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getDifficultyColor(journal.difficulty)}>
                            Difficulty: {journal.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50">
                            {journal.audience}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Impact Factor</p>
                        <p className="text-sm">{journal.impact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Review Cycle</p>
                        <p className="text-sm">{journal.review}</p>
                      </div>
                    </div>
                    <a href={journal.website} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="gap-2">
                        <Award size={16} />
                        Visit Website
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Conference and Journal Submission Guide | January 2026</p>
        </div>
      </footer>
    </div>
  );
}
