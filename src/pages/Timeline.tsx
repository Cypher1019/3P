import { useState, useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNBAData } from "@/hooks/useNBAData";
import { getTopPlayers, NBAPlayer } from "@/data/nbaDataService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Clock, TrendingUp, Target, Trophy, Calendar } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Timeline = () => {
  const { players, loading, error } = useNBAData();
  const [selectedEra, setSelectedEra] = useState<string>("all");

  // Define NBA eras
  const eras = [
    { id: "all", name: "All Time", description: "Complete NBA history" },
    { id: "modern", name: "Modern Era (2000+)", description: "Three-point revolution era" },
    { id: "90s", name: "1990s", description: "Rise of the three-pointer" },
    { id: "80s", name: "1980s", description: "Introduction of the three-point line" },
  ];

  // Filter players by era (this is a simplified approach since we don't have exact years)
  const getPlayersByEra = (era: string) => {
    switch (era) {
      case "modern":
        // Filter for players who likely played in modern era (high 3PT attempts)
        return players.filter(p => p.FG3A > 2000);
      case "90s":
        // Filter for players who likely played in 90s (medium 3PT attempts)
        return players.filter(p => p.FG3A > 1000 && p.FG3A <= 2000);
      case "80s":
        // Filter for players who likely played in 80s (lower 3PT attempts)
        return players.filter(p => p.FG3A <= 1000);
      default:
        return players;
    }
  };

  const eraPlayers = useMemo(() => {
    return getPlayersByEra(selectedEra);
  }, [players, selectedEra]);

  // Calculate era statistics
  const eraStats = useMemo(() => {
    if (!eraPlayers.length) return null;

    const totalPlayers = eraPlayers.length;
    const total3PA = eraPlayers.reduce((sum, p) => sum + p.FG3A, 0);
    const total3PM = eraPlayers.reduce((sum, p) => sum + p.FG3M, 0);
    const avg3PPercentage = total3PM / total3PA * 100;
    const avg3PA = total3PA / totalPlayers;

    return {
      totalPlayers,
      total3PA,
      total3PM,
      avg3PPercentage,
      avg3PA
    };
  }, [eraPlayers]);

  // Get top performers for each era
  const eraTopPerformers = useMemo(() => {
    if (!eraPlayers.length) return null;

    const top3PA = getTopPlayers(eraPlayers, 'FG3A', 5);
    const top3PM = getTopPlayers(eraPlayers, 'FG3M', 5);
    const top3PPercentage = getTopPlayers(eraPlayers, 'FG3_PCT', 5);

    return { top3PA, top3PM, top3PPercentage };
  }, [eraPlayers]);

  // Chart data for era comparison
  const eraComparisonData = useMemo(() => {
    const eraData = eras.map(era => {
      const players = getPlayersByEra(era.id);
      const total3PA = players.reduce((sum, p) => sum + p.FG3A, 0);
      const total3PM = players.reduce((sum, p) => sum + p.FG3M, 0);
      const avg3PPercentage = total3PM / total3PA * 100;
      
      return {
        era: era.name,
        total3PA,
        total3PM,
        avg3PPercentage
      };
    });

    return {
      attempts: {
        labels: eraData.map(d => d.era),
        datasets: [{
          label: 'Total 3PT Attempts',
          data: eraData.map(d => d.total3PA),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        }]
      },
      percentage: {
        labels: eraData.map(d => d.era),
        datasets: [{
          label: 'Average 3PT Percentage',
          data: eraData.map(d => d.avg3PPercentage),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
        }]
      }
    };
  }, [players]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading NBA data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading data: {error}</p>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            NBA 3-Point Timeline
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore the historical evolution of three-point shooting across different NBA eras
          </p>
        </div>

        {/* Era Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {eras.map((era) => (
            <Card 
              key={era.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedEra === era.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedEra(era.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Clock className="h-5 w-5" />
                  <span>{era.name}</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  {era.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Era Statistics */}
        {eraStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{eraStats.totalPlayers}</div>
                <p className="text-xs text-muted-foreground">In this era</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total 3PT Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stats-green">{eraStats.total3PA.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Combined attempts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total 3PT Made</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-court-blue">{eraStats.total3PM.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Combined made</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Avg 3PT%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{eraStats.avg3PPercentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Era average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Avg 3PT Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stats-green">{eraStats.avg3PA.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">Per player</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Era Comparison Charts */}
        <Tabs defaultValue="attempts" className="space-y-6 mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attempts">3PT Attempts</TabsTrigger>
            <TabsTrigger value="percentage">3PT Percentage</TabsTrigger>
          </TabsList>

          <TabsContent value="attempts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Era Comparison - 3PT Attempts</CardTitle>
                <CardDescription>
                  Total three-point attempts across different NBA eras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Bar
                    data={eraComparisonData.attempts}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="percentage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Era Comparison - 3PT Percentage</CardTitle>
                <CardDescription>
                  Average three-point shooting percentage across different NBA eras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Bar
                    data={eraComparisonData.percentage}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Top Performers by Era */}
        {eraTopPerformers && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Top 3PT Attempts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eraTopPerformers.top3PA.map((player, index) => (
                    <div key={player.PLAYER_ID} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{player.PLAYER_NAME}</p>
                          <p className="text-xs text-muted-foreground">{player.FG3A.toLocaleString()} attempts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{player.FG3_PCT.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-stats-green" />
                  <span>Top 3PT Made</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eraTopPerformers.top3PM.map((player, index) => (
                    <div key={player.PLAYER_ID} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-stats-green text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{player.PLAYER_NAME}</p>
                          <p className="text-xs text-muted-foreground">{player.FG3M.toLocaleString()} made</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{player.FG3_PCT.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-court-blue" />
                  <span>Top 3PT%</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eraTopPerformers.top3PPercentage.map((player, index) => (
                    <div key={player.PLAYER_ID} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-court-blue text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{player.PLAYER_NAME}</p>
                          <p className="text-xs text-muted-foreground">{player.FG3A.toLocaleString()} attempts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{player.FG3_PCT.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Historical Context */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Historical Context</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">1979-80 Season</h4>
                  <p className="text-sm text-muted-foreground">
                    The NBA introduces the three-point line at 23 feet 9 inches from the basket. 
                    The three-pointer was first used in the ABA in 1967.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">1994-95 Season</h4>
                  <p className="text-sm text-muted-foreground">
                    The three-point line is moved closer to 22 feet to increase scoring. 
                    This change lasted until the 1997-98 season.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2008-09 Season</h4>
                  <p className="text-sm text-muted-foreground">
                    The three-point line is moved back to 23 feet 9 inches, 
                    creating the current distance used today.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2010s-Present</h4>
                  <p className="text-sm text-muted-foreground">
                    The "three-point revolution" begins, with teams and players 
                    increasingly relying on three-point shooting as a primary offensive strategy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timeline; 