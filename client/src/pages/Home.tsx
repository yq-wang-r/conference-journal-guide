import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Award, Search } from "lucide-react";

const conferences = [
  { id: "icc2026", name: "IEEE ICC 2026", date: "May 24-28, 2026", location: "Glasgow, UK", website: "https://icc2026.ieee-icc.org/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "wcnc2026", name: "IEEE WCNC 2026", date: "April 13-16, 2026", location: "Kuala Lumpur, Malaysia", website: "https://wcnc2026.ieee-wcnc.org/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "globecom2026", name: "IEEE GLOBECOM 2026", date: "December 7-11, 2026", location: "Macau, China", website: "https://globecom2026.ieee-globecom.org/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "icct2026", name: "IEEE ICCT 2026", date: "October 16-18, 2026", location: "Zhuhai, China", website: "https://www.ieee-icct.org/", difficulty: "Medium-High", audience: "Master & PhD students" },
  { id: "ctw2026", name: "IEEE CTW 2026", date: "May 17-20, 2026", location: "Azores, Portugal", website: "https://ctw2026.ieee-ctw.org/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "secon2026", name: "IEEE SECON 2026", date: "TBD", location: "TBD", website: "https://secon2026.ieee-secon.org/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ccnc2026", name: "IEEE CCNC 2026", date: "January 11-13, 2026", location: "Las Vegas, USA", website: "https://www.ieee-ccnc.org/", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "isac2026", name: "IEEE ISAC 2026", date: "November 16-18, 2026", location: "TBD", website: "https://www.ieee.org/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "latiot2026", name: "IEEE LatIoT 2026", date: "March 19-21, 2026", location: "Washington DC, USA", website: "https://www.ieee.org/", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "wimob2026", name: "WiMob 2026", date: "TBD", location: "TBD", website: "http://www.wimob.org/", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "eice2026", name: "EICE 2026", date: "January 30 - February 1, 2026", location: "Sanya, China", website: "http://www.ei-ce.com/", difficulty: "Low", audience: "Master students" },
];

const journals = [
  { id: "ieee_comm_letters", name: "IEEE Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-comml", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "ieee_comm_surveys", name: "IEEE Communications Surveys & Tutorials", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-comst", difficulty: "Medium-High", audience: "PhD students" },
  { id: "ieee_jsac", name: "IEEE Journal on Selected Areas in Communications", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-jsac", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_net_letters", name: "IEEE Networking Letters", impact: "Medium-High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-lnet", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "ieee_ojcoms", name: "IEEE Open Journal of the Communications Society", impact: "Medium", review: "2-3 months", website: "https://www.comsoc.org/publications/journals/ieee-ojcoms", difficulty: "Low-Medium", audience: "Master & PhD students" },
  { id: "ieee_tccn", name: "IEEE Transactions on Cognitive Communications and Networking", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tccn", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_tcom", name: "IEEE Transactions on Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tcom", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_tgcn", name: "IEEE Transactions on Green Communications and Networking", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tgcn", difficulty: "Medium-High", audience: "PhD students" },
  { id: "ieee_tmlcn", name: "IEEE Transactions on Machine Learning in Communications", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-tmlcn", difficulty: "Medium-High", audience: "PhD students" },
  { id: "ieee_tmbmc", name: "IEEE Transactions on Molecular, Biological, Multi-Scale Communications", impact: "Medium", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tmbmc", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_tnse", name: "IEEE Transactions on Network Science and Engineering", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tnse", difficulty: "Medium-High", audience: "PhD students" },
  { id: "ieee_tnsm", name: "IEEE Transactions on Network and Service Management", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tnsm", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "ieee_twc", name: "IEEE Transactions on Wireless Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-twc", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_wcl", name: "IEEE Wireless Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-wcl", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "ieee_tnet", name: "IEEE Transactions on Networking", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tnet", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_jcn", name: "IEEE/KICS Journal of Communications and Networks", impact: "Medium-High", review: "4-6 months", website: "http://jcn.or.kr/html/", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "jocn", name: "Journal of Optical Communications and Networking", impact: "High", review: "4-6 months", website: "https://opg.optica.org/jocn/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_iot", name: "IEEE Internet of Things Journal", impact: "High", review: "4-6 months", website: "https://ieee-iotj.org/", difficulty: "Medium-High", audience: "PhD students" },
  { id: "ieee_tvt", name: "IEEE Transactions on Vehicular Technology", impact: "High", review: "4-6 months", website: "https://www.ieee.org/", difficulty: "Medium-High", audience: "PhD students" },
  { id: "signal_processing", name: "Signal Processing (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/signal-processing", difficulty: "Medium-High", audience: "PhD students" },
  { id: "wireless_networks", name: "Wireless Networks (Springer)", impact: "Medium-High", review: "4-6 months", website: "https://link.springer.com/journal/11276", difficulty: "Medium", audience: "Master & PhD students" },
  { id: "npj_wireless", name: "npj Wireless Technology (Nature)", impact: "High", review: "3-4 months", website: "https://www.nature.com/npjwireltech/", difficulty: "High", audience: "PhD students, Researchers" },
  { id: "ieee_access", name: "IEEE Access", impact: "Medium", review: "2-3 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639", difficulty: "Low", audience: "Master students" },
];

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Low": return "bg-green-100 text-green-800";
    case "Low-Medium": return "bg-green-50 text-green-700";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Medium-High": return "bg-orange-100 text-orange-800";
    case "High": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const filteredConferences = conferences.filter(conf => {
    const matchesSearch = conf.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !difficultyFilter || conf.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !difficultyFilter || journal.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full py-20 md:py-32 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Conferences & Journals</h1>
          <p className="text-lg text-blue-50">Comprehensive Guide for Graduate Students in ICE</p>
          <p className="text-sm text-blue-100 mt-2">11 Conferences + 24 Journals</p>
        </div>
      </section>

      <section className="py-8 bg-secondary/30 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input type="text" placeholder="Search conferences or journals..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={!difficultyFilter ? "default" : "outline"} onClick={() => setDifficultyFilter(null)} size="sm">All Levels</Button>
              {["Low", "Medium", "Medium-High", "High"].map(diff => (
                <Button key={diff} variant={difficultyFilter === diff ? "default" : "outline"} onClick={() => setDifficultyFilter(diff)} size="sm">{diff}</Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="conferences">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="conferences">Conferences ({filteredConferences.length})</TabsTrigger>
              <TabsTrigger value="journals">Journals ({filteredJournals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="conferences" className="space-y-4">
              {filteredConferences.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No conferences found matching your criteria.</p>
              ) : (
                filteredConferences.map(conf => (
                  <Card key={conf.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg md:text-xl mb-2">{conf.name}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(conf.difficulty)}>Difficulty: {conf.difficulty}</Badge>
                            <Badge variant="outline" className="bg-blue-50">{conf.audience}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="font-semibold text-muted-foreground">Date</p><p>{conf.date}</p></div>
                        <div><p className="font-semibold text-muted-foreground">Location</p><p>{conf.location}</p></div>
                      </div>
                      <a href={conf.website} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2"><Award size={16} />Visit Website</Button>
                      </a>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="journals" className="space-y-4">
              {filteredJournals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No journals found matching your criteria.</p>
              ) : (
                filteredJournals.map(journal => (
                  <Card key={journal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg md:text-xl mb-2">{journal.name}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(journal.difficulty)}>Difficulty: {journal.difficulty}</Badge>
                            <Badge variant="outline" className="bg-blue-50">{journal.audience}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="font-semibold text-muted-foreground">Impact</p><p>{journal.impact}</p></div>
                        <div><p className="font-semibold text-muted-foreground">Review Cycle</p><p>{journal.review}</p></div>
                      </div>
                      <a href={journal.website} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2"><Award size={16} />Visit Website</Button>
                      </a>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Comprehensive Conference and Journal Submission Guide | Last Updated: January 2026</p>
          <p className="mt-2">11 Conferences + 24 Journals for Information and Communication Engineering</p>
        </div>
      </footer>
    </div>
  );
}
