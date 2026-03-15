import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import RadioMode from "./pages/RadioMode";
import Genre from "./pages/Genre";
import Artists from "./pages/Artists";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Submit from "./pages/Submit";
import Stats from "./pages/Stats";
import Suggestions from "./pages/Suggestions";
import Festivals from "./pages/Festivals";
import FestivalSubmit from "./pages/FestivalSubmit";
import Community from "./pages/Community";
import Underground from "./pages/Underground";
import AuthCallback from "./pages/AuthCallback";
import { PersistentPlayer } from "./components/PersistentPlayer";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/radio"} component={RadioMode} />
      <Route path={"/genre/:id"} component={Genre} />
      <Route path={"/artists"} component={Artists} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/submit"} component={Submit} />
      <Route path={"/stats"} component={Stats} />
      <Route path={"/suggestions"} component={Suggestions} />
      <Route path={"/festivals"} component={Festivals} />
      <Route path={"/festivals/submit"} component={FestivalSubmit} />
      <Route path={"/community"} component={Community} />
      <Route path={"/underground"} component={Underground} />
      <Route path={"/auth/callback"} component={AuthCallback} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <PersistentPlayer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
