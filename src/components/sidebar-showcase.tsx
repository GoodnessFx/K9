"use client" 
  
 import { 
   Sidebar, 
   SidebarContent, 
   SidebarGroup, 
   SidebarGroupLabel, 
   SidebarGroupContent, 
   SidebarMenu, 
   SidebarMenuItem, 
   SidebarMenuButton, 
   SidebarFooter, 
 } from "@/components/ui/sidebar" 
  
 import { 
   DropdownMenu, 
   DropdownMenuTrigger, 
   DropdownMenuContent, 
   DropdownMenuLabel, 
   DropdownMenuSeparator, 
   DropdownMenuItem, 
 } from "@/components/ui/dropdown-menu" 
  
 import { Button } from "@/components/ui/button" 
  
 import { 
   ChevronsUpDown, 
   ChevronDown, 
   Zap,
   TrendingUp,
   Shield,
   Archive,
   Code,
   Inbox,
   Settings
 } from "lucide-react" 
  
 import { Link, useLocation } from "react-router-dom"
 import { useState } from "react" 
 import { motion, AnimatePresence } from "motion/react" 
 import { K9Logo } from "./K9Logo"
 import { cn } from "@/lib/utils"

 interface SidebarItem {
   title: string;
   url: string;
   icon: any;
   status?: string;
 }

 interface SidebarGroupData {
   label: string;
   items: (SidebarItem | { sublabel: string; children: SidebarItem[] })[];
 }
  
 /* ---------------- Top Team Switcher ---------------- */ 
 function TeamSwitcher() { 
   return ( 
     <DropdownMenu> 
       <DropdownMenuTrigger asChild> 
         <Button 
           variant="ghost" 
           className="w-full justify-start gap-3 mb-3 font-bold text-white hover:bg-white/5 h-12 px-2" 
         > 
           <div className="flex items-center gap-3">
             <K9Logo size={32} animated={true} />
             <span className="text-lg tracking-tighter">K9 Terminal</span>
           </div>
           <ChevronsUpDown className="ml-auto h-4 w-4 opacity-30" /> 
         </Button> 
       </DropdownMenuTrigger> 
  
       <DropdownMenuContent className="w-56 bg-[#0D0F14] border-white/10 text-white"> 
         <DropdownMenuLabel className="text-white/40 text-[10px] font-black uppercase tracking-widest">Select Sector</DropdownMenuLabel> 
         <DropdownMenuSeparator className="bg-white/5" /> 
         <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer font-bold">Alpha Hunting</DropdownMenuItem> 
         <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer font-bold">Risk Management</DropdownMenuItem> 
         <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer font-bold">Tech Intel</DropdownMenuItem> 
       </DropdownMenuContent> 
     </DropdownMenu> 
   ) 
 } 
  
 /* ---------------- Footer User Menu ---------------- */ 
 function UserMenu() { 
   return ( 
     <DropdownMenu> 
       <DropdownMenuTrigger asChild> 
         <Button 
           variant="ghost" 
           className="w-full justify-between gap-3 h-14 px-3 hover:bg-white/5 text-white" 
         > 
           <div className="flex items-center gap-3"> 
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-lg shadow-purple-600/20">
               AD
             </div>
             <div className="flex flex-col items-start"> 
               <span className="text-sm font-bold">Admin</span> 
               <span className="text-[10px] text-white/30 font-black uppercase tracking-tighter"> 
                 Level 4 Access 
               </span> 
             </div> 
           </div> 
           <ChevronsUpDown className="h-4 w-4 opacity-30" /> 
         </Button> 
       </DropdownMenuTrigger> 
  
       <DropdownMenuContent className="w-56 bg-[#0D0F14] border-white/10 text-white" align="end" side="right"> 
         <DropdownMenuLabel className="text-white/40 text-[10px] font-black uppercase tracking-widest">Account Status</DropdownMenuLabel> 
         <DropdownMenuSeparator className="bg-white/5" /> 
         <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer font-bold">Profile Settings</DropdownMenuItem> 
         <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer font-bold">Security Keys</DropdownMenuItem> 
         <DropdownMenuSeparator className="bg-white/5" /> 
         <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer font-bold text-xs uppercase tracking-widest">Terminate Session</DropdownMenuItem> 
       </DropdownMenuContent> 
     </DropdownMenu> 
   ) 
 } 
  
 /* ---------------- Status Badge ---------------- */ 
 function StatusBadge({ status }: { status?: string }) { 
   if (!status) return null 
   const colors: Record<string, string> = { 
     Live: "bg-green-500/10 text-green-500 border-green-500/20", 
     Alpha: "bg-purple-500/10 text-purple-500 border-purple-500/20", 
     "New": "bg-blue-500/10 text-blue-500 border-blue-500/20", 
   } 
   return ( 
     <span 
       className={cn(
         "ml-auto px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
         colors[status] || "bg-white/5 text-white/40 border-white/10"
       )} 
     > 
       {status} 
     </span> 
   ) 
 } 
  
 /* ---------------- Sidebar Data ---------------- */ 
const sidebarData: SidebarGroupData[] = [ 
  { 
    label: "Main", 
    items: [ 
      { title: "Dispatch", url: "/feed", icon: Zap, status: "Live" }, 
      { title: "Hunt", url: "/hunt", icon: TrendingUp, status: "Alpha" }, 
    ], 
  }, 
  { 
    label: "Work", 
    items: [ 
      { 
        sublabel: "Projects", 
        children: [ 
          { title: "Jobs", url: "/jobs", icon: Code }, 
          { title: "Bounty", url: "/free-money", icon: Archive, status: "New" }, 
          { title: "Airdrops", url: "/free-money", icon: Shield }, 
        ], 
      }, 
      { 
        sublabel: "Settings", 
        children: [
          { title: "Preferences", url: "/settings", icon: Settings },
        ], 
      }, 
      { 
        title: "K9 Vault", 
        url: "/saved", 
        icon: Inbox, 
      }, 
    ], 
  }, 
] 
  
 /* ---------------- Collapsible Subgroup ---------------- */ 
 function CollapsibleSubGroup({ 
   sublabel, 
   childrenItems, 
 }: { 
   sublabel: string 
   childrenItems: SidebarItem[] 
 }) { 
   const [open, setOpen] = useState(true) 
   const location = useLocation()
   
   return ( 
     <div className="mb-2"> 
       <button 
         onClick={() => setOpen(!open)} 
         className="flex w-full justify-between items-center px-4 py-2 text-[10px] font-black text-white/20 hover:text-white/60 transition uppercase tracking-widest" 
       > 
         {sublabel} 
         <ChevronDown 
           className={cn("h-3 w-3 transition-transform duration-200", open ? "rotate-180" : "")} 
         /> 
       </button> 
  
       <AnimatePresence initial={false}> 
         {open && ( 
           <motion.div 
             initial={{ height: 0, opacity: 0 }} 
             animate={{ height: "auto", opacity: 1 }} 
             exit={{ height: 0, opacity: 0 }} 
             transition={{ duration: 0.25, ease: "easeInOut" }} 
             className="overflow-hidden" 
           > 
             <SidebarMenu className="px-2 space-y-1"> 
               {childrenItems.map((item) => {
                 const isActive = location.pathname === item.url;
                 const Icon = item.icon;
                 return ( 
                   <SidebarMenuItem key={item.title}> 
                     <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        isActive={isActive}
                        className={cn(
                          "rounded-xl transition-all h-10",
                          isActive 
                            ? "bg-white text-black shadow-lg shadow-white/5" 
                            : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                      > 
                       <Link 
                         to={item.url} 
                         className="flex items-center w-full px-3" 
                       > 
                         <Icon className={cn("h-4 w-4 mr-3", isActive ? "text-black" : "text-inherit")} /> 
                         <span className="text-sm font-bold tracking-tight">{item.title}</span> 
                         <StatusBadge status={item.status} /> 
                       </Link> 
                     </SidebarMenuButton> 
                   </SidebarMenuItem> 
                 );
               })} 
             </SidebarMenu> 
           </motion.div> 
         )} 
       </AnimatePresence> 
     </div> 
   ) 
 } 
  
 /* ---------------- Main Sidebar ---------------- */ 
 export function SidebarDemo() { 
   const location = useLocation()
   
   return ( 
     <Sidebar className="bg-[#07090D] border-r border-white/5"> 
       <SidebarContent className="custom-scrollbar overflow-x-hidden"> 
         <div className="p-4"> 
           <TeamSwitcher /> 
         </div> 
  
         {sidebarData.map((group) => ( 
           <SidebarGroup key={group.label} className="px-0"> 
             <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 px-6 mb-2"> 
               {group.label} 
             </SidebarGroupLabel> 
  
             <SidebarGroupContent> 
               {group.label === "Work" ? ( 
                 <> 
                   {group.items.map((item: any, idx: number) => 
                     item.children ? ( 
                       <CollapsibleSubGroup 
                         key={item.sublabel || idx} 
                         sublabel={item.sublabel} 
                         childrenItems={item.children} 
                       /> 
                     ) : ( 
                       <SidebarMenu key={item.title || idx} className="px-2 mb-1"> 
                         <SidebarMenuItem> 
                           <SidebarMenuButton 
                            asChild 
                            tooltip={item.title}
                            isActive={location.pathname === item.url}
                            className={cn(
                              "rounded-xl transition-all h-10 px-3",
                              location.pathname === item.url
                                ? "bg-white text-black" 
                                : "text-white/40 hover:bg-white/5 hover:text-white"
                            )}
                           > 
                             <Link 
                               to={item.url} 
                               className="flex items-center w-full" 
                             > 
                               {(() => {
                                 const Icon = item.icon;
                                 return <Icon className="h-4 w-4 mr-3" />;
                               })()}
                               <span className="text-sm font-bold tracking-tight">{item.title}</span> 
                               <StatusBadge status={item.status} /> 
                             </Link> 
                           </SidebarMenuButton> 
                         </SidebarMenuItem> 
                       </SidebarMenu> 
                     ) 
                   )} 
                 </> 
               ) : ( 
                 <SidebarMenu className="px-2 space-y-1"> 
                   {group.items.map((item: any, idx: number) => {
                     const isActive = location.pathname === item.url;
                     const Icon = item.icon;
                     return ( 
                       <SidebarMenuItem key={item.title || idx}> 
                         <SidebarMenuButton 
                          asChild 
                          tooltip={item.title}
                          isActive={isActive}
                          className={cn(
                            "rounded-xl transition-all h-11 px-3",
                            isActive 
                              ? "bg-white text-black shadow-lg shadow-white/5" 
                              : "text-white/40 hover:bg-white/5 hover:text-white"
                          )}
                         > 
                           <Link 
                             to={item.url} 
                             className="flex items-center w-full" 
                           > 
                             <Icon className={cn("h-4.5 w-4.5 mr-3", isActive ? "text-black" : "text-inherit")} /> 
                             <span className="text-sm font-bold tracking-tight">{item.title}</span> 
                             <StatusBadge status={item.status} /> 
                           </Link> 
                         </SidebarMenuButton> 
                       </SidebarMenuItem> 
                     );
                   })} 
                 </SidebarMenu> 
               )} 
             </SidebarGroupContent> 
           </SidebarGroup> 
         ))} 
       </SidebarContent> 
  
       {/* Footer dropdown menu */} 
       <SidebarFooter className="p-4 border-t border-white/5 bg-[#07090D]"> 
         <UserMenu /> 
       </SidebarFooter> 
     </Sidebar> 
   ) 
 } 
