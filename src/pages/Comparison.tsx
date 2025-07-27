import { useState, useMemo } from "react";
import { Bar, Radar, Line } from "react-chartjs-2";
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
  RadialLinearScale,
  Filler,
} from "chart.js";
import { useNBAData } from "@/hooks/useNBAData";
import { getPlayerStats, NBAPlayer } from "@/data/nbaDataService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Target, TrendingUp, Trophy, BarChart3 } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

const Comparison = () => {
  const { players, loading, error } = useNBAData();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<string>("shooting");

  const topPlayers = useMemo(() => {
    if (!players.length) return [];
    return players.slice(0, 20); // Top 20 players for selection
  }, [players]);

  const selectedPlayerData = useMemo(() => {
    if (!selectedPlayers.length) return [];
    return players.filter(player => selectedPlayers.includes(player.PLAYER_NAME));
  }, [players, selectedPlayers]);

  const handlePlayerSelect = (playerName: string) => {
    if (selectedPlayers.includes(playerName)) {
      setSelectedPlayers(selectedPlayers.filter(name => name !== playerName));
    } else if (selectedPlayers.length < 5) {
      setSelectedPlayers([...selectedPlayers, playerName]);
    }
  };

  const comparisonData = useMemo(() => {
    if (!selectedPlayerData.length) return null;

    const labels = selectedPlayerData.map(player => player.PLAYER_NAME);
    
    switch (comparisonType) {
      case "shooting":
        return {
          labels,
          datasets: [
            {
              label: "3-Point Attempts",
              data: selectedPlayerData.map(player => player.FG3A),
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
            },
            {
              label: "3-Point Makes",
              data: selectedPlayerData.map(player => player.FG3M),
              backgroundColor: "rgba(34, 197, 94, 0.8)",
              borderColor: "rgba(34, 197, 94, 1)",
              borderWidth: 2,
            },
          ],
        };
      case "efficiency":
        return {
          labels,
          datasets: [
            {
              label: "3-Point %",
              data: selectedPlayerData.map(player => player.FG3_PCT * 100),
              backgroundColor: "rgba(168, 85, 247, 0.8)",
              borderColor: "rgba(168, 85, 247, 1)",
              borderWidth: 2,
            },
            {
              label: "True Shooting %",
              data: selectedPlayerData.map(player => player.TS_PCT * 100),
              backgroundColor: "rgba(251, 146, 60, 0.8)",
              borderColor: "rgba(251, 146, 60, 1)",
              borderWidth: 2,
            },
          ],
        };
      case "radar":
        return {
          labels: ["3-Point Makes", "3-Point %", "Games Played", "Minutes", "Points"],
          datasets: selectedPlayerData.map((player, index) => ({
            label: player.PLAYER_NAME,
            data: [
              player.FG3M,
              player.FG3_PCT * 100,
              player.GP,
              player.MIN,
              player.PTS,
            ],
            backgroundColor: `hsla(${index * 60}, 70%, 60%, 0.2)`,
            borderColor: `hsl(${index * 60}, 70%, 50%)`,
            borderWidth: 2,
            pointBackgroundColor: `hsl(${index * 60}, 70%, 50%)`,
          })),
        };
      default:
        return null;
    }
  }, [selectedPlayerData, comparisonType]);

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
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Player Comparison
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare three-point shooting statistics between NBA players
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Selected Players
              </CardTitle>
              <CardDescription>
                Choose up to 5 players to compare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topPlayers.map((player) => (
                  <div
                    key={player.PLAYER_ID}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPlayers.includes(player.PLAYER_NAME)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handlePlayerSelect(player.PLAYER_NAME)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{player.PLAYER_NAME}</span>
                      {selectedPlayers.includes(player.PLAYER_NAME) && (
                        <Badge variant="secondary">{player.FG3M} 3PM</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Quick Stats
              </CardTitle>
              <CardDescription>
                Summary of selected players
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPlayerData.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="text-center font-medium">3PM</div>
                      <div className="text-center font-medium">3PA</div>
                      <div className="text-center font-medium">3P%</div>
                      <div className="text-center font-medium">Games</div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedPlayerData.map((player) => (
                        <div key={player.PLAYER_ID} className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-primary">{player.FG3M}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-primary">{player.FG3A}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-primary">{(player.FG3_PCT * 100).toFixed(1)}%</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-primary">{player.GP}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground">
                        {selectedPlayerData.map((player) => (
                          <div key={player.PLAYER_ID} className="text-center font-medium truncate">
                            {player.PLAYER_NAME}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Select players to see stats
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedPlayerData.length > 0 && comparisonData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Comparison Chart
              </CardTitle>
              <CardDescription>
                Visual comparison of selected players
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {comparisonType === "radar" ? (
                  <Radar
                    data={comparisonData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                        title: {
                          display: true,
                          text: "Player Comparison Radar Chart",
                        },
                      },
                      scales: {
                        r: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                ) : (
                  <Bar
                    data={comparisonData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                        title: {
                          display: true,
                          text: `Player Comparison - ${comparisonType.charAt(0).toUpperCase() + comparisonType.slice(1)}`,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedPlayerData.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Players Selected</h3>
              <p className="text-muted-foreground">
                Select players from the left panel to start comparing their statistics
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Comparison; 