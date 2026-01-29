import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { MockDataProvider } from "@/lib/mock-data";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TaxpayerFile from "@/pages/taxpayer-file";
import TaxpayersList from "@/pages/taxpayers-list";
import NewTaxpayer from "@/pages/new-taxpayer";
import AuditDesk from "@/pages/audit-desk";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/taxpayers" component={TaxpayersList} />
      <Route path="/taxpayers/new" component={NewTaxpayer} />
      <Route path="/taxpayers/:id" component={TaxpayerFile} />
      <Route path="/processes/:id" component={AuditDesk} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <ThemeProvider>
      <MockDataProvider>
        <TooltipProvider>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between gap-2 px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </MockDataProvider>
    </ThemeProvider>
  );
}

export default App;
