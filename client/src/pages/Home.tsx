import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Search, ArrowUpDown, Award, Users, MousePointerClick, ChevronUp } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

const conferences = [
  // Traditional Communications
  { id: "icc2026", name: "IEEE ICC 2026", date: "May 24-28, 2026", location: "Glasgow, UK", website: "https://icc2026.ieee-icc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-01-18", daysUntilDeadline: 0, category: "Traditional Communications", popularity: 95, avgPublishTime: "6-8 months", topics: ["Cognitive Radio and AI-Enabled Networks", "Communication and Information Systems Security", "Communication QoS, Reliability and Modeling", "Communications Software and Multimedia", "Communication Theory", "Green Communications Systems and Networks", "IoT and Sensor Networks", "Mobile and Wireless Networks", "Next-Generation Networking and Internet", "Optical Networks & Systems", "Signal Processing for Communications", "Wireless Communications"], callForPapersUrl: "https://icc2026.ieee-icc.org/authors/call-symposia-papers" },
  { id: "wcnc2026", name: "IEEE WCNC 2026", date: "April 13-16, 2026", location: "Kuala Lumpur, Malaysia", website: "https://wcnc2026.ieee-wcnc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28, category: "Traditional Communications", popularity: 90, avgPublishTime: "6-8 months", topics: ["Physical Layer and Communication Theory", "Medium Access Control and Networking", "Machine Learning and Optimization for Wireless Systems", "Emerging Technologies, Network Architectures, and Applications"], callForPapersUrl: "http://wcnc2026.ieee-wcnc.org/call-papers" },
  { id: "globecom2026", name: "IEEE GLOBECOM 2026", date: "December 7-11, 2026", location: "Macau, China", website: "https://globecom2026.ieee-globecom.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-15", daysUntilDeadline: 149, category: "Traditional Communications", popularity: 92, avgPublishTime: "6-8 months", topics: ["Optical Communications", "Satellite Communications", "Network Architecture", "Internet of Things", "Spectrum Sharing", "6G Networks", "AI for Communications"], callForPapersUrl: "https://globecom2026.ieee-globecom.org/" },
  { id: "icct2026", name: "IEEE ICCT 2026", date: "October 16-18, 2026", location: "Zhuhai, China", website: "https://www.ieee-icct.org/", difficulty: "Medium-High", audience: "Master & PhD students", deadline: "2026-05-31", daysUntilDeadline: 134, category: "Traditional Communications", popularity: 75, avgPublishTime: "4-6 months", topics: ["Communication and Information Theory", "Signal Processing for Communications", "Integrated Sensing and Communication", "Intelligent and Semantic Communications", "AI for Communications and Networks", "Cloud and Edge Computing", "Mobile and Wireless Networks", "Internet-of-Things & Sensor Networks", "Space-Air-Ground Communication and Space Networking", "Communication and Information Security", "Communication QoS, Reliability & Modeling", "Optical Communications and Networks", "Green Communication Systems & Networks", "Reconfigurable Intelligent Surfaces", "Aerial Communications, UAV Communications, Vehicular Networks"], callForPapersUrl: "https://www.ieee-icct.org/cfp.html" },
  { id: "ctw2026", name: "IEEE CTW 2026", date: "May 17-20, 2026", location: "Azores, Portugal", website: "https://ctw2026.ieee-ctw.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-01", daysUntilDeadline: 14, category: "Traditional Communications", popularity: 80, avgPublishTime: "3-4 months", topics: ["Network information theory and low-latency fundamentals", "Channel estimation, synchronization, and detection", "Coding, modulation, and source–channel processing", "MIMO and cooperative multi-antenna systems", "Multiple access, resource allocation, and scheduling", "Interference, diversity, and fading countermeasures", "Cache-aided, distributed, and energy-aware communications", "Machine learning and AI-driven communication theory", "Integrated communication, sensing, and security", "Emerging paradigms and theoretical frameworks"], callForPapersUrl: "http://ctw2026.ieee-ctw.org/authors/call-posters" },
  { id: "secon2026", name: "IEEE SECON 2026", date: "April 27-29, 2026", location: "Abu Dhabi, UAE", website: "https://secon2026.ieee-secon.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "Traditional Communications", popularity: 78, avgPublishTime: "5-7 months", topics: ["New communication paradigms (Terahertz, optical wireless, visible light, acoustic, RIS)", "Cellular communications (5G, 6G and beyond)", "Molecular communication networks", "Low-power, energy limited and battery-free sensing and communications", "Internet of Things; cyber-physical systems", "UAV-based sensing/communications/networking", "Communication and networking for AI and machine learning", "Data analytics, AI, and machine learning for sensing, communication, and networking", "Generative AI and autonomous agents", "Cloud, edge, and fog computing", "Time and location in sensing, communication, and networking", "Fairness and socio-technical issues", "Security, privacy, and trustworthiness", "Novel experimental testbeds", "Deployment experiences", "Sensing in challenging scenarios", "Resilience, dependability and sustainability", "Novel applications (wearables, VR/AR, smart communities)", "Integrated sensing and communications (ISAC)"], callForPapersUrl: "http://secon2026.ieee-secon.org/call-papers" },
  { id: "ccnc2026", name: "IEEE CCNC 2026", date: "January 9-12, 2026", location: "Las Vegas, USA", website: "https://ccnc2026.ieee-ccnc.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2025-09-15", daysUntilDeadline: -125, category: "Traditional Communications", popularity: 70, avgPublishTime: "4-5 months", topics: ["Edge/Cloud Computing and Networking", "Networking Solutions for Metaverse, Social Applications, Multimedia, and Games", "Testbeds, Experimentation and Datasets for Communications and Networking", "Wireless Communications: Fundamentals, PHY and Above"], callForPapersUrl: "http://ccnc2026.ieee-ccnc.org/call-technical-papers" },
  { id: "isac2026", name: "IEEE ISAC 2026", date: "November 16-18, 2026", location: "Lisbon, Portugal", website: "https://isac2026.isac-ieee.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-01", daysUntilDeadline: 135, category: "Traditional Communications", popularity: 82, avgPublishTime: "6-9 months", topics: ["Cellular networks", "Internet of things and sensor networks", "Local area networks", "Satellite networks", "Underwater networks", "Vehicular and UAV networks", "Passive and opportunistic radar and sonar", "Remote sensing, geosensing and GNSS reflectometry", "Airborne, space and automotive radar systems"], callForPapersUrl: "https://isac2026.isac-ieee.org/" },
  { id: "latiot2026", name: "IEEE LC-IoT 2026", date: "March 19-21, 2026", location: "Bogotá, Colombia", website: "https://lciot2026.iot.ieee.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-31", daysUntilDeadline: 13, category: "Traditional Communications", popularity: 65, avgPublishTime: "3-5 months", topics: ["Internet of Things", "IoT Applications", "Sensor Networks", "Edge Computing", "Smart Cities", "Connected Devices"], callForPapersUrl: "https://lciot2026.iot.ieee.org/call-papers" },
  { id: "wimob2026", name: "WiMob 2026", date: "TBD", location: "TBD", website: "http://www.wimob.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-04-15", daysUntilDeadline: 88, category: "Traditional Communications", popularity: 68, avgPublishTime: "4-6 months", topics: ["Mobile Computing", "Wireless Networks", "Mobile Applications", "Ubiquitous Computing", "Context Awareness"], callForPapersUrl: "http://www.wimob.org/" },
  { id: "eice2026", name: "EICE 2026", date: "January 30 - February 1, 2026", location: "Sanya, China", website: "http://www.ei-ce.com/", difficulty: "Low", audience: "Master students", deadline: "2026-01-20", daysUntilDeadline: 2, category: "Traditional Communications", popularity: 60, avgPublishTime: "2-3 months", topics: ["Electronics & Information", "Communication Engineering", "Signal Processing", "Network Technology", "Wireless Communications"], callForPapersUrl: "http://www.ei-ce.com/" },
  
  // AI & Communications
  { id: "icmlcn2026", name: "IEEE ICMLCN 2026", date: "May 26-29, 2026", location: "Barcelona, Spain", website: "https://icmlcn2026.ieee-icmlcn.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-01-31", daysUntilDeadline: 13, category: "AI & Communications", popularity: 98, avgPublishTime: "5-7 months", topics: ["Machine Learning for Communications", "Deep Learning", "Neural Networks", "Network Optimization", "Intelligent Resource Allocation"], callForPapersUrl: "https://icmlcn2026.ieee-icmlcn.org/" },
  { id: "6g_summit_2026", name: "EuCNC & 6G Summit 2026", date: "June 2-4, 2026", location: "Malaga, Spain", website: "https://6g-ia.eu/event/eucnc-6g-summit-2026-malaga-spain/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-28", daysUntilDeadline: 41, category: "AI & Communications", popularity: 96, avgPublishTime: "6-8 months", topics: ["6G Networks", "Beyond 5G", "Terahertz Communications", "AI for Networks", "Quantum Communications"], callForPapersUrl: "https://6g-ia.eu/event/eucnc-6g-summit-2026-malaga-spain/" },
  { id: "global_6g_2026", name: "Global 6G Conference 2026", date: "April 15-17, 2026", location: "Nanjing, China", website: "https://en.g6gconference.com/", difficulty: "Medium-High", audience: "Master & PhD students", deadline: "2026-02-15", daysUntilDeadline: 28, category: "AI & Communications", popularity: 88, avgPublishTime: "4-6 months", topics: ["6G Technologies", "Intelligent Surfaces", "Holographic Communications", "AI Integration", "Network Slicing"], callForPapersUrl: "https://en.g6gconference.com/" },
  { id: "san_diego_wireless_2026", name: "San Diego Wireless Summit 2026", date: "January 22-23, 2026", location: "San Diego, USA", website: "https://6g.ucsd.edu/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-10", daysUntilDeadline: -8, category: "AI & Communications", popularity: 72, avgPublishTime: "3-5 months", topics: ["Wireless Technology", "5G/6G", "Spectrum Technology", "Innovation in Wireless", "Future Networks"], callForPapersUrl: "https://6g.ucsd.edu/" },
];

const journals = [
  // Traditional Communications
  { id: "ieee_comm_letters", name: "IEEE Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-comml", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 88, avgPublishTime: "5-7 months", topics: ["Communication Theory", "Signal Processing", "Wireless Communications", "Network Protocols", "Information Theory"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-comml" },
  { id: "ieee_comm_surveys", name: "IEEE Communications Surveys & Tutorials", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-comst", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 92, avgPublishTime: "8-12 months", topics: ["Survey Papers", "Tutorial Articles", "Communication Systems", "Network Technologies", "Emerging Topics"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-comst" },
  { id: "ieee_jsac", name: "IEEE Journal on Selected Areas in Communications", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-jsac", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-30", daysUntilDeadline: 164, category: "Traditional Communications", popularity: 94, avgPublishTime: "9-12 months", topics: ["Wireless Communications", "Network Architecture", "Optical Communications", "Satellite Communications", "Emerging Technologies"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-jsac" },
  { id: "ieee_net_letters", name: "IEEE Networking Letters", impact: "Medium-High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-lnet", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 75, avgPublishTime: "4-6 months", topics: ["Network Protocols", "Routing", "Network Performance", "QoS", "Network Management"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-lnet" },
  { id: "ieee_ojcoms", name: "IEEE Open Journal of the Communications Society", impact: "Medium", review: "2-3 months", website: "https://www.comsoc.org/publications/journals/ieee-ojcoms", difficulty: "Low-Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 70, avgPublishTime: "3-4 months", topics: ["Communication Theory", "Wireless Systems", "Network Applications", "Signal Processing", "Emerging Technologies"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-ojcoms" },
  { id: "ieee_tccn", name: "IEEE Transactions on Cognitive Communications and Networking", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tccn", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 85, avgPublishTime: "8-10 months", topics: ["Cognitive Radio", "Spectrum Sensing", "Dynamic Spectrum Access", "Intelligent Networks", "Adaptive Communications"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tccn" },
  { id: "ieee_tcom", name: "IEEE Transactions on Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tcom", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 96, avgPublishTime: "10-14 months", topics: ["Communication Theory", "Modulation & Coding", "Channel Estimation", "Signal Detection", "Information Theory"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tcom" },
  { id: "ieee_tgcn", name: "IEEE Transactions on Green Communications and Networking", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tgcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 78, avgPublishTime: "8-10 months", topics: ["Green Communications", "Energy Efficiency", "Sustainable Networks", "Power Consumption", "Environmental Impact"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tgcn" },
  { id: "ieee_tnet", name: "IEEE Transactions on Networking", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tnet", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 95, avgPublishTime: "10-12 months", topics: ["Network Architecture", "Routing Protocols", "Network Performance", "Congestion Control", "Network Optimization"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tnet" },
  { id: "ieee_twc", name: "IEEE Transactions on Wireless Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-twc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 98, avgPublishTime: "10-14 months", topics: ["Wireless Communications", "MIMO Systems", "Channel Modeling", "Fading Channels", "Antenna Design"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-twc" },
  { id: "ieee_wcl", name: "IEEE Wireless Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-wcl", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 86, avgPublishTime: "5-7 months", topics: ["Wireless Communications", "Mobile Networks", "Signal Processing", "Channel Coding", "Modulation"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-wcl" },
  { id: "ieee_jcn", name: "IEEE/KICS Journal of Communications and Networks", impact: "Medium-High", review: "4-6 months", website: "http://jcn.or.kr/html/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 72, avgPublishTime: "6-8 months", topics: ["Communication Networks", "Network Protocols", "Internet Technologies", "Wireless Networks", "Emerging Applications"], callForPapersUrl: "http://jcn.or.kr/html/" },
  { id: "jocn", name: "Journal of Optical Communications and Networking", impact: "High", review: "4-6 months", website: "https://opg.optica.org/jocn/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 80, avgPublishTime: "7-9 months", topics: ["Optical Communications", "Fiber Optics", "Optical Networks", "Photonics", "Wavelength Division Multiplexing"], callForPapersUrl: "https://opg.optica.org/jocn/" },
  { id: "ieee_iot", name: "IEEE Internet of Things Journal", impact: "High", review: "4-6 months", website: "https://ieee-iotj.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 82, avgPublishTime: "8-10 months", topics: ["Internet of Things", "Sensor Networks", "IoT Protocols", "Edge Computing", "Smart Devices"], callForPapersUrl: "https://ieee-iotj.org/" },
  { id: "ieee_tvt", name: "IEEE Transactions on Vehicular Technology", impact: "High", review: "4-6 months", website: "https://www.ieee.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 76, avgPublishTime: "8-10 months", topics: ["Vehicular Communications", "V2X", "Autonomous Vehicles", "Mobile Networks", "Vehicle Safety"], callForPapersUrl: "https://www.ieee.org/" },
  { id: "signal_processing", name: "Signal Processing (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/signal-processing", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 79, avgPublishTime: "6-9 months", topics: ["Signal Processing", "Digital Signal Processing", "Audio Processing", "Image Processing", "Filtering"], callForPapersUrl: "https://www.sciencedirect.com/journal/signal-processing" },
  { id: "wireless_networks", name: "Wireless Networks (Springer)", impact: "Medium-High", review: "4-6 months", website: "https://link.springer.com/journal/11276", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 74, avgPublishTime: "6-8 months", topics: ["Wireless Networks", "Mobile Communications", "Ad Hoc Networks", "Network Protocols", "Wireless Security"], callForPapersUrl: "https://link.springer.com/journal/11276" },
  { id: "npj_wireless", name: "npj Wireless Technology (Nature)", impact: "High", review: "3-4 months", website: "https://www.nature.com/npjwireltech/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 90, avgPublishTime: "4-6 months", topics: ["Wireless Technology", "Innovation", "5G/6G", "Emerging Wireless", "Breakthrough Research"], callForPapersUrl: "https://www.nature.com/npjwireltech/" },
  { id: "ieee_access", name: "IEEE Access", impact: "Medium", review: "2-3 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639", difficulty: "Low", audience: "Master students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 65, avgPublishTime: "2-3 months", topics: ["All IEEE Topics", "Communications", "Electronics", "Computing", "Interdisciplinary Research"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639" },
  
  // AI & Communications
  { id: "ieee_tmlcn", name: "IEEE Transactions on Machine Learning in Communications", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-tmlcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 97, avgPublishTime: "6-8 months", topics: ["Machine Learning", "Deep Learning", "Neural Networks", "Network Optimization", "Intelligent Systems"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tmlcn" },
  { id: "nature_comms_ai", name: "Nature Communications AI & Computing", impact: "Very High", review: "2-3 months", website: "https://www.nature.com/commsaicomp/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 99, avgPublishTime: "3-5 months", topics: ["Artificial Intelligence", "Machine Learning", "Computing", "AI Applications", "Breakthrough Discoveries"], callForPapersUrl: "https://www.nature.com/commsaicomp/" },
  { id: "ieee_tmbmc", name: "IEEE Transactions on Molecular, Biological, Multi-Scale Communications", impact: "Medium", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tmbmc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 68, avgPublishTime: "8-12 months", topics: ["Molecular Communications", "Biological Communications", "Multi-Scale Systems", "Nano Communications", "Emerging Communication Paradigms"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tmbmc" },
  { id: "ieee_tnse", name: "IEEE Transactions on Network Science and Engineering", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tnse", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 84, avgPublishTime: "7-10 months", topics: ["Network Science", "Graph Theory", "Complex Networks", "Network Analysis", "Social Networks"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tnse" },

  // AI & Embodied Intelligence
  { id: "science_robotics", name: "Science Robotics (AAAS)", impact: "Very High", review: "4-6 months", website: "https://www.science.org/journal/scirobotics", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 99, avgPublishTime: "6-9 months", topics: ["Robotics Fundamentals", "Emerging Technologies", "Robot Applications", "Autonomous Systems", "Human-Robot Interaction"], callForPapersUrl: "https://www.science.org/journal/scirobotics" },
  { id: "ieee_tro", name: "IEEE Transactions on Robotics", impact: "Very High", review: "5-7 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 98, avgPublishTime: "8-12 months", topics: ["Robot Theory", "Motion Control", "Perception", "Planning", "Manipulation"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860" },
  { id: "ieee_ral", name: "IEEE Robotics and Automation Letters (RA-L)", impact: "High", review: "3-4 months", website: "https://www.scimagojr.com/journalsearch.php?q=21100900379", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 92, avgPublishTime: "4-6 months", topics: ["Robot Innovation", "Autonomous Systems", "Control", "Sensing", "Emerging Applications"], callForPapersUrl: "https://www.scimagojr.com/journalsearch.php?q=21100900379" },
  { id: "rcim", name: "Robotics and Computer-Integrated Manufacturing", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/robotics-and-computer-integrated-manufacturing", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 85, avgPublishTime: "6-9 months", topics: ["Industrial Robotics", "Manufacturing Systems", "Integration", "Automation", "Smart Manufacturing"], callForPapersUrl: "https://www.sciencedirect.com/journal/robotics-and-computer-integrated-manufacturing" },
  { id: "jfr", name: "Journal of Field Robotics", impact: "High", review: "4-6 months", website: "https://onlinelibrary.wiley.com/journal/15564967", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 88, avgPublishTime: "7-10 months", topics: ["Field Robotics", "Outdoor Applications", "Autonomous Navigation", "Real-World Deployment", "Practical Systems"], callForPapersUrl: "https://onlinelibrary.wiley.com/journal/15564967" },
  { id: "soft_robotics", name: "Soft Robotics", impact: "High", review: "3-4 months", website: "https://www.liebertpub.com/journal/soro", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 84, avgPublishTime: "5-7 months", topics: ["Soft Robots", "Flexible Materials", "Bio-inspired Design", "Compliant Mechanisms", "Novel Materials"], callForPapersUrl: "https://www.liebertpub.com/journal/soro" },
  { id: "robotics_mdpi", name: "Robotics (MDPI - Open Access)", impact: "Medium", review: "2-3 months", website: "https://www.mdpi.com/journal/robotics", difficulty: "Low-Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 76, avgPublishTime: "3-5 months", topics: ["Robot Systems", "Design", "Theory", "Applications", "Emerging Topics"], callForPapersUrl: "https://www.mdpi.com/journal/robotics" },
  { id: "ieee_tmech", name: "IEEE/ASME Transactions on Mechatronics", impact: "High", review: "4-6 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=3516", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 86, avgPublishTime: "6-9 months", topics: ["Mechatronics", "Control Systems", "Sensing", "Actuators", "Integrated Systems"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=3516" },
  { id: "autonomous_robots", name: "Autonomous Robots", impact: "High", review: "4-6 months", website: "https://www.springer.com/journal/10514", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 87, avgPublishTime: "7-10 months", topics: ["Autonomous Systems", "Navigation", "Planning", "Learning", "Decision Making"], callForPapersUrl: "https://www.springer.com/journal/10514" },
  { id: "current_robotics", name: "Current Robotics Reports", impact: "Medium", review: "3-4 months", website: "https://research.com/journal/current-robotics-reports", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 78, avgPublishTime: "4-6 months", topics: ["Robotics Survey", "Emerging Directions", "State-of-the-Art", "Future Trends", "Research Overview"], callForPapersUrl: "https://research.com/journal/current-robotics-reports" },
];

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Low": return "bg-green-100 text-green-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Medium-High": return "bg-orange-100 text-orange-800";
    case "High": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getCategoryColor(category: string): string {
  if (category === "AI & Communications") return "bg-purple-100 text-purple-800";
  if (category === "AI & Embodied Intelligence") return "bg-orange-100 text-orange-800";
  return "bg-blue-100 text-blue-800";
}

function getDeadlineColor(daysUntilDeadline: number): string {
  if (daysUntilDeadline < 0) return "text-gray-500";
  if (daysUntilDeadline < 7) return "text-red-600";
  if (daysUntilDeadline < 30) return "text-orange-600";
  return "text-green-600";
}

function getDeadlineLabel(daysUntilDeadline: number): string {
  if (daysUntilDeadline < 0) return "已截止";
  if (daysUntilDeadline === 0) return "今日截止";
  if (daysUntilDeadline === 1) return "明日截止";
  return `还有 ${daysUntilDeadline} 天`;
}

type SortBy = "deadline-asc" | "deadline-desc" | "name" | "popularity";
type CategoryFilter = "all" | "traditional" | "ai" | "embodied-ai";

const categoryStyles: Record<CategoryFilter, { bg: string; text: string; label: string }> = {
  all: { bg: "bg-slate-100", text: "text-slate-800", label: "All" },
  traditional: { bg: "bg-blue-100", text: "text-blue-800", label: "Traditional Communications" },
  ai: { bg: "bg-purple-100", text: "text-purple-800", label: "AI & Communications" },
  "embodied-ai": { bg: "bg-orange-100", text: "text-orange-800", label: "AI & Embodied Intelligence" },
};

interface ConferenceData {
  id: string;
  name: string;
  date: string;
  location: string;
  website: string;
  difficulty: string;
  audience: string;
  deadline: string;
  daysUntilDeadline: number;
  category: string;
  popularity: number;
  avgPublishTime: string;
  topics: string[];
  callForPapersUrl?: string;
}

interface JournalData {
  id: string;
  name: string;
  impact: string;
  review: string;
  website: string;
  difficulty: string;
  audience: string;
  deadline: string;
  daysUntilDeadline: number;
  category: string;
  popularity: number;
  avgPublishTime: string;
  topics: string[];
  callForPapersUrl?: string;
}

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [showFilters, setShowFilters] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 如果向下滚动超过100px，则隐藏筛选区域
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowFilters(false);
      } 
      // 如果向上滚动，则显示筛选区域
      else if (currentScrollY < lastScrollY) {
        setShowFilters(true);
      }
      
      // 如果滚动超过300px，显示返回顶部按钮
      setShowScrollTop(currentScrollY > 300);
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      let id = localStorage.getItem('sessionId');
      if (!id) {
        id = Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', id);
      }
      return id;
    }
    return Math.random().toString(36).substr(2, 9);
  });
  
  const { data: stats } = trpc.analytics.getStats.useQuery();
  const recordEventMutation = trpc.analytics.recordEvent.useMutation();
  
  useEffect(() => {
    recordEventMutation.mutate({
      eventType: "page_view",
      sessionId: sessionId,
    });
  }, [sessionId]);

  const [, setLocation] = useLocation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const getCategoryColor = (category: string): string => {
    if (category === "Traditional Communications") return "bg-blue-100 text-blue-800";
    if (category === "AI & Communications") return "bg-purple-100 text-purple-800";
    if (category === "AI & Embodied Intelligence") return "bg-orange-100 text-orange-800";
    return "bg-slate-100 text-slate-800";
  };
  const [sortBy, setSortBy] = useState<SortBy>("deadline-asc");
  const [showExpired, setShowExpired] = useState(false);

  const filteredAndSortedConferences = useMemo(() => {
    let filtered = conferences.filter(conf => {
      const matchesSearch = conf.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = !difficultyFilter || conf.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === "all" || 
        (categoryFilter === "traditional" && conf.category === "Traditional Communications") ||
        (categoryFilter === "ai" && conf.category === "AI & Communications") ||
        (categoryFilter === "embodied-ai" && conf.category === "AI & Embodied Intelligence");
      const matchesExpired = showExpired || conf.daysUntilDeadline >= 0;
      return matchesSearch && matchesDifficulty && matchesCategory && matchesExpired;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "deadline-asc") return a.daysUntilDeadline - b.daysUntilDeadline;
      if (sortBy === "deadline-desc") return b.daysUntilDeadline - a.daysUntilDeadline;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, difficultyFilter, sortBy, showExpired, categoryFilter]);

  const filteredAndSortedJournals = useMemo(() => {
    let filtered = journals.filter(journal => {
      const matchesSearch = journal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = !difficultyFilter || journal.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === "all" || 
        (categoryFilter === "traditional" && journal.category === "Traditional Communications") ||
        (categoryFilter === "ai" && journal.category === "AI & Communications") ||
        (categoryFilter === "embodied-ai" && journal.category === "AI & Embodied Intelligence");
      const matchesExpired = showExpired || journal.daysUntilDeadline >= 0;
      return matchesSearch && matchesDifficulty && matchesCategory && matchesExpired;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "deadline-asc") return a.daysUntilDeadline - b.daysUntilDeadline;
      if (sortBy === "deadline-desc") return b.daysUntilDeadline - a.daysUntilDeadline;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, difficultyFilter, sortBy, showExpired, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-r from-primary to-primary/80 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">Conferences & Journals</h1>
          <p className="text-lg text-blue-50 mb-2">Comprehensive Guide for Graduate Students in ICE</p>
          <p className="text-sm text-blue-100 mb-6">24 Conferences + 33 Journals (Traditional, AI & Communications, AI & Embodied Intelligence)</p>
          <div className="flex justify-center gap-4 text-sm mb-6">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{stats?.uniqueVisitors || 0} Visitors</span>
            </div>
            <div className="flex items-center gap-1">
              <MousePointerClick size={16} />
              <span>{stats?.totalClicks || 0} Interactions</span>
            </div>
          </div>
          <Button onClick={() => setLocation("/my-list")} variant="secondary" size="lg" className="gap-2">
            <Heart size={20} />
            My Submission List ({favorites.length})
          </Button>
        </div>
      </section>

      {/* Filter Section - Sticky with Collapse Animation */}
      <section className={`sticky top-0 z-40 w-full bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
        showFilters ? 'max-h-96' : 'max-h-0'
      }`}>
        <div className="container mx-auto px-4 py-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search conferences or journals..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-muted-foreground min-w-fit">Category:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryStyles).map(([key, style]) => (
                <Button
                  key={key}
                  variant={categoryFilter === key ? "default" : "outline"}
                  onClick={() => setCategoryFilter(key as CategoryFilter)}
                  size="sm"
                  className={categoryFilter === key ? `${style.bg} ${style.text} hover:opacity-90` : ""}
                >
                  {style.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-muted-foreground min-w-fit">Difficulty:</span>
            <div className="flex flex-wrap gap-2">
              <Button variant={!difficultyFilter ? "default" : "outline"} onClick={() => setDifficultyFilter(null)} size="sm">All</Button>
              {["Low", "Medium", "Medium-High", "High"].map(diff => (
                <Button key={diff} variant={difficultyFilter === diff ? "default" : "outline"} onClick={() => setDifficultyFilter(diff)} size="sm">{diff}</Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-muted-foreground min-w-fit">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              <Button variant={sortBy === "deadline-asc" ? "default" : "outline"} onClick={() => setSortBy("deadline-asc")} size="sm" className="gap-2">
                <ArrowUpDown size={16} />Deadline (Soon First)
              </Button>
              <Button variant={sortBy === "deadline-desc" ? "default" : "outline"} onClick={() => setSortBy("deadline-desc")} size="sm" className="gap-2">
                <ArrowUpDown size={16} />Deadline (Later First)
              </Button>
              <Button variant={sortBy === "name" ? "default" : "outline"} onClick={() => setSortBy("name")} size="sm">Name (A-Z)</Button>
              <Button variant={sortBy === "popularity" ? "default" : "outline"} onClick={() => setSortBy("popularity")} size="sm" className="gap-2">
                <Award size={16} />Popularity
              </Button>
              <Button variant={showExpired ? "default" : "outline"} onClick={() => setShowExpired(!showExpired)} size="sm">
                {showExpired ? "Show All" : "Hide Expired"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={`w-full py-8 transition-all duration-300 ${
        showFilters ? 'pt-24' : 'pt-8'
      }`}>
        <div className="container mx-auto px-4">
          <Tabs defaultValue="conferences" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 mt-4">
              <TabsTrigger value="conferences">Conferences ({filteredAndSortedConferences.length})</TabsTrigger>
              <TabsTrigger value="journals">Journals ({filteredAndSortedJournals.length})</TabsTrigger>
            </TabsList>

            {/* Conferences Tab */}
            <TabsContent value="conferences" className="space-y-4">
              {filteredAndSortedConferences.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No conferences found matching your criteria.</p>
              ) : (
                filteredAndSortedConferences.map(conf => (
                  <Card key={conf.id} className={`hover:shadow-lg transition-shadow ${conf.daysUntilDeadline < 0 ? "opacity-60" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg md:text-xl mb-2">{conf.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={getCategoryColor(conf.category)} variant="outline">{conf.category}</Badge>
                            <Badge className={getDifficultyColor(conf.difficulty)}>Difficulty: {conf.difficulty}</Badge>
                            <Badge variant="outline" className="bg-blue-50">{conf.audience}</Badge>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-900">🔥 {conf.popularity}% Hot</Badge>
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
                        <div><p className="font-semibold text-muted-foreground">Avg. Publish Time</p><p className="text-green-600 font-medium">{conf.avgPublishTime}</p></div>
                      </div>
                      <div>
                        <p className="font-semibold text-muted-foreground mb-2 text-sm">📋 Paper Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {conf.topics.map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="bg-slate-100 text-slate-800 text-xs">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <a href={conf.website} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="gap-2"><Award size={16} />Visit Website</Button>
                        </a>
                        {conf.callForPapersUrl && (
                          <a href={conf.callForPapersUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-2"><MousePointerClick size={16} />Call for Papers</Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Journals Tab */}
            <TabsContent value="journals" className="space-y-4">
              {filteredAndSortedJournals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No journals found matching your criteria.</p>
              ) : (
                filteredAndSortedJournals.map(journal => (
                  <Card key={journal.id} className={`hover:shadow-lg transition-shadow ${journal.daysUntilDeadline < 0 ? "opacity-60" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg md:text-xl mb-2">{journal.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={getCategoryColor(journal.category)} variant="outline">{journal.category}</Badge>
                            <Badge className={getDifficultyColor(journal.difficulty)}>Difficulty: {journal.difficulty}</Badge>
                            <Badge variant="outline" className="bg-blue-50">{journal.audience}</Badge>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-900">🔥 {journal.popularity}% Hot</Badge>
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
                        <div><p className="font-semibold text-muted-foreground">Avg. Publish Time</p><p className="text-green-600 font-medium">{journal.avgPublishTime}</p></div>
                      </div>
                      <div>
                        <p className="font-semibold text-muted-foreground mb-2 text-sm">📋 Paper Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {journal.topics.map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="bg-slate-100 text-slate-800 text-xs">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <a href={journal.website} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="gap-2"><Award size={16} />Visit Website</Button>
                        </a>
                        {journal.callForPapersUrl && (
                          <a href={journal.callForPapersUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-2"><MousePointerClick size={16} />Call for Papers</Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
          title="Return to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}


