import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Award, Search, ArrowUpDown, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

const conferences = [
  // Traditional Communications
  { id: "icc2026", name: "IEEE ICC 2026", date: "May 24-28, 2026", location: "Glasgow, UK", website: "https://icc2026.ieee-icc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-01-18", daysUntilDeadline: 0, category: "Traditional Communications" },
  { id: "wcnc2026", name: "IEEE WCNC 2026", date: "April 13-16, 2026", location: "Kuala Lumpur, Malaysia", website: "https://wcnc2026.ieee-wcnc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28, category: "Traditional Communications" },
  { id: "globecom2026", name: "IEEE GLOBECOM 2026", date: "December 7-11, 2026", location: "Macau, China", website: "https://globecom2026.ieee-globecom.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-15", daysUntilDeadline: 149, category: "Traditional Communications" },
  { id: "icct2026", name: "IEEE ICCT 2026", date: "October 16-18, 2026", location: "Zhuhai, China", website: "https://www.ieee-icct.org/", difficulty: "Medium-High", audience: "Master & PhD students", deadline: "2026-05-31", daysUntilDeadline: 134, category: "Traditional Communications" },
  { id: "ctw2026", name: "IEEE CTW 2026", date: "May 17-20, 2026", location: "Azores, Portugal", website: "https://ctw2026.ieee-ctw.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-01", daysUntilDeadline: 14, category: "Traditional Communications" },
  { id: "secon2026", name: "IEEE SECON 2026", date: "TBD", location: "TBD", website: "https://secon2026.ieee-secon.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "Traditional Communications" },
  { id: "ccnc2026", name: "IEEE CCNC 2026", date: "January 11-13, 2026", location: "Las Vegas, USA", website: "https://www.ieee-ccnc.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2025-09-15", daysUntilDeadline: -125, category: "Traditional Communications" },
  { id: "isac2026", name: "IEEE ISAC 2026", date: "November 16-18, 2026", location: "TBD", website: "https://www.ieee.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-05-01", daysUntilDeadline: 104, category: "Traditional Communications" },
  { id: "latiot2026", name: "IEEE LatIoT 2026", date: "March 19-21, 2026", location: "Washington DC, USA", website: "https://www.ieee.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-31", daysUntilDeadline: 13, category: "Traditional Communications" },
  { id: "wimob2026", name: "WiMob 2026", date: "TBD", location: "TBD", website: "http://www.wimob.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-04-15", daysUntilDeadline: 88, category: "Traditional Communications" },
  { id: "eice2026", name: "EICE 2026", date: "January 30 - February 1, 2026", location: "Sanya, China", website: "http://www.ei-ce.com/", difficulty: "Low", audience: "Master students", deadline: "2026-01-20", daysUntilDeadline: 2, category: "Traditional Communications" },
  
  // AI & Communications
  { id: "icmlcn2026", name: "IEEE ICMLCN 2026", date: "May 26-29, 2026", location: "Barcelona, Spain", website: "https://icmlcn2026.ieee-icmlcn.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-01-31", daysUntilDeadline: 13, category: "AI & Communications" },
  { id: "6g_summit_2026", name: "EuCNC & 6G Summit 2026", date: "June 2-4, 2026", location: "Malaga, Spain", website: "https://6g-ia.eu/event/eucnc-6g-summit-2026-malaga-spain/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-28", daysUntilDeadline: 41, category: "AI & Communications" },
  { id: "global_6g_2026", name: "Global 6G Conference 2026", date: "April 15-17, 2026", location: "Nanjing, China", website: "https://en.g6gconference.com/", difficulty: "Medium-High", audience: "Master & PhD students", deadline: "2026-02-15", daysUntilDeadline: 28, category: "AI & Communications" },
  { id: "san_diego_wireless_2026", name: "San Diego Wireless Summit 2026", date: "January 22-23, 2026", location: "San Diego, USA", website: "https://6g.ucsd.edu/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-10", daysUntilDeadline: -8, category: "AI & Communications" },
];

const journals = [
  // Traditional Communications
  { id: "ieee_comm_letters", name: "IEEE Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-comml", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_comm_surveys", name: "IEEE Communications Surveys & Tutorials", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-comst", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_jsac", name: "IEEE Journal on Selected Areas in Communications", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-jsac", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-30", daysUntilDeadline: 164, category: "Traditional Communications" },
  { id: "ieee_net_letters", name: "IEEE Networking Letters", impact: "Medium-High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-lnet", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_ojcoms", name: "IEEE Open Journal of the Communications Society", impact: "Medium", review: "2-3 months", website: "https://www.comsoc.org/publications/journals/ieee-ojcoms", difficulty: "Low-Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_tccn", name: "IEEE Transactions on Cognitive Communications and Networking", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tccn", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_tcom", name: "IEEE Transactions on Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tcom", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_tgcn", name: "IEEE Transactions on Green Communications and Networking", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tgcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_tnet", name: "IEEE Transactions on Networking", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tnet", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_twc", name: "IEEE Transactions on Wireless Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-twc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_wcl", name: "IEEE Wireless Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-wcl", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_jcn", name: "IEEE/KICS Journal of Communications and Networks", impact: "Medium-High", review: "4-6 months", website: "http://jcn.or.kr/html/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "jocn", name: "Journal of Optical Communications and Networking", impact: "High", review: "4-6 months", website: "https://opg.optica.org/jocn/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_iot", name: "IEEE Internet of Things Journal", impact: "High", review: "4-6 months", website: "https://ieee-iotj.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_tvt", name: "IEEE Transactions on Vehicular Technology", impact: "High", review: "4-6 months", website: "https://www.ieee.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "signal_processing", name: "Signal Processing (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/signal-processing", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "wireless_networks", name: "Wireless Networks (Springer)", impact: "Medium-High", review: "4-6 months", website: "https://link.springer.com/journal/11276", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "npj_wireless", name: "npj Wireless Technology (Nature)", impact: "High", review: "3-4 months", website: "https://www.nature.com/npjwireltech/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  { id: "ieee_access", name: "IEEE Access", impact: "Medium", review: "2-3 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639", difficulty: "Low", audience: "Master students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications" },
  
  // AI & Communications
  { id: "ieee_tmlcn", name: "IEEE Transactions on Machine Learning in Communications", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-tmlcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications" },
  { id: "nature_comms_ai", name: "Nature Communications AI & Computing", impact: "Very High", review: "2-3 months", website: "https://www.nature.com/commsaicomp/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications" },
  { id: "ieee_tmbmc", name: "IEEE Transactions on Molecular, Biological, Multi-Scale Communications", impact: "Medium", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tmbmc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications" },
  { id: "ieee_tnse", name: "IEEE Transactions on Network Science and Engineering", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tnse", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications" },
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

function getCategoryColor(category: string): string {
  return category === "AI & Communications" ? "bg-purple-100 text-purple-800 border-purple-300" : "bg-blue-100 text-blue-800 border-blue-300";
}

function getDeadlineColor(days: number): string {
  if (days < 0) return "text-gray-500";
  if (days <= 7) return "text-red-600 font-bold";
  if (days <= 30) return "text-orange-600";
  return "text-green-600";
}

function getDeadlineLabel(days: number): string {
  if (days < 0) return "已截止";
  if (days === 0) return "今日截止";
  if (days === 1) return "明日截止";
  return `还有 ${days} 天`;
}

type SortBy = "deadline-asc" | "deadline-desc" | "name";
type CategoryFilter = "all" | "traditional" | "ai";

export default function Home() {
  const [, setLocation] = useLocation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("deadline-asc");
  const [showExpired, setShowExpired] = useState(false);

  const filteredAndSortedConferences = useMemo(() => {
    let filtered = conferences.filter(conf => {
      const matchesSearch = conf.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = !difficultyFilter || conf.difficulty === difficultyFilter;
      const matchesExpired = showExpired || conf.daysUntilDeadline >= 0;
      const matchesCategory = categoryFilter === "all" || 
        (categoryFilter === "traditional" && conf.category === "Traditional Communications") ||
        (categoryFilter === "ai" && conf.category === "AI & Communications");
      return matchesSearch && matchesDifficulty && matchesExpired && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "deadline-asc") return a.daysUntilDeadline - b.daysUntilDeadline;
      if (sortBy === "deadline-desc") return b.daysUntilDeadline - a.daysUntilDeadline;
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, difficultyFilter, sortBy, showExpired, categoryFilter]);

  const filteredAndSortedJournals = useMemo(() => {
    let filtered = journals.filter(journal => {
      const matchesSearch = journal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = !difficultyFilter || journal.difficulty === difficultyFilter;
      const matchesExpired = showExpired || journal.daysUntilDeadline >= 0;
      const matchesCategory = categoryFilter === "all" || 
        (categoryFilter === "traditional" && journal.category === "Traditional Communications") ||
        (categoryFilter === "ai" && journal.category === "AI & Communications");
      return matchesSearch && matchesDifficulty && matchesExpired && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "deadline-asc") return a.daysUntilDeadline - b.daysUntilDeadline;
      if (sortBy === "deadline-desc") return b.daysUntilDeadline - a.daysUntilDeadline;
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, difficultyFilter, sortBy, showExpired, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full py-20 md:py-32 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Conferences & Journals</h1>
          <p className="text-lg text-blue-50">Comprehensive Guide for Graduate Students in ICE</p>
          <p className="text-sm text-blue-100 mt-2">15 Conferences + 23 Journals (Including AI & Communications)</p>
          <div className="mt-6">
            <Button onClick={() => setLocation("/my-list")} variant="secondary" size="lg" className="gap-2">
              <Heart size={20} />
              My Submission List ({favorites.length})
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-secondary/30 border-b border-border sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input type="text" placeholder="Search conferences or journals..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-muted-foreground">Category:</span>
              <Button variant={categoryFilter === "all" ? "default" : "outline"} onClick={() => setCategoryFilter("all")} size="sm">All</Button>
              <Button variant={categoryFilter === "traditional" ? "default" : "outline"} onClick={() => setCategoryFilter("traditional")} size="sm">Traditional Communications</Button>
              <Button variant={categoryFilter === "ai" ? "default" : "outline"} onClick={() => setCategoryFilter("ai")} size="sm" className="bg-purple-600 hover:bg-purple-700">AI & Communications</Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-muted-foreground">Difficulty:</span>
              <Button variant={!difficultyFilter ? "default" : "outline"} onClick={() => setDifficultyFilter(null)} size="sm">All</Button>
              {["Low", "Medium", "Medium-High", "High"].map(diff => (
                <Button key={diff} variant={difficultyFilter === diff ? "default" : "outline"} onClick={() => setDifficultyFilter(diff)} size="sm">{diff}</Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-muted-foreground">Sort by:</span>
              <Button variant={sortBy === "deadline-asc" ? "default" : "outline"} onClick={() => setSortBy("deadline-asc")} size="sm" className="gap-2">
                <ArrowUpDown size={16} />Deadline (Soon First)
              </Button>
              <Button variant={sortBy === "deadline-desc" ? "default" : "outline"} onClick={() => setSortBy("deadline-desc")} size="sm" className="gap-2">
                <ArrowUpDown size={16} />Deadline (Later First)
              </Button>
              <Button variant={sortBy === "name" ? "default" : "outline"} onClick={() => setSortBy("name")} size="sm">Name (A-Z)</Button>
              <Button variant={showExpired ? "default" : "outline"} onClick={() => setShowExpired(!showExpired)} size="sm">
                {showExpired ? "Show All" : "Hide Expired"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="conferences">
            <TabsList className="grid w-full grid-cols-2 mb-8 mt-20">
              <TabsTrigger value="conferences">Conferences ({filteredAndSortedConferences.length})</TabsTrigger>
              <TabsTrigger value="journals">Journals ({filteredAndSortedJournals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="conferences" className="space-y-4">
              {filteredAndSortedConferences.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No conferences found matching your criteria.</p>
              ) : (
                filteredAndSortedConferences.map(conf => (
                  <Card key={conf.id} className={`hover:shadow-lg transition-shadow ${conf.daysUntilDeadline < 0 ? "opacity-60" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg md:text-xl mb-2">{conf.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={getCategoryColor(conf.category)} variant="outline">{conf.category}</Badge>
                            <Badge className={getDifficultyColor(conf.difficulty)}>Difficulty: {conf.difficulty}</Badge>
                            <Badge variant="outline" className="bg-blue-50">{conf.audience}</Badge>
                          </div>
                          <div className={`text-sm font-semibold ${getDeadlineColor(conf.daysUntilDeadline)}`}>
                            📅 Deadline: {conf.deadline} ({getDeadlineLabel(conf.daysUntilDeadline)})
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          if (isFavorite(conf.id, "conference")) {
                            removeFavorite(conf.id, "conference");
                          } else {
                            addFavorite(conf.id, "conference", conf.name);
                          }
                        }} className={isFavorite(conf.id, "conference") ? "text-red-500" : ""}>
                          <Heart size={20} fill={isFavorite(conf.id, "conference") ? "currentColor" : "none"} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="font-semibold text-muted-foreground">Conference Date</p><p>{conf.date}</p></div>
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
              {filteredAndSortedJournals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No journals found matching your criteria.</p>
              ) : (
                filteredAndSortedJournals.map(journal => (
                  <Card key={journal.id} className={`hover:shadow-lg transition-shadow ${journal.daysUntilDeadline < 0 ? "opacity-60" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg md:text-xl mb-2">{journal.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={getCategoryColor(journal.category)} variant="outline">{journal.category}</Badge>
                            <Badge className={getDifficultyColor(journal.difficulty)}>Difficulty: {journal.difficulty}</Badge>
                            <Badge variant="outline" className="bg-blue-50">{journal.audience}</Badge>
                          </div>
                          <div className={`text-sm font-semibold ${getDeadlineColor(journal.daysUntilDeadline)}`}>
                            📅 Next Deadline: {journal.deadline} ({getDeadlineLabel(journal.daysUntilDeadline)})
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          if (isFavorite(journal.id, "journal")) {
                            removeFavorite(journal.id, "journal");
                          } else {
                            addFavorite(journal.id, "journal", journal.name);
                          }
                        }} className={isFavorite(journal.id, "journal") ? "text-red-500" : ""}>
                          <Heart size={20} fill={isFavorite(journal.id, "journal") ? "currentColor" : "none"} />
                        </Button>
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
          <p>Conferences & Journals Guide | For Graduate Students in Information & Communication Engineering</p>
        </div>
      </footer>
    </div>
  );
}
