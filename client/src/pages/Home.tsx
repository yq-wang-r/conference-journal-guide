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
import { useEffect as useEffectTimer } from "react";

// 计算距离截止日期的时间
const calculateTimeRemaining = (deadline: string) => {
  const now = new Date('2026-01-19T00:00:00').getTime();
  const deadlineDate = new Date(deadline).getTime();
  const diff = deadlineDate - now;
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, isExpired: false };
};

// 格式化时间显示
const formatTimeRemaining = (deadline: string) => {
  const { days, hours, minutes, seconds, isExpired } = calculateTimeRemaining(deadline);
  if (isExpired) return "已截止";
  if (days > 0) return `${days}天 ${hours}小时`;
  if (hours > 0) return `${hours}小时 ${minutes}分钟`;
  if (minutes > 0) return `${minutes}分钟 ${seconds}秒`;
  return `${seconds}秒`;
};

const conferences = [
  // Traditional Communications
  { id: "icc2026", name: "IEEE ICC 2026", date: "May 24-28, 2026", location: "Glasgow, UK", website: "https://icc2026.ieee-icc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-01-18", daysUntilDeadline: 0, category: "Traditional Communications", popularity: 95, avgPublishTime: "6-8 months", isEI: true, topics: ["Cognitive Radio and AI-Enabled Networks", "Communication and Information Systems Security", "Communication QoS, Reliability and Modeling", "Communications Software and Multimedia", "Communication Theory", "Green Communications Systems and Networks", "IoT and Sensor Networks", "Mobile and Wireless Networks", "Next-Generation Networking and Internet", "Optical Networks & Systems", "Signal Processing for Communications", "Wireless Communications"], callForPapersUrl: "https://icc2026.ieee-icc.org/authors/call-symposia-papers" },
  { id: "wcnc2026", name: "IEEE WCNC 2026", date: "April 13-16, 2026", location: "Kuala Lumpur, Malaysia", website: "https://wcnc2026.ieee-wcnc.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28, category: "Traditional Communications", popularity: 90, avgPublishTime: "6-8 months", isEI: true, topics: ["Physical Layer and Communication Theory", "Medium Access Control and Networking", "Machine Learning and Optimization for Wireless Systems", "Emerging Technologies, Network Architectures, and Applications"], callForPapersUrl: "http://wcnc2026.ieee-wcnc.org/call-papers" },
  { id: "globecom2026", name: "IEEE GLOBECOM 2026", date: "December 7-11, 2026", location: "Macau, China", website: "https://globecom2026.ieee-globecom.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-15", daysUntilDeadline: 149, category: "Traditional Communications", popularity: 92, isEI: true, avgPublishTime: "6-8 months", topics: ["Optical Communications", "Satellite Communications", "Network Architecture", "Internet of Things", "Spectrum Sharing", "6G Networks", "AI for Communications"], callForPapersUrl: "https://globecom2026.ieee-globecom.org/" },
  { id: "icct2026", name: "IEEE ICCT 2026", date: "October 16-18, 2026", location: "Zhuhai, China", website: "https://www.ieee-icct.org/", difficulty: "Medium-High", audience: "Master & PhD students", deadline: "2026-05-31", daysUntilDeadline: 134, category: "Traditional Communications", popularity: 75, isEI: true, avgPublishTime: "4-6 months", topics: ["Communication and Information Theory", "Signal Processing for Communications", "Integrated Sensing and Communication", "Intelligent and Semantic Communications", "AI for Communications and Networks", "Cloud and Edge Computing", "Mobile and Wireless Networks", "Internet-of-Things & Sensor Networks", "Space-Air-Ground Communication and Space Networking", "Communication and Information Security", "Communication QoS, Reliability & Modeling", "Optical Communications and Networks", "Green Communication Systems & Networks", "Reconfigurable Intelligent Surfaces", "Aerial Communications, UAV Communications, Vehicular Networks"], callForPapersUrl: "https://www.ieee-icct.org/cfp.html" },
  { id: "ctw2026", name: "IEEE CTW 2026", date: "May 17-20, 2026", location: "Azores, Portugal", website: "https://ctw2026.ieee-ctw.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-01", daysUntilDeadline: 14, category: "Traditional Communications", popularity: 80, isEI: true, avgPublishTime: "3-4 months", topics: ["Network information theory and low-latency fundamentals", "Channel estimation, synchronization, and detection", "Coding, modulation, and source–channel processing", "MIMO and cooperative multi-antenna systems", "Multiple access, resource allocation, and scheduling", "Interference, diversity, and fading countermeasures", "Cache-aided, distributed, and energy-aware communications", "Machine learning and AI-driven communication theory", "Integrated communication, sensing, and security", "Emerging paradigms and theoretical frameworks"], callForPapersUrl: "http://ctw2026.ieee-ctw.org/authors/call-posters" },
  { id: "secon2026", name: "IEEE SECON 2026", date: "April 27-29, 2026", location: "Abu Dhabi, UAE", website: "https://secon2026.ieee-secon.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "Traditional Communications", popularity: 78, isEI: true, avgPublishTime: "5-7 months", topics: ["New communication paradigms (Terahertz, optical wireless, visible light, acoustic, RIS)", "Cellular communications (5G, 6G and beyond)", "Molecular communication networks", "Low-power, energy limited and battery-free sensing and communications", "Internet of Things; cyber-physical systems", "UAV-based sensing/communications/networking", "Communication and networking for AI and machine learning", "Data analytics, AI, and machine learning for sensing, communication, and networking", "Generative AI and autonomous agents", "Cloud, edge, and fog computing", "Time and location in sensing, communication, and networking", "Fairness and socio-technical issues", "Security, privacy, and trustworthiness", "Novel experimental testbeds", "Deployment experiences", "Sensing in challenging scenarios", "Resilience, dependability and sustainability", "Novel applications (wearables, VR/AR, smart communities)", "Integrated sensing and communications (ISAC)"], callForPapersUrl: "http://secon2026.ieee-secon.org/call-papers" },
  { id: "ccnc2026", name: "IEEE CCNC 2026", date: "January 9-12, 2026", location: "Las Vegas, USA", website: "https://ccnc2026.ieee-ccnc.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2025-09-15", daysUntilDeadline: -125, category: "Traditional Communications", popularity: 70, isEI: true, avgPublishTime: "4-5 months", topics: ["Edge/Cloud Computing and Networking", "Networking Solutions for Metaverse, Social Applications, Multimedia, and Games", "Testbeds, Experimentation and Datasets for Communications and Networking", "Wireless Communications: Fundamentals, PHY and Above"], callForPapersUrl: "http://ccnc2026.ieee-ccnc.org/call-technical-papers" },
  { id: "isac2026", name: "IEEE ISAC 2026", date: "November 16-18, 2026", location: "Lisbon, Portugal", website: "https://isac2026.isac-ieee.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-01", daysUntilDeadline: 135, category: "Traditional Communications", popularity: 82, isEI: true, avgPublishTime: "6-9 months", topics: ["Cellular networks", "Internet of things and sensor networks", "Local area networks", "Satellite networks", "Underwater networks", "Vehicular and UAV networks", "Passive and opportunistic radar and sonar", "Remote sensing, geosensing and GNSS reflectometry", "Airborne, space and automotive radar systems"], callForPapersUrl: "https://isac2026.isac-ieee.org/" },
  { id: "latiot2026", name: "IEEE LC-IoT 2026", date: "March 19-21, 2026", location: "Bogotá, Colombia", website: "https://lciot2026.iot.ieee.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-31", daysUntilDeadline: 13, category: "Traditional Communications", popularity: 65, isEI: true, avgPublishTime: "3-5 months", topics: ["Internet of Things", "IoT Applications", "Sensor Networks", "Edge Computing", "Smart Cities", "Connected Devices"], callForPapersUrl: "https://lciot2026.iot.ieee.org/call-papers" },
  { id: "wimob2026", name: "WiMob 2026", date: "TBD", location: "TBD", website: "http://www.wimob.org/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-04-15", daysUntilDeadline: 88, category: "Traditional Communications", popularity: 68, isEI: true, avgPublishTime: "4-6 months", topics: ["Mobile Computing", "Wireless Networks", "Mobile Applications", "Ubiquitous Computing", "Context Awareness"], callForPapersUrl: "http://www.wimob.org/" },
  { id: "ogc2026", name: "IEEE OGC 2026 (Optoelectronics Global Conference)", date: "September 8-11, 2026", location: "Shenzhen, China", website: "https://ipsogc.org/", difficulty: "Medium-High", audience: "PhD students, Researchers", deadline: "2026-06-15", daysUntilDeadline: 148, category: "Traditional Communications", popularity: 75, isEI: true, avgPublishTime: "4-6 months", topics: ["Laser Technology", "Optical Communication and Networks", "Metamaterials and Photonic Crystals", "Quantum Optics and Information", "Fiber-Based Technologies", "Optoelectronic Devices", "Biophotonics", "Data Center Optical Interconnects", "Silicon Photonics", "Computational Imaging"], callForPapersUrl: "https://ipsogc.org/" },
  { id: "icmae2026", name: "IEEE ICMAE 2026 (Mechanical and Aerospace Engineering)", date: "July 15-17, 2026", location: "London, UK", website: "https://www.icmae.org/", difficulty: "Medium-High", audience: "PhD students, Researchers", deadline: "2026-04-15", daysUntilDeadline: 88, category: "Traditional Communications", popularity: 70, isEI: true, avgPublishTime: "5-7 months", topics: ["Mechanical Engineering", "Aerospace Engineering", "Control Systems", "Robotics", "Manufacturing", "Materials Science", "Thermal Engineering", "Fluid Mechanics", "Structural Analysis", "Advanced Materials"], callForPapersUrl: "https://www.icmae.org/" },
  { id: "cisce2026", name: "IEEE CISCE 2026 (Communications & Computer Engineering)", date: "March 27, 2026", location: "China", website: "https://www.conference2go.com/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-27", daysUntilDeadline: 9, category: "AI & Communications", popularity: 65, isEI: true, avgPublishTime: "4-6 months", topics: ["Communications Systems", "Computer Engineering", "Signal Processing", "Network Architecture", "Software Engineering", "Data Management", "System Integration", "Performance Optimization", "Security", "Emerging Technologies"], callForPapersUrl: "https://www.conference2go.com/" },
  { id: "icasse2026", name: "ICASSE 2026 (Aerospace System Science & Engineering)", date: "TBD 2026", location: "Shanghai, China", website: "https://icasse.sjtu.edu.cn/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-05-15", daysUntilDeadline: 117, category: "Traditional Communications", popularity: 72, isEI: true, avgPublishTime: "6-8 months", topics: ["Aerospace Systems", "Flight Dynamics", "Control Systems", "Aerodynamics", "Propulsion Systems", "Materials and Structures", "Avionics", "System Integration", "Testing and Validation", "Space Applications"], callForPapersUrl: "https://icasse.sjtu.edu.cn/" },

  // Additional EI-Indexed Conferences 2026
  { id: "ogc2026", name: "IEEE OGC 2026 (Optoelectronics Global Conference)", date: "September 8-11, 2026", location: "Shenzhen, China", website: "https://ipsogc.org/", difficulty: "Medium-High", audience: "PhD students, Researchers", deadline: "2026-06-15", daysUntilDeadline: 148, category: "Traditional Communications", popularity: 75, isEI: true, avgPublishTime: "4-6 months", topics: ["Laser Technology", "Optical Communication and Networks", "Metamaterials and Photonic Crystals", "Quantum Optics and Information", "Fiber-Based Technologies and Applications", "Optoelectronic Devices and Applications", "Biophotonics and Optical Biomedicine", "Data Center Optical Interconnects", "Silicon Photonics", "Computational Imaging"], callForPapersUrl: "https://ipsogc.org/" },
  { id: "icmae2026", name: "IEEE ICMAE 2026 (Mechanical and Aerospace Engineering)", date: "July 15-17, 2026", location: "London, UK", website: "https://www.icmae.org/", difficulty: "Medium-High", audience: "PhD students, Researchers", deadline: "2026-04-15", daysUntilDeadline: 88, category: "Traditional Communications", popularity: 70, isEI: true, avgPublishTime: "5-7 months", topics: ["Mechanical Engineering", "Aerospace Engineering", "Control Systems", "Robotics", "Manufacturing", "Materials Science", "Thermal Engineering", "Fluid Mechanics", "Structural Analysis", "Advanced Materials"], callForPapersUrl: "https://www.icmae.org/" },
  { id: "emc2_2026", name: "IEEE EMC² 2026 (Embedded Systems & Mobile Computing)", date: "January 12-14, 2026", location: "Hong Kong", website: "https://www.industryevents.com/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2025-11-15", daysUntilDeadline: -65, category: "AI & Communications", popularity: 68, isEI: true, avgPublishTime: "3-5 months", topics: ["Embedded Systems", "Mobile Communication", "IoT Devices", "Edge Computing", "Real-time Systems", "Wireless Protocols", "System Design", "Power Management", "Security in Embedded Systems", "5G/6G Integration"], callForPapersUrl: "https://www.industryevents.com/" },
  { id: "cisce2026", name: "IEEE CISCE 2026 (Communications & Computer Engineering)", date: "March 27, 2026", location: "China", website: "https://www.conference2go.com/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-27", daysUntilDeadline: 9, category: "AI & Communications", popularity: 65, isEI: true, avgPublishTime: "4-6 months", topics: ["Communications Systems", "Computer Engineering", "Signal Processing", "Network Architecture", "Software Engineering", "Data Management", "System Integration", "Performance Optimization", "Security", "Emerging Technologies"], callForPapersUrl: "https://www.conference2go.com/" },
  { id: "icasse2026", name: "ICASSE 2026 (Aerospace System Science & Engineering)", date: "TBD 2026", location: "Shanghai, China", website: "https://icasse.sjtu.edu.cn/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-05-15", daysUntilDeadline: 117, category: "Traditional Communications", popularity: 72, isEI: true, avgPublishTime: "6-8 months", topics: ["Aerospace Systems", "Flight Dynamics", "Control Systems", "Aerodynamics", "Propulsion Systems", "Materials and Structures", "Avionics", "System Integration", "Testing and Validation", "Space Applications"], callForPapersUrl: "https://icasse.sjtu.edu.cn/" },

  { id: "eice2026", name: "EICE 2026", date: "January 30 - February 1, 2026", location: "Sanya, China", website: "http://www.ei-ce.com/", difficulty: "Low", audience: "Master students", deadline: "2026-01-20", daysUntilDeadline: 2, category: "Traditional Communications", popularity: 60, isEI: true, avgPublishTime: "2-3 months", topics: ["Electronics & Information", "Communication Engineering", "Signal Processing", "Network Technology", "Wireless Communications"], callForPapersUrl: "http://www.ei-ce.com/" },
  

  { id: "infocom2026", name: "IEEE INFOCOM 2026", date: "May 18-21, 2026", location: "Tokyo, Japan", website: "https://infocom2026.ieee-infocom.org/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2025-07-31", daysUntilDeadline: 194, category: "Traditional Communications", popularity: 98, isEI: true, isScoped: false, avgPublishTime: "8-10 months", topics: ["Network Architecture", "Routing", "Congestion Control", "Wireless Networks", "Network Security"], callForPapersUrl: "https://infocom2026.ieee-infocom.org/call-papers" },

    // AI & Communications
  { id: "icmlcn2026", name: "IEEE ICMLCN 2026", date: "May 26-29, 2026", location: "Barcelona, Spain", website: "https://icmlcn2026.ieee-icmlcn.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-01-31", daysUntilDeadline: 13, category: "AI & Communications", popularity: 98, isScoped: true, avgPublishTime: "5-7 months", topics: ["Machine Learning for Communications", "Deep Learning", "Neural Networks", "Network Optimization", "Intelligent Resource Allocation"], callForPapersUrl: "https://icmlcn2026.ieee-icmlcn.org/" },
  { id: "6g_summit_2026", name: "EuCNC & 6G Summit 2026", date: "June 2-4, 2026", location: "Malaga, Spain", website: "https://6g-ia.eu/event/eucnc-6g-summit-2026-malaga-spain/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-28", daysUntilDeadline: 41, category: "AI & Communications", popularity: 96, isScoped: true, avgPublishTime: "6-8 months", topics: ["6G Networks", "Beyond 5G", "Terahertz Communications", "AI for Networks", "Quantum Communications"], callForPapersUrl: "https://6g-ia.eu/event/eucnc-6g-summit-2026-malaga-spain/" },
  { id: "global_6g_2026", name: "Global 6G Conference 2026", date: "April 15-17, 2026", location: "Nanjing, China", website: "https://en.g6gconference.com/", difficulty: "Medium-High", audience: "Master & PhD students", deadline: "2026-02-15", daysUntilDeadline: 28, category: "AI & Communications", popularity: 88, isScoped: true, avgPublishTime: "4-6 months", topics: ["6G Technologies", "Intelligent Surfaces", "Holographic Communications", "AI Integration", "Network Slicing"], callForPapersUrl: "https://en.g6gconference.com/" },
  { id: "san_diego_wireless_2026", name: "San Diego Wireless Summit 2026", date: "January 22-23, 2026", location: "San Diego, USA", website: "https://6g.ucsd.edu/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-01-10", daysUntilDeadline: -8, category: "AI & Communications", popularity: 72, isScoped: true, avgPublishTime: "3-5 months", topics: ["Wireless Technology", "5G/6G", "Spectrum Technology", "Innovation in Wireless", "Future Networks"], callForPapersUrl: "https://6g.ucsd.edu/" },

  // AI & Machine Learning Conferences
  { id: "icml2026", name: "ICML 2026 (International Conference on Machine Learning)", date: "July 2026", location: "Vienna, Austria", website: "https://icml.cc/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28, category: "AI", popularity: 100, isScoped: true, avgPublishTime: "8-10 months", topics: ["Machine Learning Theory", "Deep Learning", "Reinforcement Learning", "Optimization", "Applications"], callForPapersUrl: "https://icml.cc/" },
  { id: "neurips2026", name: "NeurIPS 2026 (Neural Information Processing Systems)", date: "December 2026", location: "New Orleans, USA", website: "https://nips.cc/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-05-15", daysUntilDeadline: 117, category: "AI", popularity: 100, isScoped: true, avgPublishTime: "8-10 months", topics: ["Neural Networks", "Deep Learning", "Probabilistic Models", "Learning Theory", "Applications"], callForPapersUrl: "https://nips.cc/" },
  { id: "iclr2026", name: "ICLR 2026 (International Conference on Learning Representations)", date: "May 2026", location: "Barcelona, Spain", website: "https://iclr.cc/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-01-31", daysUntilDeadline: 13, category: "AI", popularity: 99, isScoped: true, avgPublishTime: "6-8 months", topics: ["Learning Representations", "Deep Learning", "Unsupervised Learning", "Supervised Learning", "Transfer Learning"], callForPapersUrl: "https://iclr.cc/" },
  { id: "cvpr2026", name: "CVPR 2026 (IEEE/CVF Conference on Computer Vision and Pattern Recognition)", date: "June 2026", location: "Seattle, USA", website: "https://cvpr2025.thecvf.com/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "AI", popularity: 99, isScoped: true, avgPublishTime: "7-9 months", topics: ["Computer Vision", "Image Recognition", "Object Detection", "Segmentation", "3D Vision"], callForPapersUrl: "https://cvpr2025.thecvf.com/" },
  { id: "iccv2026", name: "ICCV 2026 (International Conference on Computer Vision)", date: "October 2026", location: "Paris, France", website: "https://iccv2025.thecvf.com/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "AI", popularity: 99, isScoped: true, avgPublishTime: "7-9 months", topics: ["Computer Vision", "Video Analysis", "3D Reconstruction", "Visual Understanding", "Applications"], callForPapersUrl: "https://iccv2025.thecvf.com/" },
  { id: "eccv2026", name: "ECCV 2026 (European Conference on Computer Vision)", date: "September 2026", location: "Milan, Italy", website: "https://eccv.ecva.net/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "AI", popularity: 98, isScoped: true, avgPublishTime: "7-9 months", topics: ["Computer Vision", "Image Processing", "Pattern Recognition", "Video Understanding", "3D Analysis"], callForPapersUrl: "https://eccv.ecva.net/" },
  { id: "aaai2026", name: "AAAI 2026 (Association for the Advancement of Artificial Intelligence)", date: "February 2026", location: "Philadelphia, USA", website: "https://aaai.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2025-08-15", daysUntilDeadline: -157, category: "AI", popularity: 96, isScoped: true, avgPublishTime: "6-8 months", topics: ["AI Planning", "Knowledge Representation", "Machine Learning", "Robotics", "NLP"], callForPapersUrl: "https://aaai.org/" },
  { id: "ijcai2026", name: "IJCAI 2026 (International Joint Conference on Artificial Intelligence)", date: "August 2026", location: "Montreal, Canada", website: "https://www.ijcai.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28, category: "AI", popularity: 96, isScoped: true, avgPublishTime: "6-8 months", topics: ["AI Fundamentals", "Machine Learning", "Knowledge Systems", "Robotics", "Applications"], callForPapersUrl: "https://www.ijcai.org/" },
  { id: "acl2026", name: "ACL 2026 (Association for Computational Linguistics)", date: "July 2026", location: "Toronto, Canada", website: "https://www.aclweb.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28, category: "AI", popularity: 95, isScoped: true, avgPublishTime: "6-8 months", topics: ["Natural Language Processing", "Machine Translation", "Language Understanding", "Dialogue Systems", "Applications"], callForPapersUrl: "https://www.aclweb.org/" },
  { id: "ecml2026", name: "ECML-PKDD 2026 (European Conference on Machine Learning)", date: "September 2026", location: "Ghent, Belgium", website: "https://www.ecmlpkdd.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "AI", popularity: 94, isScoped: true, avgPublishTime: "6-8 months", topics: ["Machine Learning", "Data Mining", "Knowledge Discovery", "Pattern Recognition", "Applications"], callForPapersUrl: "https://www.ecmlpkdd.org/" },

  // Robotics Conferences
  { id: "icra2026", name: "ICRA 2026 (IEEE International Conference on Robotics and Automation)", date: "May 2026", location: "Barcelona, Spain", website: "https://2025.ieee-icra.org/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-02-15", daysUntilDeadline: 28, category: "AI & Embodied Intelligence", popularity: 99, isEI: true, avgPublishTime: "7-9 months", topics: ["Robot Manipulation", "Motion Planning", "Control", "Perception", "Human-Robot Interaction"], callForPapersUrl: "https://2025.ieee-icra.org/" },
  { id: "iros2026", name: "IROS 2026 (IEEE/RSJ International Conference on Intelligent Robots and Systems)", date: "October 2026", location: "Bangkok, Thailand", website: "https://www.iros.org/", difficulty: "Very High", audience: "PhD students, Researchers", deadline: "2026-03-15", daysUntilDeadline: 56, category: "AI & Embodied Intelligence", popularity: 99, isEI: true, avgPublishTime: "7-9 months", topics: ["Robot Design", "Autonomous Systems", "Sensing", "Learning", "Applications"], callForPapersUrl: "https://www.iros.org/" },
];

const journals = [
  // Traditional Communications
  { id: "ieee_comm_letters", name: "IEEE Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-comml", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 88, isEI: true, isSCI: true, avgPublishTime: "5-7 months", topics: ["Communication Theory", "Signal Processing", "Wireless Communications", "Network Protocols", "Information Theory"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-comml" },
  { id: "ieee_comm_surveys", name: "IEEE Communications Surveys & Tutorials", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-comst", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 92, isEI: true, isSCI: true, avgPublishTime: "8-12 months", topics: ["Survey Papers", "Tutorial Articles", "Communication Systems", "Network Technologies", "Emerging Topics"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-comst" },
  { id: "ieee_jsac", name: "IEEE Journal on Selected Areas in Communications", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-jsac", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-06-30", daysUntilDeadline: 164, category: "Traditional Communications", popularity: 94, isEI: true, isSCI: true, avgPublishTime: "9-12 months", topics: ["Wireless Communications", "Network Architecture", "Optical Communications", "Satellite Communications", "Emerging Technologies"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-jsac" },
  { id: "ieee_net_letters", name: "IEEE Networking Letters", impact: "Medium-High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-lnet", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 75, isEI: true, isSCI: true, avgPublishTime: "4-6 months", topics: ["Network Protocols", "Routing", "Network Performance", "QoS", "Network Management"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-lnet" },
  { id: "ieee_ojcoms", name: "IEEE Open Journal of the Communications Society", impact: "Medium", review: "2-3 months", website: "https://www.comsoc.org/publications/journals/ieee-ojcoms", difficulty: "Low-Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 70, isEI: true, isSCI: true, avgPublishTime: "3-4 months", topics: ["Communication Theory", "Wireless Systems", "Network Applications", "Signal Processing", "Emerging Technologies"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-ojcoms" },
  { id: "ieee_tccn", name: "IEEE Transactions on Cognitive Communications and Networking", impact: "High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tccn", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 85, isEI: true, isSCI: true, avgPublishTime: "8-10 months", topics: ["Cognitive Radio", "Spectrum Sensing", "Dynamic Spectrum Access", "Intelligent Networks", "Adaptive Communications"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tccn" },
  { id: "ieee_tcom", name: "IEEE Transactions on Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tcom", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 96, isEI: true, isSCI: true, avgPublishTime: "10-14 months", topics: ["Communication Theory", "Modulation & Coding", "Channel Estimation", "Signal Detection", "Information Theory"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tcom" },
  { id: "ieee_tgcn", name: "IEEE Transactions on Green Communications and Networking", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tgcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 78, isEI: true, isSCI: true, avgPublishTime: "8-10 months", topics: ["Green Communications", "Energy Efficiency", "Sustainable Networks", "Power Consumption", "Environmental Impact"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tgcn" },
  { id: "ieee_tnet", name: "IEEE Transactions on Networking", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-tnet", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 95, isEI: true, isSCI: true, avgPublishTime: "10-12 months", topics: ["Network Architecture", "Routing Protocols", "Network Performance", "Congestion Control", "Network Optimization"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tnet" },
  { id: "ieee_twc", name: "IEEE Transactions on Wireless Communications", impact: "Very High", review: "5-7 months", website: "https://www.comsoc.org/publications/journals/ieee-twc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 98, isEI: true, isSCI: true, avgPublishTime: "10-14 months", topics: ["Wireless Communications", "MIMO Systems", "Channel Modeling", "Fading Channels", "Antenna Design"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-twc" },
  { id: "ieee_wcl", name: "IEEE Wireless Communications Letters", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-wcl", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 86, isEI: true, isSCI: true, avgPublishTime: "5-7 months", topics: ["Wireless Communications", "Mobile Networks", "Signal Processing", "Channel Coding", "Modulation"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-wcl" },
  { id: "ieee_jcn", name: "IEEE/KICS Journal of Communications and Networks", impact: "Medium-High", review: "4-6 months", website: "http://jcn.or.kr/html/", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 72, isEI: true, isSCI: true, avgPublishTime: "6-8 months", topics: ["Communication Networks", "Network Protocols", "Internet Technologies", "Wireless Networks", "Emerging Applications"], callForPapersUrl: "http://jcn.or.kr/html/" },
  { id: "jocn", name: "Journal of Optical Communications and Networking", impact: "High", review: "4-6 months", website: "https://opg.optica.org/jocn/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 80, isEI: true, isSCI: true, avgPublishTime: "7-9 months", topics: ["Optical Communications", "Fiber Optics", "Optical Networks", "Photonics", "Wavelength Division Multiplexing"], callForPapersUrl: "https://opg.optica.org/jocn/" },
  { id: "ieee_iot", name: "IEEE Internet of Things Journal", impact: "High", review: "4-6 months", website: "https://ieee-iotj.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 82, isEI: true, isSCI: true, avgPublishTime: "8-10 months", topics: ["Internet of Things", "Sensor Networks", "IoT Protocols", "Edge Computing", "Smart Devices"], callForPapersUrl: "https://ieee-iotj.org/" },
  { id: "ieee_tvt", name: "IEEE Transactions on Vehicular Technology", impact: "High", review: "4-6 months", website: "https://www.ieee.org/", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 76, isEI: true, isSCI: true, avgPublishTime: "8-10 months", topics: ["Vehicular Communications", "V2X", "Autonomous Vehicles", "Mobile Networks", "Vehicle Safety"], callForPapersUrl: "https://www.ieee.org/" },
  { id: "signal_processing", name: "Signal Processing (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/signal-processing", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 79, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Signal Processing", "Digital Signal Processing", "Audio Processing", "Image Processing", "Filtering"], callForPapersUrl: "https://www.sciencedirect.com/journal/signal-processing" },
  { id: "wireless_networks", name: "Wireless Networks (Springer)", impact: "Medium-High", review: "4-6 months", website: "https://link.springer.com/journal/11276", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 74, isEI: true, isSCI: true, avgPublishTime: "6-8 months", topics: ["Wireless Networks", "Mobile Communications", "Ad Hoc Networks", "Network Protocols", "Wireless Security"], callForPapersUrl: "https://link.springer.com/journal/11276" },
  { id: "npj_wireless", name: "npj Wireless Technology (Nature)", impact: "High", review: "3-4 months", website: "https://www.nature.com/npjwireltech/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 90, isEI: true, isSCI: true, avgPublishTime: "4-6 months", topics: ["Wireless Technology", "Innovation", "5G/6G", "Emerging Wireless", "Breakthrough Research"], callForPapersUrl: "https://www.nature.com/npjwireltech/" },
  { id: "ieee_access", name: "IEEE Access", impact: "Medium", review: "2-3 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639", difficulty: "Low", audience: "Master students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 65, isEI: true, isSCI: true, avgPublishTime: "2-3 months", topics: ["All IEEE Topics", "Communications", "Electronics", "Computing", "Interdisciplinary Research"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639" },
  
  // AI & Communications
  { id: "ieee_tmlcn", name: "IEEE Transactions on Machine Learning in Communications", impact: "High", review: "3-4 months", website: "https://www.comsoc.org/publications/journals/ieee-tmlcn", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 97, isEI: true, isSCI: true, avgPublishTime: "6-8 months", topics: ["Machine Learning", "Deep Learning", "Neural Networks", "Network Optimization", "Intelligent Systems"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tmlcn" },
  { id: "nature_comms_ai", name: "Nature Communications AI & Computing", impact: "Very High", review: "2-3 months", website: "https://www.nature.com/commsaicomp/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 99, isEI: true, isSCI: true, avgPublishTime: "3-5 months", topics: ["Artificial Intelligence", "Machine Learning", "Computing", "AI Applications", "Breakthrough Discoveries"], callForPapersUrl: "https://www.nature.com/commsaicomp/" },
  { id: "ieee_tmbmc", name: "IEEE Transactions on Molecular, Biological, Multi-Scale Communications", impact: "Medium", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tmbmc", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 68, isEI: true, isSCI: true, avgPublishTime: "8-12 months", topics: ["Molecular Communications", "Biological Communications", "Multi-Scale Systems", "Nano Communications", "Emerging Communication Paradigms"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tmbmc" },
  { id: "ieee_tnse", name: "IEEE Transactions on Network Science and Engineering", impact: "Medium-High", review: "4-6 months", website: "https://www.comsoc.org/publications/journals/ieee-tnse", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Communications", popularity: 84, isEI: true, isSCI: true, avgPublishTime: "7-10 months", topics: ["Network Science", "Graph Theory", "Complex Networks", "Network Analysis", "Social Networks"], callForPapersUrl: "https://www.comsoc.org/publications/journals/ieee-tnse" },

  // AI & Embodied Intelligence
  { id: "science_robotics", name: "Science Robotics (AAAS)", impact: "Very High", review: "4-6 months", website: "https://www.science.org/journal/scirobotics", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 99, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Robotics Fundamentals", "Emerging Technologies", "Robot Applications", "Autonomous Systems", "Human-Robot Interaction"], callForPapersUrl: "https://www.science.org/journal/scirobotics" },
  { id: "ieee_tro", name: "IEEE Transactions on Robotics", impact: "Very High", review: "5-7 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 98, isEI: true, isSCI: true, avgPublishTime: "8-12 months", topics: ["Robot Theory", "Motion Control", "Perception", "Planning", "Manipulation"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860" },
  { id: "ieee_ral", name: "IEEE Robotics and Automation Letters (RA-L)", impact: "High", review: "3-4 months", website: "https://www.scimagojr.com/journalsearch.php?q=21100900379", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 92, isEI: true, isSCI: true, avgPublishTime: "4-6 months", topics: ["Robot Innovation", "Autonomous Systems", "Control", "Sensing", "Emerging Applications"], callForPapersUrl: "https://www.scimagojr.com/journalsearch.php?q=21100900379" },
  { id: "rcim", name: "Robotics and Computer-Integrated Manufacturing", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/robotics-and-computer-integrated-manufacturing", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 85, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Industrial Robotics", "Manufacturing Systems", "Integration", "Automation", "Smart Manufacturing"], callForPapersUrl: "https://www.sciencedirect.com/journal/robotics-and-computer-integrated-manufacturing" },
  { id: "jfr", name: "Journal of Field Robotics", impact: "High", review: "4-6 months", website: "https://onlinelibrary.wiley.com/journal/15564967", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 88, isEI: true, isSCI: true, avgPublishTime: "7-10 months", topics: ["Field Robotics", "Outdoor Applications", "Autonomous Navigation", "Real-World Deployment", "Practical Systems"], callForPapersUrl: "https://onlinelibrary.wiley.com/journal/15564967" },
  { id: "soft_robotics", name: "Soft Robotics", impact: "High", review: "3-4 months", website: "https://www.liebertpub.com/journal/soro", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 84, isEI: true, isSCI: true, avgPublishTime: "5-7 months", topics: ["Soft Robots", "Flexible Materials", "Bio-inspired Design", "Compliant Mechanisms", "Novel Materials"], callForPapersUrl: "https://www.liebertpub.com/journal/soro" },
  { id: "robotics_mdpi", name: "Robotics (MDPI - Open Access)", impact: "Medium", review: "2-3 months", website: "https://www.mdpi.com/journal/robotics", difficulty: "Low-Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 76, isEI: true, isSCI: true, avgPublishTime: "3-5 months", topics: ["Robot Systems", "Design", "Theory", "Applications", "Emerging Topics"], callForPapersUrl: "https://www.mdpi.com/journal/robotics" },
  { id: "ieee_tmech", name: "IEEE/ASME Transactions on Mechatronics", impact: "High", review: "4-6 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=3516", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 86, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Mechatronics", "Control Systems", "Sensing", "Actuators", "Integrated Systems"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=3516" },
  { id: "autonomous_robots", name: "Autonomous Robots", impact: "High", review: "4-6 months", website: "https://www.springer.com/journal/10514", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 87, isEI: true, isSCI: true, avgPublishTime: "7-10 months", topics: ["Autonomous Systems", "Navigation", "Planning", "Learning", "Decision Making"], callForPapersUrl: "https://www.springer.com/journal/10514" },
  { id: "current_robotics", name: "Current Robotics Reports", impact: "Medium", review: "3-4 months", website: "https://research.com/journal/current-robotics-reports", difficulty: "Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI & Embodied Intelligence", popularity: 78, isEI: true, isSCI: true, avgPublishTime: "4-6 months", topics: ["Robotics Survey", "Emerging Directions", "State-of-the-Art", "Future Trends", "Research Overview"], callForPapersUrl: "https://research.com/journal/current-robotics-reports" },

  // AI & Machine Learning
  { id: "jmlr", name: "Journal of Machine Learning Research (JMLR)", impact: "Very High", review: "4-6 months", website: "https://www.jmlr.org/", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 99, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Machine Learning", "Statistical Learning", "Algorithms", "Theory", "Applications"], callForPapersUrl: "https://www.jmlr.org/" },
  { id: "ai_journal", name: "Artificial Intelligence (Elsevier)", impact: "Very High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/artificial-intelligence", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 97, isEI: true, isSCI: true, avgPublishTime: "7-10 months", topics: ["AI Fundamentals", "Knowledge Representation", "Reasoning", "Planning", "Intelligent Systems"], callForPapersUrl: "https://www.sciencedirect.com/journal/artificial-intelligence" },
  { id: "ieee_tpami", name: "IEEE Transactions on Pattern Analysis and Machine Intelligence", impact: "Very High", review: "5-7 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 98, isEI: true, isSCI: true, avgPublishTime: "8-12 months", topics: ["Pattern Recognition", "Computer Vision", "Machine Learning", "Image Analysis", "Deep Learning"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34" },
  { id: "neural_networks", name: "Neural Networks (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/neural-networks", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 88, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Neural Networks", "Deep Learning", "Learning Algorithms", "Optimization", "Applications"], callForPapersUrl: "https://www.sciencedirect.com/journal/neural-networks" },
  { id: "ieee_tnnls", name: "IEEE Transactions on Neural Networks and Learning Systems", impact: "High", review: "4-6 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5962385", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 86, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Neural Networks", "Learning Systems", "Adaptive Systems", "Fuzzy Systems", "Evolutionary Algorithms"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5962385" },
  { id: "machine_learning_springer", name: "Machine Learning (Springer)", impact: "High", review: "4-6 months", website: "https://link.springer.com/journal/10994", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 90, isEI: true, isSCI: true, avgPublishTime: "7-10 months", topics: ["Machine Learning Theory", "Algorithms", "Applications", "Data Mining", "Computational Learning"], callForPapersUrl: "https://link.springer.com/journal/10994" },
  { id: "info_fusion", name: "Information Fusion (Elsevier)", impact: "Very High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/information-fusion", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 89, isEI: true, isSCI: true, avgPublishTime: "6-8 months", topics: ["Data Fusion", "Multi-Source Information", "Sensor Fusion", "Decision Making", "Integration"], callForPapersUrl: "https://www.sciencedirect.com/journal/information-fusion" },
  { id: "pattern_recognition", name: "Pattern Recognition (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/pattern-recognition", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 85, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Pattern Recognition", "Computer Vision", "Image Processing", "Feature Extraction", "Classification"], callForPapersUrl: "https://www.sciencedirect.com/journal/pattern-recognition" },
  { id: "tmlr", name: "ACM Transactions on Machine Learning Research (TMLR)", impact: "High", review: "3-4 months", website: "https://openreview.net/group?id=TMLR", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 84, isEI: true, isSCI: true, avgPublishTime: "4-6 months", topics: ["Machine Learning Research", "Empirical Studies", "Theory", "Benchmarks", "Reproducibility"], callForPapersUrl: "https://openreview.net/group?id=TMLR" },
  { id: "ftml", name: "Foundations and Trends in Machine Learning", impact: "Very High", review: "3-4 months", website: "https://www.nowpublishers.com/mal", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "AI", popularity: 92, isEI: true, isSCI: true, avgPublishTime: "5-8 months", topics: ["ML Surveys", "Foundations", "Learning Theory", "Deep Learning", "Applications"], callForPapersUrl: "https://www.nowpublishers.com/mal" },

  // Communications - Additional Journals
  { id: "ieee_tit", name: "IEEE Transactions on Information Theory", impact: "Very High", review: "5-7 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=18", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 97, isEI: true, isSCI: true, avgPublishTime: "10-14 months", topics: ["Information Theory", "Coding Theory", "Channel Coding", "Source Coding", "Cryptography"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=18" },
  { id: "ieee_tsp", name: "IEEE Transactions on Signal Processing", impact: "Very High", review: "5-7 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=78", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 96, isEI: true, isSCI: true, avgPublishTime: "8-12 months", topics: ["Signal Processing", "Filtering", "Detection", "Estimation", "Spectral Analysis"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=78" },
  { id: "ieee_jstsp", name: "IEEE Journal of Selected Topics in Signal Processing", impact: "High", review: "4-6 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4200690", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 88, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Signal Processing Applications", "Emerging Topics", "Wireless Signal Processing", "Audio Processing", "Biomedical Signals"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4200690" },
  { id: "computer_networks", name: "Computer Networks (Elsevier)", impact: "High", review: "4-6 months", website: "https://www.sciencedirect.com/journal/computer-networks", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 85, isEI: true, isSCI: true, avgPublishTime: "6-9 months", topics: ["Computer Networks", "Network Protocols", "Network Architecture", "Internet", "Applications"], callForPapersUrl: "https://www.sciencedirect.com/journal/computer-networks" },
  { id: "ieee_jsac_networking", name: "IEEE/ACM Transactions on Networking", impact: "Very High", review: "5-7 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=90", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 95, isEI: true, isSCI: true, avgPublishTime: "10-12 months", topics: ["Network Architecture", "Routing", "Congestion Control", "QoS", "Network Optimization"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=90" },
  { id: "ieee_tvt_comm", name: "IEEE Transactions on Vehicular Technology", impact: "High", review: "4-6 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=25", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 82, isEI: true, isSCI: true, avgPublishTime: "8-10 months", topics: ["Vehicular Communications", "V2X", "Mobile Networks", "Wireless Systems", "5G/6G"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=25" },
  { id: "ieee_twc_comm", name: "IEEE Transactions on Wireless Communications", impact: "Very High", review: "5-7 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7693", difficulty: "High", audience: "PhD students, Researchers", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 98, isEI: true, isSCI: true, avgPublishTime: "10-14 months", topics: ["Wireless Communications", "MIMO", "Channel Modeling", "Fading", "Antenna Design"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7693" },
  { id: "ieee_tmc", name: "IEEE Transactions on Mobile Computing", impact: "High", review: "4-6 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7755", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 86, isEI: true, isSCI: true, avgPublishTime: "7-10 months", topics: ["Mobile Computing", "Wireless Networks", "Mobile Applications", "Edge Computing", "IoT"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7755" },
  { id: "acm_sigcomm", name: "ACM SIGCOMM Computer Communication Review", impact: "High", review: "3-4 months", website: "https://dl.acm.org/journal/ccr", difficulty: "Medium-High", audience: "PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 84, isEI: true, isSCI: true, avgPublishTime: "5-7 months", topics: ["Computer Networks", "Internet", "Network Protocols", "Performance", "Security"], callForPapersUrl: "https://dl.acm.org/journal/ccr" },
  { id: "ieee_access_comm", name: "IEEE Access (Communications Track)", impact: "Medium", review: "2-3 months", website: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639", difficulty: "Low-Medium", audience: "Master & PhD students", deadline: "2026-12-31", daysUntilDeadline: 347, category: "Traditional Communications", popularity: 72, isEI: true, isSCI: true, avgPublishTime: "2-3 months", topics: ["Communications", "Networking", "Signal Processing", "Wireless Systems", "Applications"], callForPapersUrl: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639" },
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
  if (category === "AI") return "bg-indigo-100 text-indigo-800";
  if (category === "Traditional Communications") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
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
  const [, setUpdateTrigger] = useState(0); // 用于触发重新渲染以更新倒计时

  // 实时更新倒计时
  useEffectTimer(() => {
    const timer = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 1000); // 每秒更新一次
    
    return () => clearInterval(timer);
  }, []);

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
          <p className="text-lg text-blue-50 mb-2">Your Guide to Top Conferences & Journals</p>
          <p className="text-sm text-blue-100 mb-6">40 Conferences + 53 Journals across 4 Research Areas</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-blue-100 mb-6">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded"></span>EI Indexed (Engineering Index)</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded"></span>Scopus Indexed</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-400 rounded"></span>SCI Indexed (Science Citation Index)</div>
          </div>
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
                            {conf.isEI && <Badge className="bg-green-100 text-green-800">✓ EI Indexed</Badge>}
                            {conf.isScoped && <Badge className="bg-blue-100 text-blue-800">✓ Scopus Indexed</Badge>}
                          </div>
                          <div className={`text-sm font-semibold ${getDeadlineColor(conf.daysUntilDeadline)}`}>
                            📅 Deadline: {conf.deadline} | ⏱️ {formatTimeRemaining(conf.deadline)}
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
                            {journal.isSCI && <Badge className="bg-purple-100 text-purple-800">✓ SCI Indexed</Badge>}
                          </div>
                          <div className={`text-sm font-semibold ${getDeadlineColor(journal.daysUntilDeadline)}`}>
                            📅 Deadline: {journal.deadline} | ⏱️ {formatTimeRemaining(journal.deadline)}
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

