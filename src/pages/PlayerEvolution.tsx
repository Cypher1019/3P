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
import { getPlayerStats, NBAPlayer } from "@/data/nbaDataService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, TrendingUp, Target, Trophy, Search } from "lucide-react";

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

const PlayerEvolution = () => {
  const { players, loading, error } = useNBAData();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique player names for the dropdown
  const playerNames = useMemo(() => {
    return [...new Set(players.map(p => p.PLAYER_NAME))].sort();
  }, [players]);

  // Filter players based on search
  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return playerNames;
    return playerNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [playerNames, searchTerm]);

  // Get selected player data
  const playerData = useMemo(() => {
    if (!selectedPlayer) return null;
    return getPlayerStats(players, selectedPlayer);
  }, [players, selectedPlayer]);

  // Get top performers for comparison
  const topPerformers = useMemo(() => {
    const top3PA = players.sort((a, b) => b.FG3A - a.FG3A).slice(0, 5);
    const top3PM = players.sort((a, b) => b.FG3M - a.FG3M).slice(0, 5);
    const top3PPercentage = players.sort((a, b) => b.FG3_PCT - a.FG3_PCT).slice(0, 5);
    
    return { top3PA, top3PM, top3PPercentage };
  }, [players]);

  // Chart data for player comparison
  const comparisonChartData = useMemo(() => {
    if (!playerData) return null;

    const top5Attempts = topPerformers.top3PA;
    const top5Made = topPerformers.top3PM;
    const top5Percentage = topPerformers.top3PPercentage;

    return {
      attempts: {
        labels: top5Attempts.map(p => p.PLAYER_NAME),
        datasets: [{
          label: '3PT Attempts',
          data: top5Attempts.map(p => p.FG3A),
          backgroundColor: top5Attempts.map((p, i) => 
            p.PLAYER_NAME === selectedPlayer ? 'rgba(59, 130, 246, 0.8)' : 'rgba(156, 163, 175, 0.6)'
          ),
          borderColor: top5Attempts.map((p, i) => 
            p.PLAYER_NAME === selectedPlayer ? 'rgba(59, 130, 246, 1)' : 'rgba(156, 163, 175, 1)'
          ),
          borderWidth: 2,
        }]
      },
      made: {
        labels: top5Made.map(p => p.PLAYER_NAME),
        datasets: [{
          label: '3PT Made',
          data: top5Made.map(p => p.FG3M),
          backgroundColor: top5Made.map((p, i) => 
            p.PLAYER_NAME === selectedPlayer ? 'rgba(34, 197, 94, 0.8)' : 'rgba(156, 163, 175, 0.6)'
          ),
          borderColor: top5Made.map((p, i) => 
            p.PLAYER_NAME === selectedPlayer ? 'rgba(34, 197, 94, 1)' : 'rgba(156, 163, 175, 1)'
          ),
          borderWidth: 2,
        }]
      },
      percentage: {
        labels: top5Percentage.map(p => p.PLAYER_NAME),
        datasets: [{
          label: '3PT Percentage',
          data: top5Percentage.map(p => p.FG3_PCT),
          backgroundColor: top5Percentage.map((p, i) => 
            p.PLAYER_NAME === selectedPlayer ? 'rgba(168, 85, 247, 0.8)' : 'rgba(156, 163, 175, 0.6)'
          ),
          borderColor: top5Percentage.map((p, i) => 
            p.PLAYER_NAME === selectedPlayer ? 'rgba(168, 85, 247, 1)' : 'rgba(156, 163, 175, 1)'
          ),
          borderWidth: 2,
        }]
      }
    };
  }, [playerData, selectedPlayer, topPerformers]);

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
            Player Evolution
          </h1>
          <p className="text-xl text-muted-foreground">
            Track individual player three-point shooting performance and compare with all-time greats
          </p>
        </div>

        {/* Player Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger>
                <SelectValue placeholder="Select a player to analyze" />
              </SelectTrigger>
              <SelectContent>
                {filteredPlayers.map((playerName) => (
                  <SelectItem key={playerName} value={playerName}>
                    {playerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Player Stats Summary */}
          {playerData && (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">3PT Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{playerData.FG3A.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Rank: #{playerData.FG3A_RANK}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">3PT Made</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stats-green">{playerData.FG3M.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Rank: #{playerData.FG3M_RANK}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">3PT%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-court-blue">{playerData.FG3_PCT.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Rank: #{playerData.FG3_PCT_RANK}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {selectedPlayer && playerData && (
          <>
            {/* Player Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Career Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Games Played</p>
                      <p className="text-lg font-semibold">{playerData.GP}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Minutes</p>
                      <p className="text-lg font-semibold">{playerData.MIN.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                      <p className="text-lg font-semibold">{playerData.PTS.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assists</p>
                      <p className="text-lg font-semibold">{playerData.AST.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Shooting Efficiency</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">FG%</span>
                        <span className="font-semibold">{(playerData.FG_PCT * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">3PT%</span>
                        <span className="font-semibold">{playerData.FG3_PCT.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">FT%</span>
                        <span className="font-semibold">{(playerData.FT_PCT * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-stats-green" />
                    <span>All-Time Rankings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                          {playerData.FG3A_RANK}
                        </div>
                        <div>
                          <p className="font-semibold">3PT Attempts</p>
                          <p className="text-sm text-muted-foreground">{playerData.FG3A.toLocaleString()} attempts</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-stats-green text-white flex items-center justify-center text-sm font-bold">
                          {playerData.FG3M_RANK}
                        </div>
                        <div>
                          <p className="font-semibold">3PT Made</p>
                          <p className="text-sm text-muted-foreground">{playerData.FG3M.toLocaleString()} made</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-court-blue text-white flex items-center justify-center text-sm font-bold">
                          {playerData.FG3_PCT_RANK}
                        </div>
                        <div>
                          <p className="font-semibold">3PT Percentage</p>
                          <p className="text-sm text-muted-foreground">{playerData.FG3_PCT.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Charts */}
            <Tabs defaultValue="attempts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="attempts">3PT Attempts</TabsTrigger>
                <TabsTrigger value="made">3PT Made</TabsTrigger>
                <TabsTrigger value="percentage">3PT Percentage</TabsTrigger>
              </TabsList>

              <TabsContent value="attempts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 - 3PT Attempts Comparison</CardTitle>
                    <CardDescription>
                      How {selectedPlayer} compares to the all-time leaders in three-point attempts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Bar
                        data={comparisonChartData!.attempts}
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

              <TabsContent value="made" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 - 3PT Made Comparison</CardTitle>
                    <CardDescription>
                      How {selectedPlayer} compares to the all-time leaders in three-point shots made
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Bar
                        data={comparisonChartData!.made}
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
                    <CardTitle>Top 5 - 3PT Percentage Comparison</CardTitle>
                    <CardDescription>
                      How {selectedPlayer} compares to the all-time leaders in three-point shooting percentage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Bar
                        data={comparisonChartData!.percentage}
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
          </>
        )}

        {!selectedPlayer && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Player</h3>
            <p className="text-muted-foreground">
              Choose a player from the dropdown above to analyze their three-point shooting evolution
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerEvolution; 