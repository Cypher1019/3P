import { useState, useMemo } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";
import FilterPanel from "@/components/ui/filter-panel";
import ChartCard from "@/components/ui/chart-card";
import { useNBAData } from "@/hooks/useNBAData";
import { getTopPlayers, NBAPlayer } from "@/data/nbaDataService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Search } from "lucide-react";

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
  ArcElement
);

const ThreePointExplorer = () => {
  const { players, loading, error } = useNBAData();
  const [filters, setFilters] = useState<{
    player?: string;
    minAttempts?: number;
    minPercentage?: number;
  }>({});

  const [viewType, setViewType] = useState<"attempts" | "made" | "percentage">("attempts");
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!players.length) return [];

    let filtered = [...players];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.PLAYER_NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply player filter
    if (filters.player) {
      filtered = filtered.filter(player => player.PLAYER_NAME === filters.player);
    }

    // Apply minimum attempts filter
    if (filters.minAttempts) {
      filtered = filtered.filter(player => player.FG3A >= filters.minAttempts!);
    }

    // Apply minimum percentage filter
    if (filters.minPercentage) {
      filtered = filtered.filter(player => player.FG3_PCT >= filters.minPercentage!);
    }

    return filtered;
  }, [players, filters, searchTerm]);

  // Prepare filter options
  const filterOptions = {
    players: [...new Set(players.map(p => p.PLAYER_NAME))].map(name => ({ value: name, label: name }))
  };

  // Chart data preparation
  const chartData = useMemo(() => {
    const sortedData = [...filteredData].sort((a, b) => {
      switch (viewType) {
        case "attempts":
          return b.FG3A - a.FG3A;
        case "made":
          return b.FG3M - a.FG3M;
        case "percentage":
          return b.FG3_PCT - a.FG3_PCT;
        default:
          return 0;
      }
    });

    const topPlayers = sortedData.slice(0, 20);

    const getValue = (player: NBAPlayer) => {
      switch (viewType) {
        case "attempts":
          return player.FG3A;
        case "made":
          return player.FG3M;
        case "percentage":
          return player.FG3_PCT;
        default:
          return 0;
      }
    };

    const getLabel = (player: NBAPlayer) => {
      return player.PLAYER_NAME;
    };

    return {
      labels: topPlayers.map(getLabel),
      datasets: [
        {
          label: viewType === "attempts" ? "3PT Attempts" : 
                 viewType === "made" ? "3PT Made" : "3PT Percentage",
          data: topPlayers.map(getValue),
          backgroundColor: viewType === "attempts" ? 'rgba(59, 130, 246, 0.8)' :
                          viewType === "made" ? 'rgba(34, 197, 94, 0.8)' :
                          'rgba(168, 85, 247, 0.8)',
          borderColor: viewType === "attempts" ? 'rgba(59, 130, 246, 1)' :
                      viewType === "made" ? 'rgba(34, 197, 94, 1)' :
                      'rgba(168, 85, 247, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [filteredData, viewType]);

  // Doughnut chart data for percentage distribution
  const doughnutData = useMemo(() => {
    const percentageRanges = [
      { label: '40%+', min: 40, color: 'rgba(34, 197, 94, 0.8)' },
      { label: '35-40%', min: 35, max: 39.99, color: 'rgba(59, 130, 246, 0.8)' },
      { label: '30-35%', min: 30, max: 34.99, color: 'rgba(251, 191, 36, 0.8)' },
      { label: '<30%', max: 29.99, color: 'rgba(239, 68, 68, 0.8)' },
    ];

    const distribution = percentageRanges.map(range => {
      const count = filteredData.filter(player => {
        if (range.min !== undefined && range.max !== undefined) {
          return player.FG3_PCT >= range.min && player.FG3_PCT < range.max;
        } else if (range.min !== undefined) {
          return player.FG3_PCT >= range.min;
        } else if (range.max !== undefined) {
          return player.FG3_PCT < range.max;
        }
        return false;
      }).length;
      return count;
    });

    return {
      labels: percentageRanges.map(r => r.label),
      datasets: [
        {
          data: distribution,
          backgroundColor: percentageRanges.map(r => r.color),
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [filteredData]);

  const handleDownload = (chartType: string) => {
    // Implementation for downloading chart data
    console.log(`Downloading ${chartType} data`);
  };

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
            3-Point Explorer
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore all-time NBA three-point shooting statistics with interactive visualizations
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={filterOptions}
            />
          </div>
          
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">View Type</label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as any)}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="attempts">3PT Attempts</option>
                <option value="made">3PT Made</option>
                <option value="percentage">3PT Percentage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{filteredData.length}</div>
              <p className="text-sm text-muted-foreground">Filtered results</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average 3PT%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-stats-green">
                {(filteredData.reduce((sum, p) => sum + p.FG3_PCT, 0) / filteredData.length || 0).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Among filtered players</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total 3PT Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-court-blue">
                {filteredData.reduce((sum, p) => sum + p.FG3A, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Combined attempts</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="bar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="doughnut">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <ChartCard
              title={`Top 20 Players - ${viewType === "attempts" ? "3PT Attempts" : 
                      viewType === "made" ? "3PT Made" : "3PT Percentage"}`}
              description="All-time leaders in three-point shooting"
            >
              <div className="h-96">
                <Bar
                  data={chartData}
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
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload("bar")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Data
                </Button>
              </div>
            </ChartCard>
          </TabsContent>

          <TabsContent value="line" className="space-y-4">
            <ChartCard
              title="Trend Analysis"
              description="Three-point shooting trends over player rankings"
            >
              <div className="h-96">
                <Line
                  data={chartData}
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
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload("line")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Data
                </Button>
              </div>
            </ChartCard>
          </TabsContent>

          <TabsContent value="doughnut" className="space-y-4">
            <ChartCard
              title="3PT Percentage Distribution"
              description="Distribution of players by shooting percentage"
            >
              <div className="h-96">
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload("doughnut")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Data
                </Button>
              </div>
            </ChartCard>
          </TabsContent>
        </Tabs>

        {/* Data Table */}
        <div className="mt-8">
          <ChartCard
            title="Player Data"
            description="Detailed statistics for all filtered players"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Player</th>
                    <th className="text-right p-2">Games</th>
                    <th className="text-right p-2">3PT Made</th>
                    <th className="text-right p-2">3PT Attempts</th>
                    <th className="text-right p-2">3PT%</th>
                    <th className="text-right p-2">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .sort((a, b) => b.FG3A - a.FG3A)
                    .slice(0, 50)
                    .map((player, index) => (
                      <tr key={player.PLAYER_ID} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{player.PLAYER_NAME}</td>
                        <td className="p-2 text-right">{player.GP}</td>
                        <td className="p-2 text-right">{player.FG3M.toLocaleString()}</td>
                        <td className="p-2 text-right">{player.FG3A.toLocaleString()}</td>
                        <td className="p-2 text-right">{player.FG3_PCT.toFixed(1)}%</td>
                        <td className="p-2 text-right">{player.FG3A_RANK}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default ThreePointExplorer;