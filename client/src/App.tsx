import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Planning from "@/pages/planning";
import EventManagement from "@/pages/event-management";
import ServiceOperations from "@/pages/service-operations";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="flex flex-col h-screen bg-white" style={{ color: '#1b244d' }}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/planning" component={Planning} />
            <Route path="/event-management" component={EventManagement} />
            <Route path="/service-operations" component={ServiceOperations} />
            <Route>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-2" style={{ color: '#1b244d' }}>404 - Page Not Found</h1>
                  <p className="text-gray-500">The requested page could not be found.</p>
                </div>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
