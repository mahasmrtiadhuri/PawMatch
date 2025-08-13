import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/home";
import FindDogs from "@/pages/find-dogs";
import DogProfile from "@/pages/dog-profile";
import Shelters from "@/pages/shelters";
import MatchQuiz from "@/pages/match-quiz";
import Recommendations from "@/pages/recommendations";
import Favorites from "@/pages/favorites";
import ShelterDashboard from "@/pages/shelter-dashboard";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-dogs" component={FindDogs} />
      <Route path="/dog/:id" component={DogProfile} />
      <Route path="/shelters" component={Shelters} />
      <Route path="/match-quiz" component={MatchQuiz} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/shelter-dashboard" component={ShelterDashboard} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
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
