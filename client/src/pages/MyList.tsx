import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Download, Trash2, ArrowUpDown } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

const conferences = [
  { id: "icc2026", name: "IEEE ICC 2026", date: "May 24-28, 2026", location: "Glasgow, UK", website: "https://icc2026.ieee-icc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-01-18", daysUntilDeadline: 0 },
  { id: "wcnc2026", name: "IEEE WCNC 2026", date: "April 13-16, 2026", location: "Kuala Lumpur, Malaysia", website: "https://wcnc2026.ieee-wcnc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28 },
  { id: "globecom2026", name: "IEEE GLOBECOM 2026", date: "December 7-11, 2026", location: "Macau, China", website: "https://globecom2026.ieee-globecom.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-15", daysUntilDeadline: 149 },
  { id: "icct2026", name: "IEEE ICCT 2026", date: "October 16-18, 2026", location: "Zhuhai, China", website: "https://www.ieee-icct.org/", difficulty: "Medium-High", audience: "Master & PhD students", deadline: "2026-05-31", daysUntilDeadline: 134 },
  { id: "ctw2026", name: "IEEE CTW 2026", date: "May 17-20, 2026", location: "Azores, Portugal", website: "https://ctw2026.ieee-ctw.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-01", daysUntilDeadline: 14 },
  { id: "secon2026", name: "IEEE SECON 2026", date: "TBD", location: "TBD", website: "https://secon2026.ieee-secon.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56 },
  { id: "ccnc2026", name: "IEEE CCNC 2026", date: "January 11-13, 2026", location: "Las Vegas, USA", website: "https://www.ieee-ccnc.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2025-09-15", daysUntilDeadline: -125 },
  { id: "isac2026", name: "IEEE ISAC 2026", date: "November 16-18, 2026", location: "TBD", website: "https://www.ieee.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-05-01", daysUntilDeadline: 104 },
  { id: "latiot2026", name: "IEEE LatIoT 2026", date: "March 19-21, 2026", location: "Washington DC, USA", website: "https://www.ieee.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-31", daysUntilDeadline: 13 },
  { id: "wimob2026", name: "WiMob 2026", date: "TBD", location: "TBD", website: "http://www.wimob.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-04-15", daysUntilDeadline: 88 },
  { id: "eice2026", name: "EICE 2026", date: "January 30 - February 1, 2026", location: "Sanya, China", website: "http://www.ei-ce.com/", difficulty: "Low", audience: "Master students", deadline: "2026-01-20", daysUntilDeadline: 2 },
];

const journals = [
  { id: "ieee_comm_letters", name: "IEEE Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-comml", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_comm_surveys", name: "IEEE Communications Surveys & Tutorials", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-comst", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_jsac", name: "IEEE Journal on Selected Areas in Communications", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-jsac", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-30", daysUntilDeadline: 164 },
  { id: "ieee_net_letters", name: "IEEE Networking Letters", impact: "Medium-High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-lnet", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_ojcoms", name: "IEEE Open Journal of the Communications Society", impact: "Medium", review: "2-3 months", website: "https://www.comsoc.org/publications/journals/ieee-ojcoms", difficulty: "Low-Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tccn", name: "IEEE Transactions on Cognitive Communications and Networking", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tccn", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tcom", name: "IEEE Transactions on Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tcom", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tgcn", name: "IEEE Transactions on Green Communications and Networking", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tgcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tmlcn", name: "IEEE Transactions on Machine Learning in Communications", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-tmlcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tmbmc", name: "IEEE Transactions on Molecular, Biological, Multi-Scale Communications", impact: "Medium", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tmbmc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tnse", name: "IEEE Transactions on Network Science and Engineering", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tnse", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tnsm", name: "IEEE Transactions on Network and Service Management", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tnsm", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_twc", name: "IEEE Transactions on Wireless Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-twc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_wcl", name: "IEEE Wireless Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-wcl", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tnet", name: "IEEE Transactions on Networking", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tnet", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_jcn", name: "IEEE/KICS Journal of Communications and Networks", impact: "Medium-High", review: "4-6 months", website: "http://jcn.or.kr/html/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "jocn", name: "Journal of Optical Communications and Networking", impact: "High", review: "4-6 months", website: "https://opg.optica.org/jocn/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_iot", name: "IEEE Internet of Things Journal", impact: "High", review: "4-6 months", website: "https://ieee-iotj.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_tvt", name: "IEEE Transactions on Vehicular Technology", impact: "High", review: "4-6 months", website: "https://www.ieee.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "signal_processing", name: "Signal Processing (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/signal-processing", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "wireless_networks", name: "Wireless Networks (Springer)", impact: "Medium-High", review: "4-6 months", website: "https://link.springer.com/journal/11276", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "npj_wireless", name: "npj Wireless Technology (Nature)", impact: "High", review: "3-4 months", website: "https://www.nature.com/npjwireltech/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347 },
  { id: "ieee_access", name: "IEEE Access", impact: "Medium", review: "2-3 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639", difficulty: "Low", audience: "Master students", deadline: "2026-12-31", daysUntilDeadline: 347 },
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

export default function MyList() {
  const [, setLocation] = useLocation();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [sortBy, setSortBy] = useState<SortBy>("deadline-asc");

  const favoriteConferences = useMemo(() => {
    const items = favorites
      .filter(f => f.type === "conference")
      .map(f => conferences.find(c => c.id === f.id))
      .filter(Boolean) as typeof conferences;

    return items.sort((a, b) => {
      if (sortBy === "deadline-asc") return a.daysUntilDeadline - b.daysUntilDeadline;
      if (sortBy === "deadline-desc") return b.daysUntilDeadline - a.daysUntilDeadline;
      return a.name.localeCompare(b.name);
    });
  }, [favorites, sortBy]);

  const favoriteJournals = useMemo(() => {
    const items = favorites
      .filter(f => f.type === "journal")
      .map(f => journals.find(j => j.id === f.id))
      .filter(Boolean) as typeof journals;

    return items.sort((a, b) => {
      if (sortBy === "deadline-asc") return a.daysUntilDeadline - b.daysUntilDeadline;
      if (sortBy === "deadline-desc") return b.daysUntilDeadline - a.daysUntilDeadline;
      return a.name.localeCompare(b.name);
    });
  }, [favorites, sortBy]);

  const exportAsCSV = () => {
    let csv = "Type,Name,Deadline,Days Until Deadline,Difficulty,Audience\n";
    
    favoriteConferences.forEach(conf => {
      csv += `Conference,"${conf.name}",${conf.deadline},${conf.daysUntilDeadline},${conf.difficulty},"${conf.audience}"\n`;
    });
    
    favoriteJournals.forEach(journal => {
      csv += `Journal,"${journal.name}",${journal.deadline},${journal.daysUntilDeadline},${journal.difficulty},"${journal.audience}"\n`;
    });

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", "my-submission-list.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full py-12 md:py-20 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="relative container mx-auto px-4">
          <Button onClick={() => setLocation("/")} variant="secondary" size="sm" className="gap-2 mb-4">
            <ArrowLeft size={16} />
            Back to All
          </Button>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">My Submission List</h1>
          <p className="text-lg text-blue-50">Your personalized conference and journal submission plan</p>
          <p className="text-sm text-blue-100 mt-2">Total: {favorites.length} items ({favoriteConferences.length} conferences + {favoriteJournals.length} journals)</p>
        </div>
      </section>

      {favorites.length === 0 ? (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No items in your list yet</h2>
            <p className="text-muted-foreground mb-6">Start by clicking the heart icon on conferences and journals to add them to your submission list.</p>
            <Button onClick={() => setLocation("/")} size="lg">Browse Conferences & Journals</Button>
          </div>
        </section>
      ) : (
        <>
          <section className="py-8 bg-secondary/30 border-b border-border sticky top-0 z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-semibold text-muted-foreground">Sort by:</span>
                  <Button variant={sortBy === "deadline-asc" ? "default" : "outline"} onClick={() => setSortBy("deadline-asc")} size="sm" className="gap-2">
                    <ArrowUpDown size={16} />Deadline (Soon First)
                  </Button>
                  <Button variant={sortBy === "deadline-desc" ? "default" : "outline"} onClick={() => setSortBy("deadline-desc")} size="sm" className="gap-2">
                    <ArrowUpDown size={16} />Deadline (Later First)
                  </Button>
                  <Button variant={sortBy === "name" ? "default" : "outline"} onClick={() => setSortBy("name")} size="sm">Name (A-Z)</Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportAsCSV} variant="outline" size="sm" className="gap-2">
                    <Download size={16} />Export CSV
                  </Button>
                  <Button onClick={() => clearFavorites()} variant="destructive" size="sm" className="gap-2">
                    <Trash2 size={16} />Clear All
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <Tabs defaultValue="conferences">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="conferences">Conferences ({favoriteConferences.length})</TabsTrigger>
                  <TabsTrigger value="journals">Journals ({favoriteJournals.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="conferences" className="space-y-4">
                  {favoriteConferences.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No conferences in your list. Add some from the main page!</p>
                  ) : (
                    favoriteConferences.map(conf => (
                      <Card key={conf.id} className={`hover:shadow-lg transition-shadow ${conf.daysUntilDeadline < 0 ? "opacity-60" : ""}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg md:text-xl mb-2">{conf.name}</CardTitle>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={getDifficultyColor(conf.difficulty)}>Difficulty: {conf.difficulty}</Badge>
                                <Badge variant="outline" className="bg-blue-50">{conf.audience}</Badge>
                              </div>
                              <div className={`text-sm font-semibold ${getDeadlineColor(conf.daysUntilDeadline)}`}>
                                📅 Deadline: {conf.deadline} ({getDeadlineLabel(conf.daysUntilDeadline)})
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFavorite(conf.id, "conference")} className="text-red-500">
                              <Heart size={20} fill="currentColor" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><p className="font-semibold text-muted-foreground">Conference Date</p><p>{conf.date}</p></div>
                            <div><p className="font-semibold text-muted-foreground">Location</p><p>{conf.location}</p></div>
                          </div>
                          <a href={conf.website} target="_blank" rel="noopener noreferrer">
                            <Button size="sm">Visit Website</Button>
                          </a>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="journals" className="space-y-4">
                  {favoriteJournals.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No journals in your list. Add some from the main page!</p>
                  ) : (
                    favoriteJournals.map(journal => (
                      <Card key={journal.id} className={`hover:shadow-lg transition-shadow ${journal.daysUntilDeadline < 0 ? "opacity-60" : ""}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg md:text-xl mb-2">{journal.name}</CardTitle>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={getDifficultyColor(journal.difficulty)}>Difficulty: {journal.difficulty}</Badge>
                                <Badge variant="outline" className="bg-blue-50">{journal.audience}</Badge>
                              </div>
                              <div className={`text-sm font-semibold ${getDeadlineColor(journal.daysUntilDeadline)}`}>
                                📅 Next Deadline: {journal.deadline} ({getDeadlineLabel(journal.daysUntilDeadline)})
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFavorite(journal.id, "journal")} className="text-red-500">
                              <Heart size={20} fill="currentColor" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><p className="font-semibold text-muted-foreground">Impact</p><p>{journal.impact}</p></div>
                            <div><p className="font-semibold text-muted-foreground">Review Cycle</p><p>{journal.review}</p></div>
                          </div>
                          <a href={journal.website} target="_blank" rel="noopener noreferrer">
                            <Button size="sm">Visit Website</Button>
                          </a>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </>
      )}

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>My Submission List | Personalized Conference and Journal Guide</p>
        </div>
      </footer>
    </div>
  );
}
